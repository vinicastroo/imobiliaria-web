"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Loader2, X, Search } from "lucide-react"
import { useState, useEffect } from "react"

// Tipos para as opções de filtro
export type FilterOption = {
  id: string
  label: string
  type: "text" | "select" | "number"
  options?: { label: string; value: string }[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pagination: { pageIndex: number; pageSize: number }
  setPagination: (pagination: PaginationState) => void
  isLoading: boolean

  // Props para o filtro complexo
  filterOptions?: FilterOption[]
  onFilterChange?: (columnId: string, value: string) => void

  // --- CORREÇÃO AQUI: Adicionamos de volta as props que o pai envia ---
  filterValue?: string
  setFilterValue?: (value: string) => void
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  isLoading,
  filterOptions = [],
  onFilterChange,
  // Recebendo as props do pai (renomeamos para diferenciar do estado interno se houvesse)
  filterValue: externalFilterValue,
  setFilterValue: setExternalFilterValue,
  searchPlaceholder = "Filtrar...",
}: DataTableProps<TData, TValue>) {

  // Estado local para controlar qual COLUNA está ativa
  const [selectedColumn, setSelectedColumn] = useState<string>(
    filterOptions[0]?.id || ""
  )

  // Lógica para decidir se usamos o valor do Pai ou Estado Local (caso o pai não passe nada)
  const [internalFilterValue, setInternalFilterValue] = useState("")

  // O valor real é o externo (se existir) ou o interno
  const filterValue = externalFilterValue !== undefined ? externalFilterValue : internalFilterValue

  // Função unificada para atualizar o valor
  const handleValueChange = (newValue: string) => {
    // 1. Atualiza quem estiver controlando o estado (Pai ou Local)
    if (setExternalFilterValue) {
      setExternalFilterValue(newValue)
    } else {
      setInternalFilterValue(newValue)
    }

    // 2. Notifica a mudança do filtro completo (Coluna + Valor)
    if (onFilterChange) {
      onFilterChange(selectedColumn, newValue)
    }
  }

  // Encontra a configuração da coluna selecionada atualmente
  const activeFilterOption = filterOptions.find(opt => opt.id === selectedColumn)

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  // Função para mudar a coluna
  const handleColumnChange = (columnId: string) => {
    setSelectedColumn(columnId)

    // Limpa o valor ao trocar a coluna
    handleValueChange("")

    if (onFilterChange) {
      onFilterChange(columnId, "")
    }
  }

  return (
    <div className="space-y-4">
      {/* --- ÁREA DE FILTROS AVANÇADA --- */}
      {filterOptions.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2 rounded-md border">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Filtrar por:</span>

            {/* 1. Seleciona a COLUNA */}
            <Select
              value={selectedColumn}
              onValueChange={handleColumnChange}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Input DINÂMICO baseado no tipo da coluna */}
          <div className="relative w-full sm:max-w-sm flex items-center gap-2">
            {activeFilterOption?.type === 'select' ? (
              <Select
                value={filterValue}
                onValueChange={handleValueChange}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_VALUES_RESET">Todos</SelectItem>
                  {activeFilterOption.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              // Padrão: Input de Texto ou Número
              <div className="relative w-full">
                <Input
                  type={activeFilterOption?.type === 'number' ? 'number' : 'text'}
                  placeholder={searchPlaceholder || `Pesquisar...`}
                  value={filterValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full pr-8 bg-white"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  {filterValue ? (
                    <button onClick={() => handleValueChange("")} className="hover:text-gray-700">
                      <X size={16} />
                    </button>
                  ) : (
                    <Search size={16} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Fallback: Se não passar filterOptions, mostra input simples (comportamento antigo) */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full max-w-sm relative">
            <Input
              placeholder={searchPlaceholder}
              value={filterValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="max-w-sm pr-8"
            />
            {filterValue && (
              <button
                onClick={() => handleValueChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- TABELA --- */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5 text-[#17375F]" />
                    Carregando dados...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <div
                        className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]"
                        title={typeof cell.getValue() === 'string' ? String(cell.getValue()) : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- PAGINAÇÃO --- */}
      <div className="flex items-center justify-between px-2 overflow-x-auto py-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Linhas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Próxima</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}