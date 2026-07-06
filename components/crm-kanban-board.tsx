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
import { BellRing, Clock, Pencil, Phone, Plus, Settings2, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import api from '@/services/api'
import { getStageColor, type ClientStage } from '@/components/crm-stage-colors'
import { CrmStageDialog } from '@/components/crm-stage-dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export interface CrmContact {
  id: string
  name: string
  phone: string
  email?: string | null
  description: string
  stageId?: string | null
  stage?: { id: string; name: string; color: string; systemKey: string | null } | null
  followUpAt?: string | null
  realtorId?: string | null
  realtor?: { id: string; name: string; avatar?: string | null } | null
  createdAt: string
  contactDate?: string | null
  captureSource?: string | null
  propertiesId?: string | null
  property?: { id: string; name: string; code: number; slug: string } | null
  desiredPropertyType?: string | null
  desiredNeighborhood?: string | null
  priceRangeMin?: string | number | null
  priceRangeMax?: string | number | null
  paymentMethod?: string | null
}

interface CrmKanbanBoardProps {
  contacts: CrmContact[]
  stages: ClientStage[]
  isRealtor: boolean
  realtorProfileId?: string | null
  onEdit: (contact: CrmContact) => void
  onDelete: (id: string) => void
}

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
        'group relative rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
        'cursor-grab select-none touch-none transition-all duration-150',
        'hover:-translate-y-px hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)]',
        'active:cursor-grabbing',
        isDragging && 'opacity-0',
        isOverdue && 'border-orange-200 bg-orange-50/30',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="flex-1 min-w-0 truncate text-sm font-semibold text-gray-900">{contact.name}</p>
        <div className="absolute right-2 top-2 flex gap-0.5 rounded-lg bg-white/95 opacity-0 shadow-sm ring-1 ring-gray-100 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-primary hover:bg-gray-50"
            onClick={(e) => { e.stopPropagation(); onEdit(contact) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete(contact.id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
        <Phone size={11} className="text-gray-300" />
        {contact.phone}
      </p>

      {contact.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-gray-400 line-clamp-2">{contact.description}</p>
      )}

      {(contact.realtor || contact.followUpAt) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-50 pt-2.5">
          {contact.realtor && (
            <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-gray-50 py-0.5 pl-0.5 pr-2 ring-1 ring-gray-100">
              {contact.realtor.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contact.realtor.avatar}
                  alt={contact.realtor.name}
                  className="h-5 w-5 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <span className="text-[9px] font-bold text-primary">
                    {contact.realtor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="max-w-[110px] truncate text-[11px] font-medium text-gray-600">
                {contact.realtor.name}
              </span>
            </div>
          )}
          {contact.followUpAt && (
            <div
              className={cn(
                'ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]',
                isOverdue ? 'bg-orange-50 font-medium text-orange-600' : 'bg-amber-50/70 text-amber-600',
              )}
            >
              {isOverdue ? <BellRing size={11} /> : <Clock size={11} />}
              {new Date(contact.followUpAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

// ─── Column ──────────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  contacts,
  overdueCount,
  canManage,
  dragActive,
  onEdit,
  onDelete,
  onEditStage,
}: {
  stage: ClientStage
  contacts: CrmContact[]
  overdueCount: number
  canManage: boolean
  dragActive: boolean
  onEdit: (c: CrmContact) => void
  onDelete: (id: string) => void
  onEditStage: (stage: ClientStage) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })
  const colors = getStageColor(stage.color)
  const now = new Date()

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)] md:h-full md:w-[300px] md:shrink-0">
      <div className={cn('h-1 shrink-0', colors.dot)} />

      <div className="group flex shrink-0 items-center gap-2 px-3.5 py-3">
        <h3 className="truncate text-sm font-semibold text-gray-800">{stage.name}</h3>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums', colors.pill)}>
          {contacts.length}
        </span>
        {canManage && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
            onClick={() => onEditStage(stage)}
          >
            <Settings2 size={12} />
          </Button>
        )}
        {overdueCount > 0 && (
          <span className="ml-auto whitespace-nowrap rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-600 ring-1 ring-orange-100">
            {overdueCount} atrasado{overdueCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'thin-scrollbar mx-1.5 mb-1.5 flex min-h-[280px] flex-1 flex-col gap-2 overflow-y-auto rounded-xl p-2 transition-all',
          isOver
            ? cn(colors.hoverBg, 'ring-2 ring-inset', colors.hoverRing)
            : 'bg-gray-50/80',
        )}
      >
        {contacts.map((contact) => {
          const isOverdue =
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

        {dragActive && (
          <div
            className={cn(
              'flex flex-1 items-center justify-center rounded-lg border border-dashed py-6 transition-colors',
              isOver ? cn('border-transparent', colors.header) : 'border-gray-200 text-gray-400',
            )}
          >
            <p className="text-xs">Arraste aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Board ───────────────────────────────────────────────────────────────────

export function CrmKanbanBoard({
  contacts,
  stages,
  isRealtor,
  realtorProfileId,
  onEdit,
  onDelete,
}: CrmKanbanBoardProps) {
  const queryClient = useQueryClient()
  const [activeContact, setActiveContact] = useState<CrmContact | null>(null)
  const [pendingChange, setPendingChange] = useState<{ contact: CrmContact; toStage: ClientStage } | null>(null)
  const [statusNote, setStatusNote] = useState('')
  const [stageDialogOpen, setStageDialogOpen] = useState(false)
  const [stageToEdit, setStageToEdit] = useState<ClientStage | null>(null)

  const canManageStages = !isRealtor

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const queryKey = ['crm-contacts', isRealtor ? realtorProfileId : 'all']

  const grouped = useMemo(() => {
    const groups: Record<string, CrmContact[]> = {}
    for (const stage of stages) groups[stage.id] = []

    const fallbackStageId = stages[0]?.id
    for (const contact of contacts) {
      const key = contact.stageId && groups[contact.stageId] ? contact.stageId : fallbackStageId
      if (key) groups[key].push(contact)
    }
    return groups
  }, [contacts, stages])

  const now = new Date()
  const overdueByStage = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const contact of contacts) {
      if (contact.followUpAt && new Date(contact.followUpAt) < now && contact.stageId) {
        counts[contact.stageId] = (counts[contact.stageId] ?? 0) + 1
      }
    }
    return counts
  }, [contacts])

  const statusMutation = useMutation({
    mutationFn: ({ id, stageId, note }: { id: string; stageId: string; note?: string }) =>
      api.patch(`/clientes/${id}/status`, { stageId, note: note || undefined }),
    onMutate: async ({ id, stageId }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<CrmContact[]>(queryKey)
      const newStage = stages.find((s) => s.id === stageId)
      queryClient.setQueryData<CrmContact[]>(queryKey, (old) =>
        old?.map((c) =>
          c.id === id
            ? { ...c, stageId, stage: newStage ?? c.stage }
            : c
        ) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
      toast.error('Erro ao mover contato')
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] })
      queryClient.invalidateQueries({ queryKey: ['client-status-logs', vars.id] })
    },
  })

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveContact(contacts.find((c) => c.id === active.id) ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveContact(null)
    if (!over) return
    const toStage = stages.find((s) => s.id === over.id)
    const contact = contacts.find((c) => c.id === active.id)
    if (!toStage || !contact || contact.stageId === toStage.id) return
    setStatusNote('')
    setPendingChange({ contact, toStage })
  }

  const confirmStatusChange = () => {
    if (!pendingChange) return
    statusMutation.mutate({
      id: pendingChange.contact.id,
      stageId: pendingChange.toStage.id,
      note: statusNote.trim(),
    })
    setPendingChange(null)
  }

  const handleCreateStage = () => {
    setStageToEdit(null)
    setStageDialogOpen(true)
  }

  const handleEditStage = (stage: ClientStage) => {
    setStageToEdit(stage)
    setStageDialogOpen(true)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="thin-scrollbar flex flex-col gap-4 pb-3 md:h-[calc(100vh-240px)] md:min-h-[480px] md:flex-row md:items-stretch md:overflow-x-auto">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            contacts={grouped[stage.id] ?? []}
            overdueCount={overdueByStage[stage.id] ?? 0}
            canManage={canManageStages}
            dragActive={!!activeContact && activeContact.stageId !== stage.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onEditStage={handleEditStage}
          />
        ))}

        {canManageStages && (
          <div className="md:shrink-0 md:pt-0.5">
            <Button
              variant="ghost"
              onClick={handleCreateStage}
              className="h-7 rounded-full px-2.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Plus size={15} className="mr-1" /> Nova coluna
            </Button>
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeContact && (
          <div className="rotate-2 scale-[1.03]">
            <div className="w-64 cursor-grabbing select-none rounded-xl border border-gray-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5">
              <p className="truncate text-sm font-semibold text-gray-900">{activeContact.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <Phone size={11} className="text-gray-300" />
                {activeContact.phone}
              </p>
              {activeContact.description && (
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 line-clamp-2">{activeContact.description}</p>
              )}
            </div>
          </div>
        )}
      </DragOverlay>

      <CrmStageDialog
        open={stageDialogOpen}
        onOpenChange={setStageDialogOpen}
        stageToEdit={stageToEdit}
      />

      <Dialog open={!!pendingChange} onOpenChange={(open) => { if (!open) setPendingChange(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingChange && (
                <>
                  {pendingChange.contact.stage?.name ?? 'Sem coluna'}
                  {' → '}
                  {pendingChange.toStage.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo da mudança (opcional)</label>
            <Textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Ex: Está esperando até o mês 8 para fazer a compra"
              rows={3}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingChange(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmStatusChange}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
