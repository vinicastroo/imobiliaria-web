import Image from 'next/image'
import {
  Globe,
  Home,
  KanbanSquare,
  BarChart3,
  Users,
  Building,
  Check,
  ArrowUpRight,
} from 'lucide-react'

import scalaLogoWhite from '@/public/brand/scala-logo-white.svg'
import aurosPhoto from '@/public/auros-secao.png'
import gilliPhoto from '@/public/gilli-secao.png'
import { FEATURE_LABELS, formatLimit, formatPlanPrice, type PublicPlan } from '../_lib/plans'

// ─── Cabeçalho de seção ──────────────────────────────────────────────────────

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-[var(--scala-royal)] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-[var(--scala-ink)] sm:text-4xl">
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-[17px] leading-relaxed text-pretty text-[var(--scala-muted)]">
          {text}
        </p>
      )}
    </div>
  )
}

// ─── Clientes ────────────────────────────────────────────────────────────────

const CLIENTS = [
  {
    name: 'Auros Imobiliária',
    place: 'Rio do Sul e Balneário Camboriú',
    url: 'https://aurosimobiliaria.com.br',
    domain: 'aurosimobiliaria.com.br',
    photo: aurosPhoto,
  },
  {
    name: 'Imóveis Gilli',
    place: 'Site e gestão na Scala',
    url: 'https://imoveisgilli.com.br',
    domain: 'imoveisgilli.com.br',
    photo: gilliPhoto,
  },
]

export function ClientsSection() {
  return (
    <section id="clientes" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Clientes"
          title="Imobiliárias que já vendem com a Scala"
          text="Cada uma com o próprio site, no próprio domínio, e a equipe trabalhando no mesmo painel."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {CLIENTS.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener"
              className="group overflow-hidden rounded-2xl border border-[var(--scala-border)] bg-white transition-colors hover:border-[#141a223d]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--scala-paper)]">
                <Image
                  src={c.photo}
                  alt={`Imagem do site da ${c.name}`}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--scala-ink)]">{c.name}</p>
                  <p className="truncate text-sm text-[var(--scala-muted)]">{c.place}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--scala-royal)]">
                  {c.domain}
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Recursos ────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Globe,
    title: 'Site com o seu domínio',
    text: 'Um site rápido e pronto para o Google, com a sua marca, as suas cores e o endereço da sua imobiliária.',
  },
  {
    icon: Home,
    title: 'Gestão de imóveis',
    text: 'Cadastre com até 20 fotos, destaque os melhores e publique no site na hora, sem depender de ninguém.',
  },
  {
    icon: KanbanSquare,
    title: 'CRM em kanban',
    text: 'Cada lead que chega pelo site vira um card no funil. Você vê quem atender, em que etapa e com qual corretor.',
  },
  {
    icon: BarChart3,
    title: 'Métricas do site',
    text: 'Saiba quais imóveis são mais vistos, quantas visitas o site recebe por dia e de onde elas vêm.',
  },
  {
    icon: Users,
    title: 'Equipe e corretores',
    text: 'Proprietário, gerente e corretor, cada um com o acesso certo. Cada imóvel com o seu corretor responsável.',
  },
  {
    icon: Building,
    title: 'Empreendimentos',
    text: 'Organize lançamentos e prédios com várias unidades num lugar só, com página própria no site.',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="scroll-mt-20 border-y border-[var(--scala-border)] bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Recursos"
          title="Tudo o que a imobiliária usa no dia a dia, num só lugar"
          text="Chega de planilha, de anúncio desatualizado e de lead perdido no WhatsApp."
        />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--scala-border)] bg-[var(--scala-border)] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3 bg-white p-7">
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-[var(--scala-royal-soft)] text-[var(--scala-royal)]">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--scala-ink)]">
                {title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--scala-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Como funciona ───────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Demonstração',
    text: 'Uma conversa rápida em que mostramos o painel e o site funcionando, com as dúvidas da sua equipe.',
  },
  {
    title: 'Configuração',
    text: 'Colocamos a sua marca, as suas cores e o seu domínio, e deixamos tudo pronto para a equipe entrar.',
  },
  {
    title: 'Site no ar',
    text: 'Os imóveis aparecem no site, os contatos caem no CRM e você acompanha tudo pelo painel.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead eyebrow="Como funciona" title="Do primeiro contato ao site no ar" />
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--scala-border)] bg-white p-7"
            >
              <span className="text-sm font-semibold text-[var(--scala-royal)] tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--scala-ink)]">
                {step.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--scala-muted)]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ─── Preços ──────────────────────────────────────────────────────────────────

const RECOMMENDED_PLAN = 'Professional'

export function PricingSection({ plans }: { plans: PublicPlan[] | null }) {
  return (
    <section
      id="precos"
      className="scroll-mt-20 border-y border-[var(--scala-border)] bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Preços"
          title="Planos que crescem com a sua imobiliária"
          text="Todos com site no seu domínio. Valores mensais."
        />

        {plans ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const recommended = plan.name === RECOMMENDED_PLAN
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-white p-7 ${
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
                  <a
                    href="#demonstracao"
                    className={`mt-7 inline-flex h-11 items-center justify-center rounded-[10px] text-[15px] font-semibold transition-colors ${
                      recommended
                        ? 'bg-[var(--scala-royal)] text-white hover:bg-[var(--scala-royal-hover)]'
                        : 'border border-[var(--scala-border)] text-[var(--scala-ink)] hover:border-[#141a223d]'
                    }`}
                  >
                    Agendar demonstração
                  </a>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-[var(--scala-border)] bg-[var(--scala-paper)] p-8 text-center">
            <p className="text-[15px] text-[var(--scala-muted)]">
              Não conseguimos carregar os planos agora. Fale com a gente e enviamos os valores.
            </p>
            <a
              href="#demonstracao"
              className="inline-flex h-11 items-center rounded-[10px] bg-[var(--scala-royal)] px-5 text-[15px] font-semibold text-white hover:bg-[var(--scala-royal-hover)]"
            >
              Fale com a gente
            </a>
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
    <section id="perguntas" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHead eyebrow="Dúvidas" title="Perguntas frequentes" />
        <div className="divide-y divide-[var(--scala-border)] rounded-2xl border border-[var(--scala-border)] bg-white">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium text-[var(--scala-ink)]">
                {item.q}
                <span className="text-xl leading-none text-[var(--scala-muted)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--scala-muted)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Rodapé ──────────────────────────────────────────────────────────────────

export function SiteFooter() {
  return (
    <footer className="bg-[var(--scala-night)] py-12 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-3">
          <Image src={scalaLogoWhite} alt="Scala" className="h-6 w-auto self-start" />
          <p className="text-sm">Sua imobiliária em outra escala.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm sm:text-right">
          <a href="#demonstracao" className="text-white hover:underline">
            Agendar demonstração
          </a>
          <p>© {new Date().getFullYear()} Scala · scalamob.com.br</p>
        </div>
      </div>
    </footer>
  )
}
