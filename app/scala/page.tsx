import { SiteHeader } from './_components/site-header'
import { ProductPreview } from './_components/product-preview'
import { DemoForm } from './_components/demo-form'
import {
  ClientsSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  FaqSection,
  SiteFooter,
} from './_components/sections'
import { getPublicPlans } from './_lib/plans'

// Landing page da Scala — servida em scalamob.com.br (rewrite em proxy.ts).
export const revalidate = 3600

export default async function ScalaLandingPage() {
  const plans = await getPublicPlans()

  return (
    <div className="min-h-screen bg-[var(--scala-paper)] text-[var(--scala-ink)] antialiased">
      <SiteHeader />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="overflow-hidden pt-16 pb-20 sm:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col items-start gap-6">
              <span className="rounded-full border border-[var(--scala-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--scala-muted)]">
                Para imobiliárias e corretores
              </span>
              <h1 className="text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
                Sua imobiliária em <span className="text-[var(--scala-royal)]">outra escala.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-pretty text-[var(--scala-muted)]">
                Site com o seu domínio, gestão de imóveis e CRM num só lugar. Menos planilha, menos
                lead perdido no WhatsApp e mais tempo para vender.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#demonstracao"
                  className="inline-flex h-12 items-center rounded-[10px] bg-[var(--scala-royal)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--scala-royal-hover)]"
                >
                  Agendar demonstração
                </a>
                <a
                  href="#precos"
                  className="inline-flex h-12 items-center rounded-[10px] border border-[var(--scala-border)] bg-white px-6 text-[15px] font-semibold text-[var(--scala-ink)] transition-colors hover:border-[#141a223d]"
                >
                  Ver planos
                </a>
              </div>
              <p className="text-sm text-[var(--scala-muted)]">
                Usado por imobiliárias como a{' '}
                <strong className="font-medium text-[var(--scala-ink)]">Auros</strong> e a{' '}
                <strong className="font-medium text-[var(--scala-ink)]">Gilli</strong>.
              </p>
            </div>
            <ProductPreview />
          </div>
        </section>

        <ClientsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection plans={plans} />
        <FaqSection />

        {/* ── Demonstração ─────────────────────────────────────────────── */}
        <section id="demonstracao" className="scroll-mt-20 bg-[var(--scala-night)] py-24">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--scala-royal-400)] uppercase">
                Demonstração
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Veja a Scala funcionando com a sua imobiliária
              </h2>
              <p className="text-[17px] leading-relaxed text-white/70">
                Deixe seu contato. Em até 1 dia útil a gente te chama no WhatsApp para marcar uma
                conversa rápida e mostrar o painel e o site.
              </p>
              <ul className="flex flex-col gap-2 text-[15px] text-white/80">
                <li>· Sem compromisso</li>
                <li>· Tire as dúvidas da sua equipe</li>
                <li>· Veja como fica o site com o seu domínio</li>
              </ul>
            </div>
            <DemoForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
