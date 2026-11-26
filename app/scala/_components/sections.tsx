import Image from 'next/image'
import {
  ArrowUpRight,
  Check,
  Globe,
  Layers,
  MessagesSquare,
  Sparkles,
  CalendarCheck,
  Settings2,
  Rocket,
  HelpCircle,
  Tag,
  Users,
} from 'lucide-react'

import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import scalaLogoWhite from '@/public/brand/scala-logo-white.svg'
import codelabzLogo from '@/public/codelabz.svg'
import aurosLogo from '@/public/logo-auros.svg'
import corretorCasal from '@/public/scala/corretor-casal.webp'
import gestora from '@/public/scala/gestora.webp'
import { FEATURE_LABELS, formatLimit, formatPlanPrice, type PublicPlan } from '../_lib/plans'
import { PrimaryButton, SectionHead } from './ui'

const container = 'mx-auto max-w-6xl px-5 sm:px-8'

// ─── Clientes (faixa de logos — Arco) ────────────────────────────────────────

const CLIENTS = [
  {
    name: 'Auros Imobiliária',
    url: 'https://aurosimobiliaria.com.br',
    logo: aurosLogo,
    w: 104,
    h: 52,
  },
  {
    name: 'Imóveis Gilli',
    url: 'https://imoveisgilli.com.br',
    logo: 'https://d2wss3tmei5yh1.cloudfront.net/visual-icon-1771943558283-Group-1000005975.png',
    w: 64,
    h: 54,
  },
]

export function ClientsStrip() {
  return (
    <section id="clientes" className="scroll-mt-20 border-b border-[var(--scala-border)] bg-white">
      <div
        className={`${container} flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between`}
      >
        <p className="text-sm text-[var(--scala-muted)]">Imobiliárias que já vendem com a Scala</p>
        <div className="flex items-center gap-10">
          {CLIENTS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener"
              title={c.name}
              className="flex items-center gap-3 opacity-60 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={c.logo}
                alt={c.name}
                width={c.w}
                height={c.h}
                className="h-10 w-auto object-contain"
              />
              <span className="text-sm font-medium text-[var(--scala-ink)]">{c.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Benefícios (células com borda e faixas hachuradas — Valeti) ─────────────

const BENEFITS = [
  {
    icon: MessagesSquare,
    title: 'Mais leads, menos perdidos',
    text: 'Todo contato do site cai no CRM e a equipe é avisada na hora.',
  },
  {
    icon: Layers,
    title: 'Tudo num lugar só',
    text: 'Site, imóveis, clientes e equipe no mesmo painel. Sem planilha.',
  },
  {
    icon: Globe,
    title: 'Site no seu domínio',
    text: 'Sua marca, suas cores e o endereço da sua imobiliária.',
  },
]

export function BenefitsStrip() {
  return (
    <section className="relative border-b border-[var(--scala-border)]">
      <Stagger className={`${container} grid sm:grid-cols-3`}>
        {BENEFITS.map(({ icon: Icon, title, text }, i) => (
          <StaggerItem
            key={title}
            className={`flex gap-4 border-[var(--scala-border)] py-8 sm:px-6 ${i > 0 ? 'max-sm:border-t sm:border-l' : ''}`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--scala-night)] text-white">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-semibold text-[var(--scala-ink)]">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--scala-muted)]">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

// ─── Para quem (foto da gestora + pilares — Arco) ────────────────────────────

const PILLARS = [
  {
    title: 'Para a imobiliária',
    text: 'Visão de todos os imóveis, leads e corretores. Decisões com números, não com achismo.',
  },
  {
    title: 'Para o corretor',
    text: 'Cadastra imóvel do celular, recebe o lead na hora e acompanha cada cliente no funil.',
  },
  {
    title: 'Para o seu cliente',
    text: 'Um site rápido, bonito e fácil de buscar, que passa confiança desde o primeiro clique.',
  },
]

export function ForWhoSection() {
  return (
    <section className="py-24">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <Image
              src={gestora}
              alt="Gestora de imobiliária sorrindo no escritório"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 bottom-8 max-w-[240px] rounded-2xl border border-[var(--scala-border)] bg-white p-4 shadow-[0_16px_40px_-12px_#0d111740] sm:-right-8">
            <p className="text-xs font-medium text-[var(--scala-muted)]">Hoje no painel</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--scala-ink)] tabular-nums">
              12 leads
            </p>
            <p className="text-xs text-[var(--scala-royal)]">3 visitas agendadas</p>
          </div>
        </Reveal>
        <div>
          <SectionHead
            align="left"
            icon={Users}
            eyebrow="Para quem é"
            title="Feita para quem vive o dia a dia da imobiliária"
            text="Da dona da imobiliária ao corretor na rua: cada um trabalha melhor, e o cliente percebe."
          />
          <Stagger className="flex flex-col gap-4">
            {PILLARS.map((p, i) => (
              <StaggerItem
                key={p.title}
                className="rounded-2xl border border-[var(--scala-border)] bg-white p-6 shadow-[0_1px_2px_#0d11170a]"
              >
                <span
                  className={`mb-4 block h-1 w-8 rounded-full ${['bg-[var(--scala-royal)]', 'bg-[var(--scala-royal-400)]', 'bg-[var(--scala-night)]'][i]}`}
                />
                <h3 className="text-lg font-semibold tracking-tight text-[var(--scala-ink)]">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--scala-muted)]">
                  {p.text}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

// ─── Como funciona (foto do corretor com o casal) ────────────────────────────

const STEPS = [
  {
    icon: CalendarCheck,
    title: 'Demonstração',
    text: 'Uma conversa rápida em que mostramos o painel e o site funcionando, com as dúvidas da sua equipe.',
  },
  {
    icon: Settings2,
    title: 'Configuração',
    text: 'Colocamos a sua marca, as suas cores e o seu domínio, e deixamos tudo pronto para a equipe entrar.',
  },
  {
    icon: Rocket,
    title: 'Site no ar',
    text: 'Os imóveis aparecem no site, os contatos caem no CRM e você acompanha tudo pelo painel.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-y border-[var(--scala-border)] bg-white py-24">
      <div className={container}>
        <SectionHead
          icon={Sparkles}
          eyebrow="Como funciona"
          title="Do primeiro contato ao site no ar"
        />
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="relative min-h-[320px] overflow-hidden rounded-[28px]">
            <Image
              src={corretorCasal}
              alt="Corretor mostrando um apartamento a um casal"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1530cc] to-transparent p-6 pt-20">
              <p className="max-w-sm text-lg font-medium text-white">
                Mais tempo com o cliente, menos tempo com planilha.
              </p>
            </div>
          </Reveal>
          <Stagger as="ol" className="flex flex-col gap-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem
                as="li"
                key={title}
                className="flex flex-1 gap-5 rounded-2xl border border-[var(--scala-border)] p-6"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--scala-royal-soft)] text-[var(--scala-royal)]">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--scala-muted)] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--scala-ink)]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--scala-muted)]">
                    {text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

// ─── Preços ──────────────────────────────────────────────────────────────────

const RECOMMENDED_PLAN = 'Professional'

export function PricingSection({ plans }: { plans: PublicPlan[] | null }) {
  return (
    <section id="precos" className="scroll-mt-20 py-24">
      <div className={container}>
        <SectionHead
          icon={Tag}
          eyebrow="Preços"
          title="Planos que crescem com a sua imobiliária"
          text="Todos com site no seu domínio. Valores mensais."
        />
        {plans ? (
          <Stagger className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const recommended = plan.name === RECOMMENDED_PLAN
              return (
                <StaggerItem
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_#0d111740] ${
                    recommended
                      ? 'border-[var(--scala-royal)] shadow-[0_0_0_1px_var(--scala-royal)]'
                      : 'border-[var(--scala-border)]'
                  }`}
                >
                  {recommended && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[var(--scala-royal)] px-3 py-1 text-xs font-semibold text-white">
                      Recomendado
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-[var(--scala-ink)]">{plan.name}</h3>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-[var(--scala-ink)] tabular-nums">
                      {formatPlanPrice(plan.defaultPrice)}
                    </span>
                    <span className="text-sm text-[var(--scala-muted)]">/mês</span>
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-[var(--scala-border)] pt-6 text-[15px]">
                    <PlanItem>{formatLimit(plan.maxProperties, 'imóvel', 'imóveis')}</PlanItem>
                    <PlanItem>{formatLimit(plan.maxRealtors, 'corretor', 'corretores')}</PlanItem>
                    <PlanItem>
                      {formatLimit(plan.maxUsers, 'usuário', 'usuários')} no painel
                    </PlanItem>
                    {plan.allowCustomDomain && <PlanItem>Site com domínio próprio</PlanItem>}
                    {plan.features.map((f) =>
                      FEATURE_LABELS[f] ? <PlanItem key={f}>{FEATURE_LABELS[f]}</PlanItem> : null,
                    )}
                  </ul>
                  <PrimaryButton
                    href="#demonstracao"
                    variant={recommended ? 'primary' : 'secondary'}
                    className="mt-7 h-11"
                  >
                    Agendar demonstração
                  </PrimaryButton>
                </StaggerItem>
              )
            })}
          </Stagger>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-[var(--scala-border)] bg-white p-8 text-center">
            <p className="text-[15px] text-[var(--scala-muted)]">
              Não conseguimos carregar os planos agora. Fale com a gente e enviamos os valores.
            </p>
            <PrimaryButton href="#demonstracao">Fale com a gente</PrimaryButton>
          </div>
        )}
      </div>
    </section>
  )
}

function PlanItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[var(--scala-ink)]">
      <Check className="mt-0.5 size-4 shrink-0 text-[var(--scala-royal)]" strokeWidth={2.25} />
      <span>{children}</span>
    </li>
  )
}

// ─── Perguntas ───────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: 'Posso usar o domínio da minha imobiliária?',
    a: 'Sim. Todos os planos permitem usar o seu domínio (por exemplo, suaimobiliaria.com.br). Ajudamos a apontar o endereço para o site.',
  },
  {
    q: 'Meus corretores também usam o painel?',
    a: 'Sim. Cada pessoa tem o próprio acesso, como proprietário, gerente ou corretor, e vê só o que precisa. O número de usuários e corretores depende do plano.',
  },
  {
    q: 'Os contatos do site vão para onde?',
    a: 'Para o CRM do painel. Cada contato vira um card no funil, com o imóvel de interesse, e a equipe é avisada.',
  },
  {
    q: 'Posso mudar de plano depois?',
    a: 'Sim. Quando a imobiliária crescer, é só trocar de plano pelo próprio painel.',
  },
  {
    q: 'Como funciona a demonstração?',
    a: 'Você preenche o formulário, a gente te chama no WhatsApp e marca uma conversa para mostrar o painel e o site funcionando.',
  },
]

export function FaqSection() {
  return (
    <section
      id="perguntas"
      className="scroll-mt-20 border-t border-[var(--scala-border)] bg-white py-24"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead icon={HelpCircle} eyebrow="Dúvidas" title="Perguntas frequentes" />
        <Reveal className="divide-y divide-[var(--scala-border)] rounded-2xl border border-[var(--scala-border)] bg-white">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-[var(--scala-ink)]">
                {item.q}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--scala-border)] text-[var(--scala-muted)] transition-transform duration-300 ease-[cubic-bezier(.2,0,0,1)] group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--scala-muted)]">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

// ─── Rodapé ──────────────────────────────────────────────────────────────────

export function SiteFooter() {
  return (
    <footer className="bg-[var(--scala-night)] py-12 text-white/70">
      <div
        className={`${container} flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex flex-col gap-3">
          <Image src={scalaLogoWhite} alt="Scala" className="h-6 w-auto self-start" />
          <p className="text-sm">Sua imobiliária em outra escala.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm sm:items-end">
          <a
            href="#demonstracao"
            className="inline-flex items-center gap-1 text-white hover:underline"
          >
            Agendar demonstração <ArrowUpRight className="size-3.5" />
          </a>
          <p>© {new Date().getFullYear()} Scala · scalamob.com.br</p>
        </div>
      </div>
      <div
        className={`${container} mt-10 flex justify-center border-t border-white/10 pt-6 sm:justify-end`}
      >
        <a
          href="https://codelabz.com.br"
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-2 text-xs text-white/50 transition-colors hover:text-white/80"
        >
          by
          <Image
            src={codelabzLogo}
            alt="Codelabz"
            className="h-3.5 w-auto opacity-60 transition-opacity group-hover:opacity-100"
          />
        </a>
      </div>
    </footer>
  )
}
