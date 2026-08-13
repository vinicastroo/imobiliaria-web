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
import { BackLink } from '@/components/back-link'
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
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto w-full max-w-[1400px] p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-4">
            <BackLink href="/admin" />
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-primary text-2xl font-bold">CRM</h1>
                <p className="text-sm text-gray-500">
                  Acompanhe o relacionamento com seus contatos.
                </p>
              </div>
              <Button onClick={handleCreate}>
                <UserPlus className="mr-2 h-4 w-4" /> Novo Contato
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 py-24">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando contatos...
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
        </main>
      </div>
    </FeatureGate>
  )
}
