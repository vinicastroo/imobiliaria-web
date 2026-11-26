'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight, Building2, CheckCircle2, TrendingUp } from 'lucide-react'

import { DURATION, EASE, Float } from '@/components/motion'
import { ProductPreview } from './product-preview'
import { Eyebrow, PrimaryButton } from './ui'
import corretora from '@/public/scala/corretora-recorte.webp'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE, delay },
})

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--scala-border)]">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          <motion.div {...enter(0)}>
            <Eyebrow icon={Building2}>Feito para imobiliárias e corretores</Eyebrow>
          </motion.div>
          <motion.h1
            {...enter(0.06)}
            className="text-[44px] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-[64px]"
          >
            Sua imobiliária em <span className="text-[var(--scala-royal)]">outra escala.</span>
          </motion.h1>
          <motion.p
            {...enter(0.12)}
            className="max-w-xl text-lg leading-relaxed text-pretty text-[var(--scala-muted)]"
          >
            Site com o seu domínio, gestão de imóveis e CRM num só lugar. Menos planilha, menos lead
            perdido no WhatsApp e mais tempo para vender.
          </motion.p>
          <motion.div {...enter(0.18)} className="flex flex-wrap items-center gap-3">
            <PrimaryButton href="#demonstracao">
              Agendar demonstração
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </PrimaryButton>
            <PrimaryButton href="#solucoes" variant="secondary">
              Conhecer a plataforma
            </PrimaryButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="relative pb-10 lg:pb-0"
        >
          {/* Bloco de cor com a pessoa (Arco) */}
          <div className="relative ml-auto aspect-[5/5.2] w-full max-w-[560px] overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,var(--scala-royal-soft),var(--scala-royal-200))]">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-72 rounded-full bg-white/50 blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="absolute right-[-4%] bottom-0 h-[96%] w-[78%]"
            >
              <Image
                src={corretora}
                alt="Corretora de imóveis sorrindo, segurando um tablet"
                fill
                priority
                sizes="(min-width: 1024px) 440px, 80vw"
                className="object-contain object-bottom"
              />
            </motion.div>
          </div>

          {/* Prévia do painel sobreposta */}
          <div className="@container relative z-10 -mt-[38%] mr-auto w-[86%] max-w-[480px] sm:-mt-[34%] lg:-ml-12">
            <ProductPreview />
          </div>

          {/* Cards flutuantes (Valeti) */}
          <Float className="absolute top-8 -left-3 z-20 hidden sm:block lg:-left-12" delay={0.2}>
            <div className="flex items-center gap-3 rounded-xl border border-[var(--scala-border)] bg-white px-3.5 py-2.5 shadow-[0_12px_32px_-8px_#0d111733]">
              <span className="flex size-8 items-center justify-center rounded-full bg-[var(--scala-royal-soft)] text-xs font-semibold text-[var(--scala-royal)]">
                MF
              </span>
              <div>
                <p className="text-[12px] font-semibold text-[var(--scala-ink)]">
                  Novo lead pelo site
                </p>
                <p className="text-[11px] text-[var(--scala-muted)]">
                  Apto 3 quartos · Centro · agora
                </p>
              </div>
            </div>
          </Float>

          <Float
            className="absolute top-[42%] right-2 z-20 hidden sm:block"
            delay={1.1}
            duration={6}
          >
            <div className="flex items-center gap-2 rounded-xl border border-[var(--scala-border)] bg-white px-3.5 py-2.5 shadow-[0_12px_32px_-8px_#0d111733]">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <div>
                <p className="text-[12px] font-semibold text-[var(--scala-ink)]">
                  Imóvel publicado
                </p>
                <p className="text-[11px] text-[var(--scala-muted)]">suaimobiliaria.com.br</p>
              </div>
            </div>
          </Float>

          <Float
            className="absolute right-0 -bottom-8 z-20 hidden sm:block lg:-right-6 lg:-bottom-6"
            delay={0.6}
            duration={5.5}
          >
            <div className="flex items-center gap-3 rounded-xl bg-[var(--scala-night)] px-3.5 py-2.5 text-white shadow-[0_12px_32px_-8px_#0d111766]">
              <TrendingUp className="size-4 text-[var(--scala-royal-400)]" />
              <p className="text-[12px] font-semibold">
                +18% <span className="font-normal text-white/70">visitas este mês</span>
              </p>
              <div className="flex h-6 items-end gap-0.5" aria-hidden="true">
                {[35, 50, 42, 64, 58, 80, 100].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-sm bg-[var(--scala-royal-400)]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </Float>
        </motion.div>
      </div>
    </section>
  )
}
