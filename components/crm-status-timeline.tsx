'use client'

import { memo, useMemo } from 'react'
import { ArrowRight, UserPlus, UserCheck, UserMinus } from 'lucide-react'

type ClientLogType = 'CREATED' | 'STATUS_CHANGE' | 'ASSIGNED' | 'UNASSIGNED'

export interface ClientStatusLog {
  id: string
  type: ClientLogType
  fromStage: string | null
  fromStageColor: string | null
  toStage: string | null
  toStageColor: string | null
  note: string | null
  createdAt: string
  changedBy: { id: string; name: string } | null
  realtor: { id: string; name: string } | null
}

interface CrmStatusTimelineProps {
  logs: ClientStatusLog[]
  clientCreatedAt?: string | null
  currentStage?: { name: string; color: string } | null
}

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function buildTimelineEntries(
  logs: ClientStatusLog[],
  clientCreatedAt: string | null | undefined,
  currentStage: { name: string; color: string } | null | undefined,
): ClientStatusLog[] {
  const hasCreationLog = logs.some((log) => log.type === 'CREATED')

  if (hasCreationLog || !clientCreatedAt) return logs

  // Clientes antigos não têm log de criação — sintetiza o primeiro ponto
  const oldestStatusLog = [...logs].reverse().find((log) => log.fromStage !== null)

  return [
    ...logs,
    {
      id: 'creation',
      type: 'CREATED',
      fromStage: null,
      fromStageColor: null,
      toStage: oldestStatusLog?.fromStage ?? currentStage?.name ?? null,
      toStageColor: oldestStatusLog?.fromStageColor ?? currentStage?.color ?? null,
      note: null,
      createdAt: clientCreatedAt,
      changedBy: null,
      realtor: null,
    },
  ]
}

function StageBadge({ name }: { name: string }) {
  return (
    <span className="text-foreground inline-flex items-center gap-1.5 font-medium">
      <span className="h-2 w-2 rounded-full bg-gray-300" />
      {name}
    </span>
  )
}

function EntryTitle({ entry }: { entry: ClientStatusLog }) {
  if (entry.type === 'CREATED') {
    return (
      <p className="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
        <UserPlus className="text-muted-foreground h-3.5 w-3.5" />
        <span>Cliente criado</span>
        {entry.toStage && (
          <>
            <span className="text-muted-foreground font-normal">como</span>
            <StageBadge name={entry.toStage} />
          </>
        )}
        {entry.realtor && (
          <span className="text-muted-foreground font-normal">
            · responsável: <span className="text-foreground font-medium">{entry.realtor.name}</span>
          </span>
        )}
      </p>
    )
  }

  if (entry.type === 'ASSIGNED') {
    return (
      <p className="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
        <UserCheck className="text-muted-foreground h-3.5 w-3.5" />
        Responsável definido:
        <span>{entry.realtor?.name ?? 'Corretor removido'}</span>
      </p>
    )
  }

  if (entry.type === 'UNASSIGNED') {
    return (
      <p className="text-foreground flex flex-wrap items-center gap-1.5 font-medium">
        <UserMinus className="text-muted-foreground h-3.5 w-3.5" />
        Responsável removido
        {entry.realtor && (
          <span className="text-muted-foreground font-normal">({entry.realtor.name})</span>
        )}
      </p>
    )
  }

  return (
    <p className="flex flex-wrap items-center gap-1.5">
      {entry.fromStage && <StageBadge name={entry.fromStage} />}
      <ArrowRight className="text-muted-foreground h-3 w-3" />
      {entry.toStage && <StageBadge name={entry.toStage} />}
    </p>
  )
}

export const CrmStatusTimeline = memo(function CrmStatusTimeline({
  logs,
  clientCreatedAt,
  currentStage,
}: CrmStatusTimelineProps) {
  const entries = useMemo(
    () => buildTimelineEntries(logs, clientCreatedAt, currentStage),
    [logs, clientCreatedAt, currentStage],
  )

  if (entries.length === 0) return null

  return (
    <ol className="border-border relative ml-1.5 space-y-4 border-l pl-5">
      {entries.map((entry) => (
        <li key={entry.id} className="relative text-xs">
          <span className="bg-background ring-background absolute top-0.5 -left-[25px] h-2.5 w-2.5 rounded-full border-2 border-gray-300 ring-4" />

          <EntryTitle entry={entry} />

          <p className="text-muted-foreground mt-0.5">
            {formatDateTime(entry.createdAt)}
            {entry.changedBy && <> · por {entry.changedBy.name}</>}
          </p>

          {entry.note && (
            <p className="bg-muted text-muted-foreground mt-1 rounded-md px-2 py-1.5">
              {entry.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
})
