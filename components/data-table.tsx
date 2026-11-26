'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, X, Search, SearchX } from 'lucide-react'
import { useState } from 'react'

import { DataCard } from '@/components/admin/page'
import { EmptyState, TableMessageRow, TableSkeletonRows } from '@/components/admin/states'
import { cn } from '@/lib/utils'

// Tipos para as opções de filtro
export type FilterOption = {
  id: string
  label: string
  type: 'text' | 'select' | 'number'
  options?: { label: string; value: string }[]
}

/**
 * Metadados opcionais por coluna (columnDef.meta):
 * - headClassName / cellClassName: classes extras do cabeçalho e da célula
 * - noTruncate: não aplica o corte de texto padrão (para células com layout próprio)
 */
export type DataTableColumnMeta = {
  headClassName?: string
  cellClassName?: string
  noTruncate?: boolean
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

  filterValue?: string
  setFilterValue?: (value: string) => void
  searchPlaceholder?: string

  /** Conteúdo à direita da barra de filtros (ex.: contador). */
  toolbarEnd?: React.ReactNode
  /** Estado vazio quando não há nenhum dado (sem filtro ativo). */
  emptyState?: React.ReactNode
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
  filterValue: externalFilterValue,
  setFilterValue: setExternalFilterValue,
  searchPlaceholder = 'Buscar…',
  toolbarEnd,
  emptyState,
}: DataTableProps<TData, TValue>) {
  // Estado local para controlar qual COLUNA está ativa
  const [selectedColumn, setSelectedColumn] = useState<string>(filterOptions[0]?.id || '')

  // Valor do filtro: o do pai (se existir) ou o local
  const [internalFilterValue, setInternalFilterValue] = useState('')
  const filterValue = externalFilterValue !== undefined ? externalFilterValue : internalFilterValue

  const handleValueChange = (newValue: string) => {
    if (setExternalFilterValue) {
      setExternalFilterValue(newValue)
    } else {
      setInternalFilterValue(newValue)
    }
    if (onFilterChange) {
      onFilterChange(selectedColumn, newValue)
    }
  }

  const activeFilterOption = filterOptions.find((opt) => opt.id === selectedColumn)

  // eslint-disable-next-line react-hooks/incompatible-library
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

  const handleColumnChange = (columnId: string) => {
    setSelectedColumn(columnId)
    handleValueChange('')
    if (onFilterChange) {
      onFilterChange(columnId, '')
    }
  }

  const hasFilter = Boolean(filterValue && filterValue !== 'ALL_VALUES_RESET')
  const rows = table.getRowModel().rows
  const pageCountSafe = Math.max(1, table.getPageCount())

  const toolbar = (
    <>
      {filterOptions.length > 0 ? (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedColumn} onValueChange={handleColumnChange}>
            <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filtrar por">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:max-w-sm">
            {activeFilterOption?.type === 'select' ? (
              <Select value={filterValue} onValueChange={handleValueChange}>
                <SelectTrigger className="w-full">
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
              <>
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  type={activeFilterOption?.type === 'number' ? 'number' : 'text'}
                  placeholder={
                    activeFilterOption
                      ? `Buscar por ${activeFilterOption.label.toLowerCase()}…`
                      : searchPlaceholder
                  }
                  value={filterValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full pr-8 pl-9"
                />
                {filterValue && (
                  <button
                    type="button"
                    onClick={() => handleValueChange('')}
                    aria-label="Limpar busca"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    <X size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full sm:max-w-sm">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder={searchPlaceholder}
            value={filterValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full pr-8 pl-9"
          />
          {filterValue && (
            <button
              type="button"
              onClick={() => handleValueChange('')}
              aria-label="Limpar busca"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
      {toolbarEnd && <div className="shrink-0">{toolbarEnd}</div>}
    </>
  )

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span className="whitespace-nowrap">Linhas por página</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]" aria-label="Linhas por página">
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

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm whitespace-nowrap tabular-nums">
          Página {table.getState().pagination.pageIndex + 1} de {pageCountSafe}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Próxima página"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <DataCard toolbar={toolbar} footer={footer}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                return (
                  <TableHead
                    key={header.id}
                    className={cn('whitespace-nowrap', meta?.headClassName)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeletonRows
              columns={columns.length}
              rows={pagination.pageSize > 10 ? 10 : pagination.pageSize}
            />
          ) : rows?.length ? (
            rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                  const content = flexRender(cell.column.columnDef.cell, cell.getContext())
                  return (
                    <TableCell key={cell.id} className={meta?.cellClassName}>
                      {meta?.noTruncate ? (
                        content
                      ) : (
                        <div
                          className="max-w-[120px] truncate sm:max-w-[200px] md:max-w-[300px]"
                          title={
                            typeof cell.getValue() === 'string'
                              ? String(cell.getValue())
                              : undefined
                          }
                        >
                          {content}
                        </div>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableMessageRow colSpan={columns.length}>
              {hasFilter || !emptyState ? (
                <EmptyState
                  icon={SearchX}
                  title="Nenhum resultado encontrado"
                  description={hasFilter ? 'Tente outro termo ou limpe a busca.' : undefined}
                  action={
                    hasFilter ? (
                      <Button variant="outline" size="sm" onClick={() => handleValueChange('')}>
                        Limpar busca
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                emptyState
              )}
            </TableMessageRow>
          )}
        </TableBody>
      </Table>
    </DataCard>
  )
}
