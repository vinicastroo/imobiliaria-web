"use client"

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Loader2, Trash2, Pencil, Users, HandHelping, UserX } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BackLink } from '@/components/back-link'
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
  const isOwnerOrAdmin = userRole === 'OWNER' || userRole === 'MANAGER' || userRole === 'SUPER_ADMIN'

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

  const colSpan = 7

  return (
    <FeatureGate feature="clients">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">

          <div className="flex flex-col gap-4 mb-6">
            <BackLink href="/admin" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#17375F]">Clientes</h1>
                <p className="text-gray-500">Gerencie seus clientes e seus interesses.</p>
              </div>

              {!isRealtor && (
                <Button onClick={handleCreate} className="bg-[#17375F] hover:bg-[#122b4a]">
                  <Users className="mr-2 h-4 w-4" /> Novo Cliente
                </Button>
              )}
            </div>
          </div>

          <Tabs value={originFilter} onValueChange={(v) => setOriginFilter(v as OriginFilter)} className="mb-4">
            <TabsList>
              <TabsTrigger value="ALL">Todos</TabsTrigger>
              <TabsTrigger value="WEBSITE">Do Site</TabsTrigger>
              <TabsTrigger value="MANUAL">Manuais</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="border-none shadow-sm">
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="max-w-[200px]">Observações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={colSpan} className="h-32 text-center">
                        <div className="flex justify-center items-center gap-2 text-muted-foreground">
                          <Loader2 className="animate-spin h-5 w-5" />
                          Carregando clientes...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell className="text-gray-500">{client.email || '—'}</TableCell>
                        <TableCell>
                          {client.origin === 'WEBSITE' ? (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Site</Badge>
                          ) : (
                            <Badge variant="secondary">Manual</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {client.realtor ? (
                            <span className="text-sm font-medium text-[#17375F]">{client.realtor.name}</span>
                          ) : client.origin === 'WEBSITE' ? (
                            <span className="text-sm text-amber-600">Não atribuído</span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-gray-500">
                          {client.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {isRealtor && client.origin === 'WEBSITE' && !client.realtorId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => claimMutation.mutate(client.id)}
                                disabled={claimMutation.isPending}
                                title="Assumir responsabilidade"
                              >
                                <HandHelping className="h-4 w-4" />
                              </Button>
                            )}

                            {isOwnerOrAdmin && client.realtorId && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={() => unclaimMutation.mutate(client.id)}
                                disabled={unclaimMutation.isPending}
                                title="Liberar responsável"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}

                            {!isRealtor && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleEdit(client)}
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDelete(client.id)}
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={colSpan} className="h-32 text-center text-muted-foreground">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <ClientDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            clientToEdit={selectedClient}
          />

          <DeleteClientDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            id={deleteId}
          />

        </main>
      </div>
    </FeatureGate>
  )
}
