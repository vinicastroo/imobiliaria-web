'use client'

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
        'group relative rounded-lg border border-[var(--scala-border)] bg-white p-3 shadow-[0_1px_2px_#0d11170a]',
        'cursor-grab touch-none transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(.2,0,0,1)] select-none',
        'hover:-translate-y-0.5 hover:border-[#141a223d] hover:shadow-[0_8px_20px_-8px_#0d111733]',
        'active:cursor-grabbing',
        isDragging && 'opacity-0',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <p
          className="min-w-0 flex-1 truncate pr-1 text-sm font-medium text-[var(--scala-ink)]"
          title={contact.name}
        >
          {contact.name}
        </p>
        <div className="absolute top-2 right-2 flex gap-0.5 rounded-md bg-white opacity-0 shadow-sm ring-1 ring-[var(--scala-border)] transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary text-muted-foreground h-6 w-6"
            aria-label={`Editar ${contact.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contact)
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Pencil size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-6 w-6 hover:bg-red-50 hover:text-red-600"
            aria-label={`Excluir ${contact.name}`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(contact.id)
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs tabular-nums">
        <Phone size={11} className="opacity-60" />
        {contact.phone}
      </p>

      {contact.description && (
        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
          {contact.description}
        </p>
      )}

      {(contact.realtor || contact.followUpAt) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--scala-border)] pt-2.5">
          {contact.realtor && (
            <div className="flex min-w-0 items-center gap-1.5">
              {contact.realtor.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contact.realtor.avatar}
                  alt={contact.realtor.name}
                  className="h-5 w-5 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="bg-primary/15 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                  <span className="text-primary text-[9px] font-bold">
                    {contact.realtor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-muted-foreground max-w-[120px] truncate text-[11px] font-medium">
                {contact.realtor.name}
              </span>
            </div>
          )}
          {contact.followUpAt && (
            <div
              className={cn(
                'ml-auto flex items-center gap-1 text-[11px] tabular-nums',
                isOverdue ? 'font-medium text-orange-600' : 'text-muted-foreground',
              )}
            >
              {isOverdue ? <BellRing size={11} /> : <Clock size={11} />}
              {isOverdue && <span className="sr-only">Atrasado:</span>}
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
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--scala-border)] bg-[var(--scala-paper)] md:h-full md:w-[300px] md:shrink-0">
      <div className="group flex shrink-0 items-center gap-2 px-3.5 pt-3 pb-2">
        <span className={cn('size-2 shrink-0 rounded-full', colors.dot)} aria-hidden="true" />
        <h3 className="truncate text-sm font-medium text-[var(--scala-ink)]">{stage.name}</h3>
        <span className="text-muted-foreground rounded-full bg-white px-1.5 py-0.5 text-[11px] font-medium tabular-nums ring-1 ring-[var(--scala-border)]">
          {contacts.length}
        </span>
        {canManage && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            onClick={() => onEditStage(stage)}
            aria-label={`Editar etapa ${stage.name}`}
          >
            <Settings2 size={12} />
          </Button>
        )}
        {overdueCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium whitespace-nowrap text-orange-600">
            <BellRing size={11} />
            {overdueCount} atrasado{overdueCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'thin-scrollbar mx-1.5 mb-1.5 flex min-h-[280px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-1.5 transition-colors duration-200',
          isOver && cn(colors.hoverBg, 'ring-2 ring-inset', colors.hoverRing),
        )}
      >
        {contacts.map((contact) => {
          const isOverdue = !!contact.followUpAt && new Date(contact.followUpAt) < now

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

        {dragActive ? (
          <div
            className={cn(
              'flex flex-1 items-center justify-center rounded-lg border border-dashed py-6 transition-colors',
              isOver
                ? cn('border-transparent', colors.header)
                : 'text-muted-foreground border-[var(--scala-border)]',
            )}
          >
            <p className="text-xs">Solte aqui</p>
          </div>
        ) : (
          contacts.length === 0 && (
            <p className="text-muted-foreground px-2 py-8 text-center text-xs">
              Nenhum contato nesta etapa
            </p>
          )
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
  const [pendingChange, setPendingChange] = useState<{
    contact: CrmContact
    toStage: ClientStage
  } | null>(null)
  const [statusNote, setStatusNote] = useState('')
  const [stageDialogOpen, setStageDialogOpen] = useState(false)
  const [stageToEdit, setStageToEdit] = useState<ClientStage | null>(null)

  const canManageStages = !isRealtor

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

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
      queryClient.setQueryData<CrmContact[]>(
        queryKey,
        (old) =>
          old?.map((c) => (c.id === id ? { ...c, stageId, stage: newStage ?? c.stage } : c)) ?? [],
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
              className="text-muted-foreground hover:text-foreground h-9 rounded-lg border border-dashed border-[var(--scala-border)] px-3 text-xs hover:bg-white"
            >
              <Plus size={15} className="mr-1" /> Nova coluna
            </Button>
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(.2,0,0,1)' }}>
        {activeContact && (
          <div className="scale-[1.03] rotate-2">
            <div className="w-64 cursor-grabbing rounded-lg border border-[var(--scala-border)] bg-white p-3 shadow-[0_16px_40px_-8px_#0d111740] select-none">
              <p className="truncate text-sm font-medium text-[var(--scala-ink)]">
                {activeContact.name}
              </p>
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                <Phone size={11} className="opacity-60" />
                {activeContact.phone}
              </p>
              {activeContact.description && (
                <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                  {activeContact.description}
                </p>
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

      <Dialog
        open={!!pendingChange}
        onOpenChange={(open) => {
          if (!open) setPendingChange(null)
        }}
      >
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
            <Button onClick={confirmStatusChange}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
