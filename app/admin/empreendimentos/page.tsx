"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Trash2, Pencil, Building2 } from 'lucide-react'

import api from '@/services/api'

// Componentes UI
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BackLink } from '@/components/back-link'
import { FeatureGate } from '@/components/feature-gate'

// Modais
import { EnterpriseDialog } from '@/components/enterprise-dialog'
import { DeleteEnterpriseDialog } from '@/components/delete-enterprise-dialog'

interface Enterprise {
  id: string
  name: string
  _count?: {
    properties: number
  }
}

export default function EmpreendimentosPage() {
  // --- Estados do Modal de Criação/Edição ---
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Enterprise | null>(null)

  // --- Estados do Modal de Exclusão ---
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Busca dados
  const { data: enterprises, isLoading } = useQuery<Enterprise[]>({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const response = await api.get('/empreendimento')
      return response.data
    },
  })

  // Handlers
  const handleCreate = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Enterprise) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }

  // Função auxiliar para cor do Badge de status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Lançamento': return 'bg-blue-500 hover:bg-blue-600'
      case 'Em Construção': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'Pronto para Morar': return 'bg-green-500 hover:bg-green-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <FeatureGate feature="enterprises">
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">

        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 mb-6">
          <BackLink href="/admin" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#17375F]">Empreendimentos</h1>
              <p className="text-gray-500">Gerencie os lançamentos e prédios.</p>
            </div>

            <Button onClick={handleCreate} className="bg-[#17375F] hover:bg-[#122b4a]">
              <Building2 className="mr-2 h-4 w-4" /> Novo Empreendimento
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <Card className="border-none shadow-sm">
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Imóveis Vinculados</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin h-5 w-5" />
                        Carregando empreendimentos...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : enterprises && enterprises.length > 0 ? (
                  enterprises.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-base">
                        {item.name}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-sm">
                          {item._count?.properties || 0}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(item)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
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
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Nenhum empreendimento cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>


        <EnterpriseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          itemToEdit={selectedItem}
        />

        <DeleteEnterpriseDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          id={deleteId}
        />

      </main>
    </div>
    </FeatureGate>
  )
}