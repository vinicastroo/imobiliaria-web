'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Trash2, Pencil } from 'lucide-react' // Adicione Pencil

import api from '@/services/api'

// Componentes UI
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BackLink } from '@/components/back-link'

// Modais
import { TypeDialog } from './type-dialog'
import { DeleteTypeDialog } from './delete-type-dialog'

interface TypeProperty {
  id: string
  description: string
  createdAt: string
}

export default function TipoImovelPage() {
  // Estados para Delete
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Estados para Edição
  const [editType, setEditType] = useState<TypeProperty | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: types, isLoading } = useQuery<TypeProperty[]>({
    queryKey: ['property-types'],
    queryFn: async () => {
      const response = await api.get('/tipo-imovel')
      return response.data
    },
  })

  const handleOpenDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  const handleOpenEdit = (type: TypeProperty) => {
    setEditType(type)
    setIsEditOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-[1200px] flex-1 p-4 md:p-8">
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col gap-4">
          <BackLink href="/admin" />

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#17375F]">Gerenciamento de Tipos</h1>
              <p className="text-gray-500">Cadastre e gerencie as categorias dos imóveis.</p>
            </div>

            {/* Modal de Criação (Sem props, usa botão interno) */}
            <TypeDialog />
          </div>
        </div>

        <div className="rounded-md border bg-white px-4 py-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : types && types.length > 0 ? (
                types.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {type.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{type.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Botão Editar */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-900 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => handleOpenEdit(type)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Botão Excluir */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleOpenDelete(type.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground h-24 text-center">
                    Nenhum tipo cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Exclusão */}
        <DeleteTypeDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} id={deleteId} />

        {/* Modal de Edição (Controlado pelo Pai) */}
        <TypeDialog open={isEditOpen} onOpenChange={setIsEditOpen} typeToEdit={editType} />
      </main>
    </div>
  )
}
