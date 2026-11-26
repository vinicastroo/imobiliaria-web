'use client'

import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Inbox, MessageCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import api from '@/services/api'
import { BackLink } from '@/components/back-link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 md:p-8">
        <div className="mb-6 flex flex-col gap-4">
          <BackLink href="/admin" />
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-primary text-2xl font-bold">Pedidos de demonstração</h1>
              <p className="text-gray-500">
                Pedidos enviados pela landing page da Scala. Chame no WhatsApp e atualize o status.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros por status */}
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por status">
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
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
                )}
              >
                {f.label}
                {count !== undefined && (
                  <span className="rounded-full bg-gray-100 px-1.5 text-xs text-gray-600 tabular-nums">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="rounded-md border bg-white px-4 py-3">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <p className="text-gray-700">Não foi possível carregar os pedidos.</p>
              <Button variant="outline" onClick={() => refetch()}>
                Tentar de novo
              </Button>
            </div>
          ) : !isLoading && data && data.items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
              <p className="font-medium text-gray-700">
                {filter === 'ALL' ? 'Nenhum pedido ainda' : 'Nenhum pedido com esse status'}
              </p>
              <p className="max-w-sm text-sm text-gray-500">
                Os pedidos aparecem aqui assim que alguém preenche o formulário da landing page.
              </p>
            </div>
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
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((__, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : data?.items.map((r) => (
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
                          {r.realtorsRange
                            ? (TEAM_LABELS[r.realtorsRange] ?? r.realtorsRange)
                            : '—'}
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
                    ))}
              </TableBody>
            </Table>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
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
        )}
      </main>
    </div>
  )
}
