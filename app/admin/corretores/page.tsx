"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, User, Pencil, Plus } from 'lucide-react' // Adicionado Pencil e Plus
import { toast } from 'sonner'
import api from '@/services/api'
import { BackLink } from '@/components/back-link'
// Importe a tipagem Realtor também se estiver no mesmo arquivo ou ajuste o import
import { RealtorDialog, Realtor } from '@/components/realtor-dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CorretoresPage() {
  const queryClient = useQueryClient()

  // --- Estados para controlar o Modal ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRealtor, setSelectedRealtor] = useState<Realtor | null>(null)

  const { data: realtors, isLoading } = useQuery<Realtor[]>({
    queryKey: ['realtors'],
    queryFn: async () => (await api.get('/corretor')).data
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/corretor/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realtors'] })
      toast.success('Corretor removido')
    }
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <BackLink href="/admin" />
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#17375F]">Corretores</h1>
            <p className="text-gray-500">Gerencie sua equipe de vendas.</p>
          </div>

          {/* Botão de Criar agora chama a função handleCreate */}
          <Button onClick={handleCreate} className="bg-[#17375F] hover:bg-[#122b4a]">
            <Plus className="mr-2 h-4 w-4" /> Novo Corretor
          </Button>
        </div>
      </div>

      <Card className='py-6'>
        <CardHeader><CardTitle className="flex gap-2 items-center"><User /> Lista de Corretores</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CRECI</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {realtors?.map((realtor) => (
                <TableRow key={realtor.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={realtor.avatar} />
                      <AvatarFallback>{realtor.name[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{realtor.name}</TableCell>
                  <TableCell>{realtor.creci}</TableCell>
                  <TableCell>{realtor.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Botão de Editar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-900 hover:bg-blue-50"
                        onClick={() => handleEdit(realtor)}
                      >
                        <Pencil size={16} />
                      </Button>

                      {/* Botão de Excluir */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(realtor.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && realtors?.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center">Nenhum corretor encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* O Modal fica aqui fora, controlado pelo estado */}
      <RealtorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        realtorToEdit={selectedRealtor}
      />
    </div>
  )
}