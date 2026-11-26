'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Eye, EyeOff, ExternalLink, Home, Star, StarOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { RowActions } from '@/components/admin/states'
import type { DataTableColumnMeta } from '@/components/data-table'
import { cn } from '@/lib/utils'

export interface Property {
  id: string
  code?: number | string | null
  name: string
  value: string
  slug: string
  city: string
  neighborhood: string
  street: string
  visible: boolean
  highlighted: boolean
  priceOnRequest?: boolean
  transactionType?: 'VENDA' | 'ALUGUEL' | string | null
  files?: { path: string }[]
  type_property: {
    description: string
  } | null
}

interface ColumnsProps {
  onToggleStatus: (id: string, currentStatus: boolean) => void
  onToggleHighlighted: (id: string, currentHighlighted: boolean) => void
  onDelete: (id: string) => void
}

const meta = (m: DataTableColumnMeta) => m

// Função para criar colunas injetando funções de ação
export const getColumns = ({
  onToggleStatus,
  onToggleHighlighted,
  onDelete,
}: ColumnsProps): ColumnDef<Property>[] => [
  {
    id: 'property',
    header: 'Imóvel',
    meta: meta({ noTruncate: true, cellClassName: 'w-full min-w-[280px] whitespace-normal' }),
    cell: ({ row }) => <PropertyCell property={row.original} />,
  },
  {
    accessorKey: 'value',
    header: 'Valor',
    meta: meta({ noTruncate: true, headClassName: 'text-right', cellClassName: 'text-right' }),
    cell: ({ row }) => {
      const p = row.original
      if (p.priceOnRequest) {
        return <span className="text-muted-foreground text-sm">Sob consulta</span>
      }
      return (
        <span className="font-semibold text-gray-900 tabular-nums">
          {p.value}
          {p.transactionType === 'ALUGUEL' && (
            <span className="text-muted-foreground text-xs font-normal">/mês</span>
          )}
        </span>
      )
    },
  },
  {
    id: 'location',
    header: 'Local',
    meta: meta({ noTruncate: true, cellClassName: 'min-w-[160px] whitespace-normal' }),
    cell: ({ row }) => {
      const { city, neighborhood } = row.original
      if (!city && !neighborhood) return <span className="text-muted-foreground">—</span>
      return (
        <div className="leading-tight">
          <p className="text-sm text-gray-900">{neighborhood || '—'}</p>
          <p className="text-muted-foreground text-xs">{city}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'visible',
    header: 'Situação',
    meta: meta({ noTruncate: true }),
    cell: ({ row }) => {
      const { visible, highlighted } = row.original
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
              visible ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600',
            )}
          >
            <span
              className={cn('size-1.5 rounded-full', visible ? 'bg-emerald-500' : 'bg-gray-400')}
              aria-hidden="true"
            />
            {visible ? 'No site' : 'Oculto'}
          </span>
          {highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              Destaque
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Ações</span>,
    meta: meta({ noTruncate: true, cellClassName: 'w-12 text-right' }),
    cell: ({ row }) => (
      <PropertyActions
        property={row.original}
        onToggleStatus={onToggleStatus}
        onToggleHighlighted={onToggleHighlighted}
        onDelete={onDelete}
      />
    ),
  },
]

function PropertyCell({ property }: { property: Property }) {
  const photo = property.files?.[0]?.path
  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted relative flex h-[42px] w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <Home className="text-muted-foreground size-4" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 font-medium text-gray-900" title={property.name}>
          {property.name}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {property.code != null && (
            <span className="font-medium tabular-nums">#{property.code}</span>
          )}
          {property.code != null && property.type_property?.description && ' · '}
          {property.type_property?.description}
        </p>
      </div>
    </div>
  )
}

function PropertyActions({
  property,
  onToggleStatus,
  onToggleHighlighted,
  onDelete,
}: { property: Property } & ColumnsProps) {
  const router = useRouter()
  return (
    <RowActions
      label={property.name}
      onEdit={() => router.push(`/admin/imoveis/editar/${property.id}`)}
      onDelete={() => onDelete(property.id)}
      extra={[
        ...(property.slug
          ? [
              {
                label: 'Ver no site',
                icon: ExternalLink,
                onSelect: () => window.open(`/imoveis/${property.slug}`, '_blank', 'noopener'),
              },
            ]
          : []),
        {
          label: property.visible ? 'Ocultar do site' : 'Mostrar no site',
          icon: property.visible ? EyeOff : Eye,
          onSelect: () => onToggleStatus(property.id, property.visible),
        },
        {
          label: property.highlighted ? 'Remover destaque' : 'Destacar',
          icon: property.highlighted ? StarOff : Star,
          onSelect: () => onToggleHighlighted(property.id, property.highlighted),
        },
      ]}
    />
  )
}
