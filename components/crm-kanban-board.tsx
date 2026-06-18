"use client"

import { memo, useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { BellRing, Clock, GripVertical, Pencil, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import api from '@/services/api'
import { Button } from '@/components/ui/button'

export interface CrmContact {
  id: string
  name: string
  phone: string
  email?: string | null
  description: string
  status: 'INTERESTED' | 'VISITING' | 'ON_HOLD'
  followUpAt?: string | null
  realtorId?: string | null
  realtor?: { id: string; name: string; avatar?: string | null } | null
  createdAt: string
}

interface CrmKanbanBoardProps {
  contacts: CrmContact[]
  isRealtor: boolean
  realtorProfileId?: string | null
  onEdit: (contact: CrmContact) => void
  onDelete: (id: string) => void
}

const COLUMNS: {
  status: CrmContact['status']
  label: string
  headerColor: string
  dotColor: string
  hoverBg: string
  hoverRing: string
}[] = [
  {
    status: 'INTERESTED',
    label: 'Interessado',
    headerColor: 'text-blue-700',
    dotColor: 'bg-blue-400',
    hoverBg: 'bg-blue-50',
    hoverRing: 'ring-blue-300',
  },
  {
    status: 'VISITING',
    label: 'Visitando',
    headerColor: 'text-green-700',
    dotColor: 'bg-green-400',
    hoverBg: 'bg-green-50',
    hoverRing: 'ring-green-300',
  },
  {
    status: 'ON_HOLD',
    label: 'Em Espera',
    headerColor: 'text-amber-700',
    dotColor: 'bg-amber-400',
    hoverBg: 'bg-amber-50',
    hoverRing: 'ring-amber-300',
  },
]

// ─── Card ────────────────────────────────────────────────────────────────────

const KanbanCard = memo(function KanbanCard({
  contact,
  isOverdue,
  onEdit,
  onDelete,
}: {
  contact: CrmContact
  isOverdue: boolean
  onEdit: (c: CrmContact) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, transform, isDragging, listeners, attributes } = useDraggable({
    id: contact.id,
    data: { contact },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm p-3 group cursor-grab active:cursor-grabbing select-none touch-none',
        isDragging && 'opacity-0',
        isOverdue && 'border-orange-200',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical size={14} className="text-gray-300 shrink-0 mt-0.5" />
          <p className="font-semibold text-sm text-gray-900 truncate">{contact.name}</p>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-blue-500 hover:bg-blue-50"
            onClick={(e) => { e.stopPropagation(); onEdit(contact) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-400 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete(contact.id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <p className="mt-0.5 text-xs text-gray-500 ml-5">{contact.phone}</p>

      {contact.description && (
        <p className="mt-1 text-xs text-gray-400 line-clamp-2 ml-5">{contact.description}</p>
      )}

      {(contact.realtor || (contact.status === 'ON_HOLD' && contact.followUpAt)) && (
        <div className="mt-2 ml-5 flex items-center justify-between gap-2 flex-wrap">
          {contact.realtor && (
            <div className="flex items-center gap-1.5 min-w-0">
              {contact.realtor.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contact.realtor.avatar}
                  alt={contact.realtor.name}
                  className="h-5 w-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-primary">
                    {contact.realtor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">
                {contact.realtor.name}
              </span>
            </div>
          )}
          {contact.status === 'ON_HOLD' && contact.followUpAt && (
            <div className="flex items-center gap-1 ml-auto">
              {isOverdue
                ? <BellRing size={11} className="text-orange-500" />
                : <Clock size={11} className="text-amber-500" />
              }
              <span className={cn('text-xs', isOverdue ? 'text-orange-600 font-medium' : 'text-gray-400')}>
                {new Date(contact.followUpAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

// ─── Column ──────────────────────────────────────────────────────────────────

function KanbanColumn({
  config,
  contacts,
  overdueCount,
  onEdit,
  onDelete,
}: {
  config: typeof COLUMNS[number]
  contacts: CrmContact[]
  overdueCount: number
  onEdit: (c: CrmContact) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: config.status })
  const now = new Date()

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn('w-2 h-2 rounded-full shrink-0', config.dotColor)} />
        <h3 className={cn('text-sm font-semibold', config.headerColor)}>{config.label}</h3>
        <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
          {contacts.length}
        </span>
        {overdueCount > 0 && (
          <span className="text-xs font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {overdueCount} atrasado{overdueCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 rounded-xl p-2.5 min-h-[420px] transition-all',
          isOver
            ? cn(config.hoverBg, 'ring-2', config.hoverRing)
            : 'bg-gray-100/70',
        )}
      >
        {contacts.map((contact) => {
          const isOverdue =
            contact.status === 'ON_HOLD' &&
            !!contact.followUpAt &&
            new Date(contact.followUpAt) < now

          return (
            <KanbanCard
              key={contact.id}
              contact={contact}
              isOverdue={isOverdue}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        })}

        {contacts.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8">
            Arraste contatos aqui
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Board ───────────────────────────────────────────────────────────────────

export function CrmKanbanBoard({
  contacts,
  isRealtor,
  realtorProfileId,
  onEdit,
  onDelete,
}: CrmKanbanBoardProps) {
  const queryClient = useQueryClient()
  const [activeContact, setActiveContact] = useState<CrmContact | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const queryKey = ['crm-contacts', isRealtor ? realtorProfileId : 'all']

  const grouped = useMemo(() => {
    const groups: Record<CrmContact['status'], CrmContact[]> = {
      INTERESTED: [],
      VISITING: [],
      ON_HOLD: [],
    }
    for (const c of contacts) groups[c.status].push(c)
    return groups
  }, [contacts])

  const now = new Date()
  const overdueCount = useMemo(
    () => contacts.filter((c) => c.status === 'ON_HOLD' && c.followUpAt && new Date(c.followUpAt) < now).length,
    [contacts]
  )

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CrmContact['status'] }) =>
      api.patch(`/clientes/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<CrmContact[]>(queryKey)
      queryClient.setQueryData<CrmContact[]>(queryKey, (old) =>
        old?.map((c) => (c.id === id ? { ...c, status, followUpAt: status !== 'ON_HOLD' ? null : c.followUpAt } : c)) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
      toast.error('Erro ao mover contato')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveContact(contacts.find((c) => c.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveContact(null)
    if (!over) return
    const newStatus = over.id as CrmContact['status']
    const contact = contacts.find((c) => c.id === active.id)
    if (!contact || contact.status === newStatus) return
    statusMutation.mutate({ id: contact.id, status: newStatus })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            config={col}
            contacts={grouped[col.status]}
            overdueCount={col.status === 'ON_HOLD' ? overdueCount : 0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeContact && (
          <div className="rotate-1 scale-105 shadow-2xl">
            <div className="bg-white rounded-lg border border-gray-300 p-3 cursor-grabbing select-none w-64">
              <div className="flex items-start gap-1.5">
                <GripVertical size={14} className="text-gray-300 shrink-0 mt-0.5" />
                <p className="font-semibold text-sm text-gray-900 truncate">{activeContact.name}</p>
              </div>
              <p className="mt-0.5 text-xs text-gray-500 ml-5">{activeContact.phone}</p>
              {activeContact.description && (
                <p className="mt-1 text-xs text-gray-400 line-clamp-2 ml-5">{activeContact.description}</p>
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
