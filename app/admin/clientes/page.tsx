'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Users, UserPlus, HandHelping, UserX } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import {
  EmptyState,
  RowActions,
  TableMessageRow,
  TableSkeletonRows,
} from '@/components/admin/states'
import { FeatureGate } from '@/components/feature-gate'

import { ClientDialog } from '@/components/client-dialog'
import { DeleteClientDialog } from '@/components/delete-client-dialog'

interface Client {
  id: string
  name: string
  phone: string
  email?: string | null
  description: string
  origin: 'MANUAL' | 'WEBSITE'
  realtorId?: string | null
  realtor?: { id: string; name: string } | null
  claimedAt?: string | null
  createdAt: string
}

type OriginFilter = 'ALL' | 'WEBSITE' | 'MANUAL'

export default function ClientesPage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userRole = session?.user?.role
  const isRealtor = userRole === 'REALTOR'
  const isOwnerOrAdmin =
    userRole === 'OWNER' || userRole === 'MANAGER' || userRole === 'SUPER_ADMIN'

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [deleteId, setDeleteId] = useState('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [originFilter, setOriginFilter] = useState<OriginFilter>('ALL')

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await api.get('/clientes')
      return response.data
    },
  })

  const filteredClients = useMemo(() => {
    if (!clients) return []
    if (originFilter === 'ALL') return clients
    return clients.filter((c) => c.origin === originFilter)
  }, [clients, originFilter])

  const claimMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await api.patch(`/clientes/${clientId}/claim`, {
        realtorId: session?.user?.realtorProfileId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Você assumiu a responsabilidade pelo cliente')
    },
    onError: () => {
      toast.error('Erro ao assumir cliente')
    },
  })

  const unclaimMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await api.patch(`/clientes/${clientId}/unclaim`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Responsável removido')
    },
    onError: () => {
      toast.error('Erro ao liberar cliente')
    },
  })

  const handleCreate = () => {
    setSelectedClient(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const colSpan = 6

  const counts = useMemo(
    () => ({
      ALL: clients?.length ?? 0,
      WEBSITE: clients?.filter((c) => c.origin === 'WEBSITE').length ?? 0,
      MANUAL: clients?.filter((c) => c.origin === 'MANUAL').length ?? 0,
    }),
    [clients],
  )

  return (
    <FeatureGate feature="clients">
      <AdminPage>
        <PageHeader
          title="Clientes"
          description="Contatos que chegaram pelo site ou foram cadastrados pela equipe."
          actions={
            !isRealtor && (
              <Button onClick={handleCreate}>
                <UserPlus className="size-4" /> Novo cliente
              </Button>
            )
          }
        />

        <DataCard
          toolbar={
            <>
              <Tabs value={originFilter} onValueChange={(v) => setOriginFilter(v as OriginFilter)}>
                <TabsList>
                  <TabsTrigger value="ALL">
                    Todos{' '}
                    <span className="text-muted-foreground ml-1 tabular-nums">{counts.ALL}</span>
                  </TabsTrigger>
                  <TabsTrigger value="WEBSITE">
                    Do site{' '}
                    <span className="text-muted-foreground ml-1 tabular-nums">
                      {counts.WEBSITE}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="MANUAL">
                    Manuais{' '}
                    <span className="text-muted-foreground ml-1 tabular-nums">{counts.MANUAL}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-muted-foreground text-sm">
                {clients
                  ? `${filteredClients.length} ${filteredClients.length === 1 ? 'cliente' : 'clientes'}`
                  : '\u00a0'}
              </p>
            </>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-16 pr-4 text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={colSpan} />
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const canClaim = isRealtor && client.origin === 'WEBSITE' && !client.realtorId
                  const canUnclaim = isOwnerOrAdmin && !!client.realtorId
                  const extra = [
                    ...(canClaim
                      ? [
                          {
                            label: 'Assumir cliente',
                            icon: HandHelping,
                            onSelect: () =>
                              !claimMutation.isPending && claimMutation.mutate(client.id),
                          },
                        ]
                      : []),
                    ...(canUnclaim
                      ? [
                          {
                            label: 'Liberar responsável',
                            icon: UserX,
                            onSelect: () =>
                              !unclaimMutation.isPending && unclaimMutation.mutate(client.id),
                          },
                        ]
                      : []),
                  ]
                  const hasActions = extra.length > 0 || !isRealtor
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="pl-4">
                        <span
                          className="block max-w-[220px] truncate font-medium"
                          title={client.name}
                        >
                          {client.name}
                        </span>
                        {client.email && (
                          <span
                            className="text-muted-foreground block max-w-[220px] truncate text-xs"
                            title={client.email}
                          >
                            {client.email}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums">{client.phone}</TableCell>
                      <TableCell>
                        {client.origin === 'WEBSITE' ? (
                          <span className="bg-primary/10 text-primary inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium">
                            Site
                          </span>
                        ) : (
                          <span className="bg-muted text-muted-foreground inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium">
                            Manual
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.realtor ? (
                          <span className="text-sm font-medium">{client.realtor.name}</span>
                        ) : client.origin === 'WEBSITE' ? (
                          <span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 ring-inset">
                            Sem responsável
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground max-w-[240px] truncate"
                        title={client.description}
                      >
                        {client.description || '—'}
                      </TableCell>
                      <TableCell className="pr-4 text-right">
                        {hasActions && (
                          <RowActions
                            label={client.name}
                            extra={extra}
                            onEdit={!isRealtor ? () => handleEdit(client) : undefined}
                            onDelete={!isRealtor ? () => handleDelete(client.id) : undefined}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableMessageRow colSpan={colSpan}>
                  <EmptyState
                    icon={Users}
                    title={
                      originFilter === 'ALL'
                        ? 'Nenhum cliente ainda'
                        : originFilter === 'WEBSITE'
                          ? 'Nenhum cliente veio do site ainda'
                          : 'Nenhum cliente cadastrado manualmente'
                    }
                    description="Os contatos do formulário do site aparecem aqui automaticamente."
                    action={
                      !isRealtor && (
                        <Button onClick={handleCreate}>
                          <UserPlus className="size-4" /> Novo cliente
                        </Button>
                      )
                    }
                  />
                </TableMessageRow>
              )}
            </TableBody>
          </Table>
        </DataCard>

        <ClientDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          clientToEdit={selectedClient}
        />

        <DeleteClientDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} id={deleteId} />
      </AdminPage>
    </FeatureGate>
  )
}
