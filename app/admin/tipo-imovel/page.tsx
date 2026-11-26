'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tag } from 'lucide-react'

import api from '@/services/api'

// Componentes UI
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
    <AdminPage>
      <PageHeader
        title="Tipos de imóvel"
        description="Cadastre e gerencie as categorias dos imóveis."
        actions={<TypeDialog />}
      />

      <DataCard
        toolbar={
          <p className="text-muted-foreground text-sm">
            {types ? `${types.length} ${types.length === 1 ? 'tipo' : 'tipos'}` : '\u00a0'}
          </p>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Descrição</TableHead>
              <TableHead className="w-16 pr-4 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={2} />
            ) : types && types.length > 0 ? (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="pl-4 font-medium">{type.description}</TableCell>
                  <TableCell className="pr-4 text-right">
                    <RowActions
                      label={type.description}
                      onEdit={() => handleOpenEdit(type)}
                      onDelete={() => handleOpenDelete(type.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableMessageRow colSpan={2}>
                <EmptyState
                  icon={Tag}
                  title="Nenhum tipo cadastrado"
                  description="Crie categorias como Casa, Apartamento ou Terreno para organizar os imóveis."
                />
              </TableMessageRow>
            )}
          </TableBody>
        </Table>
      </DataCard>

      {/* Modal de Exclusão */}
      <DeleteTypeDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} id={deleteId} />

      {/* Modal de Edição (Controlado pelo Pai) */}
      <TypeDialog open={isEditOpen} onOpenChange={setIsEditOpen} typeToEdit={editType} />
    </AdminPage>
  )
}
