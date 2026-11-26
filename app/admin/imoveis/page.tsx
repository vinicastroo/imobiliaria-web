'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Home, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'

import api from '@/services/api'
import { revalidateProperties } from '@/app/actions/revalidate-properties'
// Importamos a tipagem FilterOption do componente atualizado
import { DataTable, FilterOption } from '@/components/data-table'
import { getColumns } from './columns'
import { Button } from '@/components/ui/button'
import { AdminPage, PageHeader } from '@/components/admin/page'
import { EmptyState } from '@/components/admin/states'
import { ModalDeleteProperty } from './model-delete-property'

// Interface da resposta da API
interface Property {
  id: string
  title: string
  name: string
  value: string
  slug: string
  city: string
  neighborhood: string
  street: string
  type_property: { description: string }
  visible: boolean
  highlighted: boolean
  createdAt: string
}

interface PropertiesResponse {
  properties: Property[]
  totalCount: number
}

export default function AdminImoveisPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // 1. Estado da paginação
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // 2. Estado para Modal de Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 3. Estados do Filtro Avançado
  const [filterColumn, setFilterColumn] = useState('name') // Coluna padrão
  const [filterValue, setFilterValue] = useState('') // Valor do filtro

  // Debounce para não chamar a API a cada letra digitada
  const [debouncedFilter] = useDebounce(filterValue, 500)

  // 4. Configuração das Opções de Filtro
  const filterOptions: FilterOption[] = [
    { id: 'code', label: 'Código', type: 'number' },
    { id: 'name', label: 'Nome', type: 'text' },
    { id: 'city', label: 'Cidade', type: 'text' },
    { id: 'slug', label: 'Slug', type: 'text' },
    {
      id: 'visible',
      label: 'Situação',
      type: 'select',
      options: [
        { label: 'No site', value: 'true' },
        { label: 'Oculto', value: 'false' },
      ],
    },
  ]

  // 5. Query principal
  const { data, isLoading } = useQuery<PropertiesResponse>({
    // A chave da query muda se a paginação, coluna de filtro ou valor do filtro mudarem
    queryKey: [
      'admin-properties',
      pagination.pageIndex,
      pagination.pageSize,
      filterColumn,
      debouncedFilter,
    ],
    queryFn: async () => {
      // Montagem dinâmica dos parâmetros
      const params: Record<string, string | number> = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        orderBy: 'createdAt',
        order: 'desc',
      }

      // Lógica para enviar o filtro correto para o backend
      if (debouncedFilter && debouncedFilter !== 'ALL_VALUES_RESET') {
        if (filterColumn === 'visible') {
          // Sua API trata 'visible' fora do loop de 'filter[]', então mandamos direto
          params.visible = debouncedFilter
        } else {
          // Para outros campos (texto), usamos o padrão filter[campo]
          params[`filter[${filterColumn}]`] = debouncedFilter
        }
      }

      const response = await api.get('/imovel/todos', { params })
      return response.data
    },
    placeholderData: keepPreviousData,
  })

  // 6. Mutation para Ativar/Desativar
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      await api.patch(`/imovel/${id}`, { visible: !currentStatus })
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      await revalidateProperties()
      toast.success('Status atualizado com sucesso!')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status')
    },
  })

  // 7. Mutation para Destacar/Remover destaque
  const toggleHighlightedMutation = useMutation({
    mutationFn: async ({ id, currentHighlighted }: { id: string; currentHighlighted: boolean }) => {
      await api.patch(`/imovel/${id}/highlighted`, { highlighted: !currentHighlighted })
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
      await revalidateProperties()
      toast.success('Destaque atualizado com sucesso!')
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Erro ao atualizar destaque',
      )
    },
  })

  // Handlers de Ação
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id, currentStatus })
  }

  const handleToggleHighlighted = (id: string, currentHighlighted: boolean) => {
    toggleHighlightedMutation.mutate({ id, currentHighlighted })
  }

  const handleDeleteClick = (id: string) => {
    setSelectedId(id)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedId(null)
    queryClient.invalidateQueries({ queryKey: ['admin-properties'] })
  }

  // Definição das colunas
  const columns = getColumns({
    onToggleStatus: handleToggleStatus,
    onToggleHighlighted: handleToggleHighlighted,
    onDelete: handleDeleteClick,
  })

  const total = data?.totalCount
  const goCreate = () => router.push('/admin/imoveis/criar')

  return (
    <AdminPage width="wide">
      <PageHeader
        title="Imóveis"
        description="Cadastre, publique e acompanhe os imóveis da imobiliária."
        actions={
          <Button onClick={goCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="size-4" /> Novo imóvel
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.properties || []}
        pageCount={data ? Math.ceil(data.totalCount / pagination.pageSize) : -1}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        filterOptions={filterOptions}
        onFilterChange={(columnId, value) => {
          setFilterColumn(columnId)
          const newValue = value === 'ALL_VALUES_RESET' ? '' : value
          setFilterValue(newValue)
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        toolbarEnd={
          total !== undefined ? (
            <span className="text-muted-foreground text-sm whitespace-nowrap tabular-nums">
              {total.toLocaleString('pt-BR')} {total === 1 ? 'imóvel' : 'imóveis'}
            </span>
          ) : null
        }
        emptyState={
          <EmptyState
            icon={Home}
            title="Nenhum imóvel cadastrado"
            description="Cadastre o primeiro imóvel e ele aparece no site da imobiliária."
            action={
              <Button onClick={goCreate} className="bg-primary hover:bg-primary/90">
                <Plus className="size-4" /> Cadastrar imóvel
              </Button>
            }
          />
        }
      />

      {deleteModalOpen && selectedId && (
        <ModalDeleteProperty
          open={deleteModalOpen}
          handleClose={handleCloseDeleteModal}
          id={selectedId}
        />
      )}
    </AdminPage>
  )
}
