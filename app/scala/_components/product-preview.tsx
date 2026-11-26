'use client'

import Image from 'next/image'
import { Home, ContactRound, BarChart3, Users, Settings, Search } from 'lucide-react'
import scalaMark from '@/public/brand/scala-mark-dark.svg'
import { CountUp, Typewriter } from '@/components/motion'

// Prévia do painel em código (não é screenshot), com dados de exemplo.
// Decorativa para leitores de tela.
const PROPERTIES = [
  {
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70',
    price: 'R$ 1.250.000',
    title: 'Casa com piscina · 3 suítes',
    meta: '280 m² · Rio do Sul',
    badge: 'Destaque',
  },
  {
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70',
    price: 'R$ 890.000',
    title: 'Apartamento no Centro',
    meta: '86 m² · 2 vagas',
    badge: null,
  },
  {
    photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=70',
    price: 'R$ 2.400.000',
    title: 'Cobertura frente mar',
    meta: '210 m² · Balneário Camboriú',
    badge: 'Novo',
  },
]

const NAV = [
  { icon: Home, label: 'Imóveis', active: true },
  { icon: ContactRound, label: 'CRM' },
  { icon: BarChart3, label: 'Métricas' },
  { icon: Users, label: 'Equipe' },
  { icon: Settings, label: 'Ajustes' },
]

const SEARCHES = ['apartamento 3 quartos no Centro', 'casa com piscina', 'cobertura frente mar']

const KPIS = [
  { label: 'Ativos', value: 128, note: '+12 este mês' },
  { label: 'Visitas', value: 4380, note: '+18%' },
  { label: 'Leads', value: 37, note: '7 dias' },
]

export function ProductPreview() {
  return (
    <div
      aria-hidden="true"
      className="@container overflow-hidden rounded-2xl border border-[var(--scala-border)] bg-white shadow-[0_2px_4px_#0d111714,0_32px_64px_-12px_#0d111729]"
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-[var(--scala-border)] bg-[var(--scala-paper)] px-3">
        <span className="size-2.5 rounded-full bg-[#141a221f]" />
        <span className="size-2.5 rounded-full bg-[#141a221f]" />
        <span className="size-2.5 rounded-full bg-[#141a221f]" />
        <span className="ml-3 truncate text-[11px] text-[var(--scala-muted)]">
          suaimobiliaria.com.br/admin/imoveis
        </span>
      </div>
      <div className="grid grid-cols-[52px_1fr] @[420px]:grid-cols-[132px_1fr]">
        <aside className="flex flex-col gap-1 border-r border-[var(--scala-border)] bg-[var(--scala-paper)] p-2 sm:p-3">
          <div className="mb-3 flex items-center gap-2 px-1 pt-1">
            <Image src={scalaMark} alt="" className="h-5 w-auto" />
            <span className="hidden text-sm font-semibold text-[var(--scala-ink)] @[420px]:inline">
              scala
            </span>
          </div>
          {NAV.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] ${
                active
                  ? 'bg-white text-[var(--scala-ink)] shadow-[0_1px_2px_#0d11170f]'
                  : 'text-[var(--scala-muted)]'
              }`}
            >
              {active && (
                <span className="absolute top-1.5 bottom-1.5 -left-2 w-[3px] rounded-r bg-[var(--scala-royal)] @[420px]:-left-3" />
              )}
              <Icon className="size-3.5 shrink-0" />
              <span className="hidden @[420px]:inline">{label}</span>
            </div>
          ))}
        </aside>
        <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--scala-border)] px-2.5 text-[12px] text-[var(--scala-ink)]">
              <Search className="size-3.5 shrink-0 text-[var(--scala-muted)]" />
              <Typewriter phrases={SEARCHES} className="truncate" />
            </div>
            <span className="shrink-0 rounded-lg bg-[var(--scala-royal)] px-2.5 py-2 text-[11px] font-semibold text-white">
              Cadastrar imóvel
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-[var(--scala-border)] px-2 py-1.5 sm:px-3 sm:py-2"
              >
                <p className="truncate text-[10px] text-[var(--scala-muted)] sm:text-[11px]">
                  {k.label}
                </p>
                <CountUp
                  value={k.value}
                  className="block text-base font-semibold text-[var(--scala-ink)] tabular-nums sm:text-lg"
                />
                <p className="truncate text-[10px] font-medium text-[var(--scala-royal)]">
                  {k.note}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 @[520px]:grid-cols-3">
            {PROPERTIES.map((p, i) => (
              <div
                key={p.title}
                className={`overflow-hidden rounded-lg border border-[var(--scala-border)] ${i === 2 ? 'hidden @[520px]:block' : ''}`}
              >
                <div className="relative h-16 sm:h-20">
                  <Image src={p.photo} alt="" fill sizes="200px" className="object-cover" />
                  {p.badge && (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-[var(--scala-royal)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[12px] font-semibold text-[var(--scala-ink)] tabular-nums">
                    {p.price}
                  </p>
                  <p className="truncate text-[10px] text-[var(--scala-muted)]">{p.title}</p>
                  <p className="truncate text-[10px] text-[var(--scala-muted)]">{p.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
