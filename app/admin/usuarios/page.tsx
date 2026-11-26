'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Shield, Users2 } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import {
  EmptyState,
  RowActions,
  TableMessageRow,
  TableSkeletonRows,
} from '@/components/admin/states'
import { UserDialog, User } from '@/components/user-dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

const roleLabels = {
  OWNER: 'Proprietário',
  MANAGER: 'Gerente',
  REALTOR: 'Corretor',
}

// Cores suaves e consistentes por perfil
const roleColors = {
  OWNER: 'bg-violet-50 text-violet-700 ring-violet-200',
  MANAGER: 'bg-sky-50 text-sky-700 ring-sky-200',
  REALTOR: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function UsuariosPage() {
  const queryClient = useQueryClient()

  // Estados para controlar os modais
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  // Busca usuários
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/usuarios')
      return response.data
    },
  })

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/usuarios/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['realtors-available'] })
      toast.success('Usuário removido com sucesso')
      setDeleteUser(null)
    },
    onError: () => {
      toast.error('Erro ao remover usuário')
    },
  })

  // Handlers
  const handleCreate = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setDeleteUser(user)
  }

  const confirmDelete = () => {
    if (deleteUser) {
      deleteMutation.mutate(deleteUser.id)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <AdminPage>
      <PageHeader
        title="Usuários"
        description="Quem tem acesso ao painel e com qual perfil."
        actions={
          <Button onClick={handleCreate}>
            <UserPlus className="size-4" /> Novo usuário
          </Button>
        }
      />

      <DataCard
        toolbar={
          <p className="text-muted-foreground text-sm">
            {users ? `${users.length} ${users.length === 1 ? 'usuário' : 'usuários'}` : '\u00a0'}
          </p>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Corretor vinculado</TableHead>
              <TableHead className="w-16 pr-4 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={5} rows={4} />
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[220px] truncate font-medium" title={user.name}>
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="block max-w-[240px] truncate" title={user.email}>
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium ring-1 ring-inset ${roleColors[user.role]}`}
                    >
                      <Shield className="size-3" />
                      {roleLabels[user.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.realtorProfile ? (
                      <span className="text-sm">
                        {user.realtorProfile.name}
                        <span className="text-muted-foreground ml-1">
                          ({user.realtorProfile.creci})
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <RowActions
                      label={user.name}
                      onEdit={() => handleEdit(user)}
                      onDelete={() => handleDelete(user)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableMessageRow colSpan={5}>
                <EmptyState
                  icon={Users2}
                  title="Nenhum usuário cadastrado"
                  description="Convide gerentes e corretores para trabalhar no painel."
                  action={
                    <Button onClick={handleCreate}>
                      <UserPlus className="size-4" /> Novo usuário
                    </Button>
                  }
                />
              </TableMessageRow>
            )}
          </TableBody>
        </Table>
      </DataCard>

      {/* Dialog de Criar/Editar */}
      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} userToEdit={selectedUser} />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{deleteUser?.name}</strong>? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPage>
  )
}
