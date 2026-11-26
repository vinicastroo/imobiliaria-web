'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BarChart3, Check, Globe, Home, KanbanSquare, Users } from 'lucide-react'

import { DURATION, EASE } from '@/components/motion'
import { cn } from '@/lib/utils'

// "Uma plataforma, várias soluções" — lista à esquerda com indicador ativo
// (referência Valeti), tela no meio e descrição à direita.

type Tab = {
  id: string
  icon: React.ElementType
  label: string
  title: string
  text: string
  bullets: string[]
  Screen: () => React.ReactElement
}

const TABS: Tab[] = [
  {
    id: 'site',
    icon: Globe,
    label: 'Site',
    title: 'Um site com a cara da sua imobiliária',
    text: 'Seu domínio, sua marca e suas cores. Os imóveis cadastrados no painel aparecem no site na hora, prontos para o Google.',
    bullets: [
      'Domínio próprio em todos os planos',
      'Busca por cidade, bairro e tipo',
      'Página de cada imóvel com fotos e mapa',
    ],
    Screen: SiteScreen,
  },
  {
    id: 'imoveis',
    icon: Home,
    label: 'Imóveis',
    title: 'Cadastre e publique sem depender de ninguém',
    text: 'Fotos, características, corretor responsável e destaque na home. Tudo num formulário só.',
    bullets: [
      'Até 20 fotos por imóvel, com recorte',
      'Imóveis em destaque no site',
      'Código automático por imóvel',
    ],
    Screen: PropertiesScreen,
  },
  {
    id: 'crm',
    icon: KanbanSquare,
    label: 'CRM',
    title: 'Nenhum lead perdido no WhatsApp',
    text: 'Cada contato do site vira um card no funil. A equipe vê quem atender, em que etapa e com qual corretor.',
    bullets: [
      'Funil em kanban, arrastando os cards',
      'Histórico de cada cliente',
      'Aviso quando chega um lead novo',
    ],
    Screen: CrmScreen,
  },
  {
    id: 'metricas',
    icon: BarChart3,
    label: 'Métricas',
    title: 'Saiba o que está dando resultado',
    text: 'Visitas por dia, de onde elas vêm e quais imóveis chamam mais atenção.',
    bullets: ['Visitas do site por dia', 'Origem do tráfego', 'Imóveis mais vistos'],
    Screen: MetricsScreen,
  },
  {
    id: 'equipe',
    icon: Users,
    label: 'Equipe',
    title: 'Cada pessoa com o acesso certo',
    text: 'Proprietário, gerente e corretor. Cada um vê e edita só o que precisa.',
    bullets: [
      'Papéis de proprietário, gerente e corretor',
      'Corretor responsável por imóvel',
      'Perfis de corretor no site',
    ],
    Screen: TeamScreen,
  },
]

export function Solutions() {
  const [active, setActive] = useState(TABS[0].id)
  const baseId = useId()
  const tab = TABS.find((t) => t.id === active) ?? TABS[0]

  return (
    <div className="grid overflow-hidden rounded-2xl border border-[var(--scala-border)] bg-white lg:grid-cols-[220px_1fr_1fr]">
      {/* Lista de abas */}
      <div
        role="tablist"
        aria-label="Soluções da Scala"
        aria-orientation="vertical"
        className="flex gap-1 overflow-x-auto border-b border-[var(--scala-border)] p-2 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:p-4"
        onKeyDown={(e) => {
          const i = TABS.findIndex((t) => t.id === active)
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight')
            setActive(TABS[(i + 1) % TABS.length].id)
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft')
            setActive(TABS[(i - 1 + TABS.length) % TABS.length].id)
        }}
      >
        {TABS.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2.5 rounded-lg px-4 py-3 text-left text-[15px] transition-colors duration-200 lg:text-lg',
                selected
                  ? 'font-medium text-[var(--scala-ink)]'
                  : 'text-[var(--scala-muted)] hover:bg-[#141a2208] hover:text-[var(--scala-ink)]',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[var(--scala-royal)] max-lg:inset-x-3 max-lg:top-auto max-lg:bottom-0 max-lg:h-[3px] max-lg:w-auto max-lg:rounded-t max-lg:rounded-r-none"
                  transition={{ duration: DURATION.medium, ease: EASE }}
                />
              )}
              <t.icon className={cn('size-4 shrink-0', selected && 'text-[var(--scala-royal)]')} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tela */}
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border-b border-[var(--scala-border)] bg-[var(--scala-paper)] p-6 lg:border-r lg:border-b-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: DURATION.medium, ease: EASE }}
            className="relative w-full max-w-sm"
            aria-hidden="true"
          >
            <tab.Screen />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Descrição */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${tab.id}`}
        className="p-6 sm:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: DURATION.medium, ease: EASE }}
            className="flex flex-col gap-5"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--scala-royal-soft)] text-[var(--scala-royal)]">
              <tab.icon className="size-5" />
            </span>
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--scala-ink)]">
              {tab.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[var(--scala-muted)]">{tab.text}</p>
            <ul className="flex flex-col gap-2.5">
              {tab.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-[15px] text-[var(--scala-ink)]"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--scala-royal)]"
                    strokeWidth={2.25}
                  />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="#demonstracao"
              className="group mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--scala-royal)]"
            >
              Ver na demonstração
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Telas (mini-interfaces decorativas) ──────────────────────────────────────

const card =
  'rounded-xl border border-[var(--scala-border)] bg-white shadow-[0_16px_40px_-16px_#0d111740]'

function SiteScreen() {
  return (
    <div className={cn(card, 'overflow-hidden')}>
      <div className="flex items-center justify-between border-b border-[var(--scala-border)] px-3 py-2">
        <span className="text-[11px] font-semibold text-[var(--scala-ink)]">
          Imobiliária Horizonte
        </span>
        <span className="text-[10px] text-[var(--scala-muted)]">horizonteimoveis.com.br</span>
      </div>
      <div className="relative h-28 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=70')] bg-cover bg-center">
        <div className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 px-3 py-2 text-[11px] text-[var(--scala-muted)]">
          Buscar por cidade, bairro ou código…
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {['R$ 640.000', 'R$ 1.100.000'].map((p) => (
          <div key={p} className="rounded-lg border border-[var(--scala-border)] p-2">
            <div className="mb-1.5 h-10 rounded bg-[var(--scala-royal-soft)]" />
            <p className="text-[11px] font-semibold text-[var(--scala-ink)]">{p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PropertiesScreen() {
  return (
    <div className={cn(card, 'flex flex-col gap-3 p-4')}>
      <p className="text-[12px] font-semibold text-[var(--scala-ink)]">Novo imóvel</p>
      <div className="grid grid-cols-4 gap-1.5">
        {[
          'photo-1600596542815-ffad4c1539a9',
          'photo-1600585154340-be6161a56a0c',
          'photo-1600607687939-ce8a6c25118c',
        ].map((id) => (
          <div
            key={id}
            className="aspect-square rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(https://images.unsplash.com/${id}?w=200&q=60)` }}
          />
        ))}
        <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-[var(--scala-royal-200)] text-lg text-[var(--scala-royal)]">
          +
        </div>
      </div>
      {['Casa com piscina · 3 suítes', 'R$ 1.250.000', 'Rio do Sul · 280 m²'].map((v) => (
        <div
          key={v}
          className="rounded-md border border-[var(--scala-border)] px-2.5 py-1.5 text-[11px] text-[var(--scala-ink)]"
        >
          {v}
        </div>
      ))}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--scala-muted)]">
          <span className="h-3.5 w-6 rounded-full bg-[var(--scala-royal)] p-0.5">
            <span className="block size-2.5 translate-x-2.5 rounded-full bg-white" />
          </span>
          Destaque no site
        </span>
        <span className="rounded-md bg-[var(--scala-royal)] px-2.5 py-1 text-[11px] font-semibold text-white">
          Publicar
        </span>
      </div>
    </div>
  )
}

function CrmScreen() {
  const cols = [
    { name: 'Novo', items: ['Mariana · Apto Centro', 'Rafael · Casa'] },
    { name: 'Visita', items: ['Juliana · Cobertura'] },
    { name: 'Proposta', items: ['Pedro · Terreno'] },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {cols.map((c) => (
        <div key={c.name} className={cn(card, 'flex flex-col gap-1.5 p-2')}>
          <p className="px-1 text-[10px] font-semibold text-[var(--scala-muted)] uppercase">
            {c.name}
          </p>
          {c.items.map((i) => (
            <div
              key={i}
              className="rounded-md border border-[var(--scala-border)] bg-white p-1.5 text-[10px] leading-tight text-[var(--scala-ink)]"
            >
              {i}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function MetricsScreen() {
  const bars = [30, 42, 38, 55, 48, 62, 58, 70, 66, 82, 76, 92]
  return (
    <div className={cn(card, 'flex flex-col gap-3 p-4')}>
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] font-semibold text-[var(--scala-ink)]">Visitas no site</p>
        <p className="text-[11px] font-medium text-[var(--scala-royal)]">+18% no mês</p>
      </div>
      <div className="flex h-28 items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.03 }}
            className={cn(
              'flex-1 rounded-t',
              i === bars.length - 1 ? 'bg-[var(--scala-royal)]' : 'bg-[var(--scala-royal-200)]',
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px] text-[var(--scala-muted)]">
        <span>Google 52%</span>
        <span>Direto 31%</span>
        <span>Redes 17%</span>
      </div>
    </div>
  )
}

function TeamScreen() {
  const people = [
    { n: 'Ana Paula Ribeiro', r: 'Proprietária', i: 'AR' },
    { n: 'Carlos Medeiros', r: 'Gerente', i: 'CM' },
    { n: 'Juliana Costa', r: 'Corretora', i: 'JC' },
    { n: 'Pedro Henrique Alves', r: 'Corretor', i: 'PA' },
  ]
  return (
    <div className={cn(card, 'flex flex-col divide-y divide-[var(--scala-border)]')}>
      {people.map((p) => (
        <div key={p.n} className="flex items-center gap-2.5 px-3 py-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-[var(--scala-royal-soft)] text-[10px] font-semibold text-[var(--scala-royal)]">
            {p.i}
          </span>
          <span className="flex-1 truncate text-[12px] text-[var(--scala-ink)]">{p.n}</span>
          <span className="rounded-full bg-[var(--scala-paper)] px-2 py-0.5 text-[10px] text-[var(--scala-muted)]">
            {p.r}
          </span>
        </div>
      ))}
    </div>
  )
}
