import Image from 'next/image'
import { Layers } from 'lucide-react'

import { MotionProvider, Reveal } from '@/components/motion'
import equipe from '@/public/scala/equipe.webp'
import { SiteHeader } from './_components/site-header'
import { Hero } from './_components/hero'
import { Solutions } from './_components/solutions'
import { DemoForm } from './_components/demo-form'
import {
  BenefitsStrip,
  ClientsStrip,
  FaqSection,
  ForWhoSection,
  HowItWorksSection,
  PricingSection,
  SiteFooter,
} from './_components/sections'
import { SectionHead } from './_components/ui'
import { getPublicPlans } from './_lib/plans'

// Landing page da Scala — servida em scalamob.com.br (rewrite em proxy.ts).
export const revalidate = 3600

export default async function ScalaLandingPage() {
  const plans = await getPublicPlans()

  return (
    <MotionProvider>
      <div className="min-h-screen bg-[var(--scala-paper)] text-[var(--scala-ink)] antialiased">
        <SiteHeader />

        <main>
          <Hero />
          <ClientsStrip />
          <BenefitsStrip />

          {/* ── Soluções (abas — Valeti) ─────────────────────────────── */}
          <section id="solucoes" className="scroll-mt-20 py-24">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <SectionHead
                icon={Layers}
                eyebrow="Soluções"
                title="Uma plataforma, tudo o que a imobiliária precisa"
                text="Do anúncio ao fechamento: site, imóveis, CRM, métricas e equipe trabalhando juntos."
              />
              <Reveal>
                <Solutions />
              </Reveal>
            </div>
          </section>

          <HowItWorksSection />
          <ForWhoSection />
          <PricingSection plans={plans} />
          <FaqSection />

          {/* ── Demonstração (bloco de cor — Arco) ───────────────────── */}
          <section id="demonstracao" className="scroll-mt-20 bg-[var(--scala-royal)] py-24">
            <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
              <Reveal className="flex flex-col gap-6 text-white lg:sticky lg:top-28">
                <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  Demonstração
                </span>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[42px] sm:leading-[1.1]">
                  Veja a Scala funcionando com a sua imobiliária
                </h2>
                <p className="text-[17px] leading-relaxed text-white/80">
                  Deixe seu contato. Em até 1 dia útil a gente te chama no WhatsApp para marcar uma
                  conversa rápida e mostrar o painel e o site.
                </p>
                <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] ring-1 ring-white/20">
                  <Image
                    src={equipe}
                    alt="Equipe de imobiliária reunida em volta de um notebook"
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <DemoForm />
              </Reveal>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </MotionProvider>
  )
}
