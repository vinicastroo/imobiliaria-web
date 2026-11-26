'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BadgeCheck, Loader2, Phone, Plus, UserRound } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'
import { RealtorDialog, Realtor } from '@/components/realtor-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminPage, PageHeader } from '@/components/admin/page'
import { EmptyState, RowActions } from '@/components/admin/states'
import { Stagger, StaggerItem } from '@/components/motion'

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function CorretoresPage() {
  const queryClient = useQueryClient()

  // --- Estados para controlar o Modal ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRealtor, setSelectedRealtor] = useState<Realtor | null>(null)
  const [deleteRealtor, setDeleteRealtor] = useState<Realtor | null>(null)

  const { data: realtors, isLoading } = useQuery<Realtor[]>({
    queryKey: ['realtors'],
    queryFn: async () => (await api.get('/corretor')).data,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/corretor/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realtors'] })
      toast.success('Corretor removido')
      setDeleteRealtor(null)
    },
    onError: () => {
      toast.error('Não foi possível remover o corretor. Tente de novo.')
    },
  })

  // Função para abrir modal de criação
  const handleCreate = () => {
    setSelectedRealtor(null)
    setIsDialogOpen(true)
  }

  // Função para abrir modal de edição
  const handleEdit = (realtor: Realtor) => {
    setSelectedRealtor(realtor)
    setIsDialogOpen(true)
  }

  const createButton = (
    <Button onClick={handleCreate}>
      <Plus className="size-4" /> Novo corretor
    </Button>
  )

  return (
    <AdminPage>
      <PageHeader
        title="Corretores"
        description={
          realtors && realtors.length > 0
            ? `${realtors.length} ${realtors.length === 1 ? 'corretor' : 'corretores'} na equipe de vendas.`
            : 'Sua equipe de vendas. Eles aparecem nos imóveis e no site.'
        }
        actions={createButton}
      />

      {isLoading ? (
        <div className={GRID} aria-busy="true" aria-label="Carregando corretores">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[var(--scala-border)] bg-white"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : realtors && realtors.length > 0 ? (
        <Stagger className={GRID}>
          {realtors.map((realtor) => (
            <StaggerItem
              key={realtor.id}
              className="group relative overflow-hidden rounded-xl border border-[var(--scala-border)] bg-white shadow-[0_1px_2px_#0d11170a] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_#0d111733]"
            >
              <div className="bg-primary/10 relative aspect-[4/3] w-full overflow-hidden">
                {realtor.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={realtor.avatar}
                    alt={realtor.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="text-primary flex h-full w-full items-center justify-center text-3xl font-semibold">
                    {getInitials(realtor.name)}
                  </span>
                )}
                <div className="absolute top-2 right-2 rounded-lg bg-white/90 backdrop-blur">
                  <RowActions
                    label={realtor.name}
                    onEdit={() => handleEdit(realtor)}
                    onDelete={() => setDeleteRealtor(realtor)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                <p className="truncate font-semibold" title={realtor.name}>
                  {realtor.name}
                </p>
                {realtor.creci && (
                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <BadgeCheck className="text-primary size-3.5 shrink-0" />
                    CRECI {realtor.creci}
                  </p>
                )}
                {realtor.phone && (
                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm tabular-nums">
                    <Phone className="size-3.5 shrink-0" />
                    {realtor.phone}
                  </p>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="rounded-xl border border-[var(--scala-border)] bg-white">
          <EmptyState
            icon={UserRound}
            title="Nenhum corretor cadastrado"
            description="Cadastre a equipe para vincular corretores aos imóveis e mostrar o perfil deles no site."
            action={createButton}
          />
        </div>
      )}

      {/* O Modal fica aqui fora, controlado pelo estado */}
      <RealtorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        realtorToEdit={selectedRealtor}
      />

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteRealtor} onOpenChange={(open) => !open && setDeleteRealtor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover corretor?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteRealtor?.name}</strong> deixa de aparecer nos imóveis e no site. Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (deleteRealtor) deleteMutation.mutate(deleteRealtor.id)
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  )
}
