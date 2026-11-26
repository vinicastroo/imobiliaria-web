'use client'

import { MoreHorizontal, Pencil, Trash2, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

/** Estado vazio padrão: ícone, título, explicação e a ação que resolve. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-6 py-14 text-center', className)}>
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        {description && (
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/** Linha de tabela que ocupa todas as colunas (para vazio e erro). */
export function TableMessageRow({
  colSpan,
  children,
}: {
  colSpan: number
  children: React.ReactNode
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0 whitespace-normal">
        {children}
      </TableCell>
    </TableRow>
  )
}

/** Linhas-esqueleto com a mesma altura das linhas reais (sem pular layout). */
export function TableSkeletonRows({ columns, rows = 6 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((__, c) => (
            <TableCell key={c}>
              <Skeleton className={cn('h-4', c === 0 ? 'w-2/3' : 'w-1/2')} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

/** Ações da linha num menu "⋯" (editar, excluir e extras). */
export function RowActions({
  label,
  onEdit,
  onDelete,
  extra,
}: {
  /** Nome do item, para o leitor de tela ("Ações de Casa"). */
  label: string
  onEdit?: () => void
  onDelete?: () => void
  extra?: Array<{ label: string; icon?: LucideIcon; onSelect: () => void; disabled?: boolean }>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8"
          aria-label={`Ações de ${label}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {extra?.map(({ label: l, icon: I, onSelect, disabled }) => (
          <DropdownMenuItem key={l} onSelect={onSelect} disabled={disabled}>
            {I && <I className="size-4" />}
            {l}
          </DropdownMenuItem>
        ))}
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            {(onEdit || extra?.length) && <DropdownMenuSeparator />}
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
