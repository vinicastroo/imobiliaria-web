'use client'

import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Inbox, MessageCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'
import { AdminPage, DataCard, PageHeader } from '@/components/admin/page'
import { EmptyState, TableSkeletonRows } from '@/components/admin/states'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DemoStatus = 'NEW' | 'CONTACTED' | 'CLOSED' | 'DISCARDED'

interface DemoRequest {
  id: string
  name: string
  agencyName: string
  phone: string
  email: string | null
  realtorsRange: string | null
  message: string | null
  status: DemoStatus
  source: string | null
  createdAt: string
}

interface DemoRequestPage {
  items: DemoRequest[]
  total: number
  page: number
  totalPages: number
  counts: Record<DemoStatus, number>
}

const STATUS_LABELS: Record<DemoStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Em contato',
  CLOSED: 'Fechado',
  DISCARDED: 'Descartado',
}

const STATUS_STYLES: Record<DemoStatus, string> = {
  NEW: 'bg-primary/10 text-primary',
  CONTACTED: 'bg-amber-100 text-amber-800',
  CLOSED: 'bg-emerald-100 text-emerald-800',
  DISCARDED: 'bg-gray-100 text-gray-600',
}

const TEAM_LABELS: Record<string, string> = {
  '1': 'Só ele(a)',
  '2-5': '2 a 5',
  '6-15': '6 a 15',
  '16-30': '16 a 30',
  '30+': 'Mais de 30',
}

const FILTERS: Array<{ value: DemoStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'NEW', label: 'Novos' },
  { value: 'CONTACTED', label: 'Em contato' },
  { value: 'CLOSED', label: 'Fechados' },
  { value: 'DISCARDED', label: 'Descartados' },
]

function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return digits
}

function whatsappLink(phone: string, name: string) {
  const d = phone.replace(/\D/g, '')
  const number = d.startsWith('55') ? d : `55${d}`
  const text = encodeURIComponent(
    `Olá, ${name.split(' ')[0]}! Aqui é da Scala, sobre a demonstração que você pediu.`,
  )
  return `https://wa.me/${number}?text=${text}`
}

export default function DemoRequestsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<DemoStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)

  const queryKey = ['admin-demo-requests', filter, page]
  const { data, isLoading, isError, refetch, isFetching } = useQuery<DemoRequestPage>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (filter !== 'ALL') params.set('status', filter)
      const res = await api.get(`/admin/demo-requests?${params}`)
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DemoStatus }) => {
      await api.patch(`/admin/demo-requests/${id}`, { status })
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<DemoRequestPage>(queryKey)
      queryClient.setQueryData<DemoRequestPage>(queryKey, (old) =>
        old ? { ...old, items: old.items.map((r) => (r.id === id ? { ...r, status } : r)) } : old,
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous)
      toast.error('Não foi possível mudar o status. Tente de novo.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-demo-requests'] })
    },
  })

  const counts = data?.counts
  const totalAll = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined

  return (
    <AdminPage width="wide">
      <PageHeader
        title="Pedidos de demonstração"
        description="Pedidos enviados pela landing page da Scala. Chame no WhatsApp e atualize o status."
        actions={
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            Atualizar
          </Button>
        }
      />

      <DataCard
        toolbar={
          <>
            {/* Filtros por status */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por status">
              {FILTERS.map((f) => {
                const count = f.value === 'ALL' ? totalAll : counts?.[f.value]
                const active = filter === f.value
                return (
                  <button
                    key={f.value}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setFilter(f.value)
                      setPage(1)
                    }}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground border-[var(--scala-border)] bg-white hover:border-[#141a223d]',
                    )}
                  >
                    {f.label}
                    {count !== undefined && (
                      <span className="text-muted-foreground rounded-full bg-[var(--scala-paper)] px-1.5 text-xs tabular-nums">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        }
        footer={
          data && data.totalPages > 1 ? (
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span className="tabular-nums">
                Página {data.page} de {data.totalPages} · {data.total} pedidos
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {isError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Não foi possível carregar os pedidos"
            description="Verifique a conexão e tente de novo."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : !isLoading && data && data.items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filter === 'ALL' ? 'Nenhum pedido ainda' : 'Nenhum pedido com esse status'}
            description="Os pedidos aparecem aqui assim que alguém preenche o formulário da landing page."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Recebido</TableHead>
                <TableHead>Pessoa</TableHead>
                <TableHead>Imobiliária</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead className="min-w-[200px]">Mensagem</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={7} rows={5} />
              ) : (
                data?.items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm whitespace-nowrap text-gray-600 tabular-nums">
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                      <span className="block text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <span className="block truncate font-medium" title={r.name}>
                        {r.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="block truncate" title={r.agencyName}>
                        {r.agencyName}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <a
                        href={whatsappLink(r.phone, r.name)}
                        target="_blank"
                        rel="noopener"
                        className="text-primary inline-flex items-center gap-1 whitespace-nowrap hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        {formatPhone(r.phone)}
                      </a>
                      {r.email && (
                        <a
                          href={`mailto:${r.email}`}
                          className="block max-w-[200px] truncate text-xs text-gray-500 hover:underline"
                          title={r.email}
                        >
                          {r.email}
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-gray-600">
                      {r.realtorsRange ? (TEAM_LABELS[r.realtorsRange] ?? r.realtorsRange) : '—'}
                    </TableCell>
                    <TableCell className="max-w-[260px] text-sm text-gray-600">
                      <span className="line-clamp-2" title={r.message ?? undefined}>
                        {r.message || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <select
                        aria-label={`Status do pedido de ${r.name}`}
                        value={r.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: r.id,
                            status: e.target.value as DemoStatus,
                          })
                        }
                        className={cn(
                          'focus-visible:ring-primary h-8 w-full cursor-pointer rounded-md border-0 px-2 text-xs font-medium outline-none focus-visible:ring-2',
                          STATUS_STYLES[r.status],
                        )}
                      >
                        {(Object.keys(STATUS_LABELS) as DemoStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DataCard>
    </AdminPage>
  )
}
