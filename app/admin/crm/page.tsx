'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { AdminPage, PageHeader } from '@/components/admin/page'
import { Skeleton } from '@/components/ui/skeleton'
import { FeatureGate } from '@/components/feature-gate'
import { CrmContactDialog } from '@/components/crm-contact-dialog'
import { CrmKanbanBoard, type CrmContact } from '@/components/crm-kanban-board'
import { type ClientStage } from '@/components/crm-stage-colors'

export default function CrmPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userRole = session?.user?.role
  const isRealtor = userRole === 'REALTOR'
  const realtorProfileId = session?.user?.realtorProfileId

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null)
  const [deleteId, setDeleteId] = useState('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery<CrmContact[]>({
    queryKey: ['crm-contacts', isRealtor ? realtorProfileId : 'all'],
    queryFn: async () => {
      const params = isRealtor && realtorProfileId ? `?realtorId=${realtorProfileId}` : ''
      return (await api.get(`/clientes${params}`)).data
    },
  })

  const { data: stages = [], isLoading: isLoadingStages } = useQuery<ClientStage[]>({
    queryKey: ['crm-stages'],
    queryFn: async () => (await api.get('/crm-stages')).data,
  })

  const isLoading = isLoadingContacts || isLoadingStages

  const deleteMutation = useMutation({
    mutationFn: async () => api.delete(`/clientes/${deleteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] })
      toast.success('Contato removido')
      setIsDeleteOpen(false)
      setDeleteId('')
    },
    onError: () => toast.error('Erro ao remover contato'),
  })

  const handleCreate = () => {
    setSelectedContact(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (contact: CrmContact) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  return (
    <FeatureGate feature="clients">
      <AdminPage width="wide">
        <PageHeader
          title="CRM"
          description="Acompanhe cada contato do primeiro interesse ao fechamento."
          actions={
            <Button onClick={handleCreate}>
              <UserPlus className="h-4 w-4" /> Novo contato
            </Button>
          }
        />

        {isLoading ? (
          <div
            className="flex flex-col gap-4 md:flex-row md:overflow-hidden"
            aria-busy="true"
            aria-label="Carregando contatos"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-xl border border-[var(--scala-border)] bg-[var(--scala-paper)] p-3 md:h-[calc(100vh-240px)] md:min-h-[480px] md:w-[300px] md:shrink-0"
              >
                <Skeleton className="mb-2 h-4 w-28" />
                {Array.from({ length: 3 - (i % 2) }).map((__, j) => (
                  <Skeleton key={j} className="h-24 w-full rounded-lg bg-white" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <CrmKanbanBoard
            contacts={contacts}
            stages={stages}
            isRealtor={isRealtor}
            realtorProfileId={realtorProfileId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <CrmContactDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          contactToEdit={selectedContact}
          isRealtor={isRealtor}
          currentRealtorId={realtorProfileId}
        />

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">Excluir contato?</AlertDialogTitle>
              <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminPage>
    </FeatureGate>
  )
}
