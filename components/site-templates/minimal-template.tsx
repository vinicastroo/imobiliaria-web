import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { SiteFooter } from './site-footer'

interface MinimalTemplateProps {
  agencyId: string
}

const DIFERENCIAIS = [
  {
    title: 'Curadoria pessoal',
    description: 'Cada imóvel é selecionado a dedo antes de entrar no catálogo.',
  },
  {
    title: 'Resposta rápida',
    description: 'Corretores disponíveis para tirar dúvidas no mesmo dia.',
  },
  {
    title: 'Sem letras miúdas',
    description: 'Condições claras, do primeiro contato à assinatura.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Buscar',
    description: 'Filtre por cidade, bairro e tipo de imóvel.',
  },
  {
    number: '02',
    title: 'Visitar',
    description: 'Agende com o corretor responsável pelo imóvel.',
  },
  {
    number: '03',
    title: 'Fechar negócio',
    description: 'Negocie e assine com o apoio da nossa equipe.',
  },
]

export async function MinimalTemplate({ agencyId }: MinimalTemplateProps) {
  const { logoUrl, primaryColor, secondaryColor } = await getTenantVisualConfig()

  return (
    <main className="flex min-h-[100dvh] flex-col bg-white">
      {/* ── Minimal top bar ────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-gray-100 px-8 py-6 md:px-16">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Logo"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
            unoptimized
          />
        ) : (
          <div className="h-7 w-28 rounded-sm bg-gray-100" />
        )}
        <Link
          href="/imoveis"
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: primaryColor }}
        >
          Imóveis <ArrowRight size={14} />
        </Link>
      </header>

      {/* ── Typography-forward hero, split against a flat color panel ───────── */}
      <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        <div className="px-8 py-24 md:px-16 md:py-32">
          <p className="mb-6 text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
            Imobiliária
          </p>
          <h1 className="mb-8 text-4xl leading-[1.1] font-extralight text-gray-900 md:text-6xl">
            Imóveis escolhidos
            <br /> com cuidado.
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-relaxed font-light text-gray-500">
            Encontre o espaço ideal para viver ou investir com a orientação de quem entende do
            mercado.
          </p>
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-3 border-b-2 pb-1 text-sm font-semibold transition-all motion-safe:active:scale-[0.97]"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Explorar imóveis <ArrowRight size={16} />
          </Link>
        </div>
        <div className="relative hidden flex-col justify-end gap-4 overflow-hidden p-16 text-white md:flex">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 40vw, 0vw"
            className="-z-20 object-cover"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `linear-gradient(160deg, ${primaryColor}b3, ${secondaryColor}66)`,
            }}
          />
          <span className="font-serif text-6xl leading-none italic opacity-70">“</span>
          <p className="max-w-xs text-2xl leading-snug font-light">Menos ruído, mais lar.</p>
        </div>
      </section>

      {/* ── Thin divider ────────────────────────────────────────────────────── */}
      <div className="mx-8 border-t border-gray-100 md:mx-16" />

      {/* ── Diferenciais: three columns, no cards ─────────────────────────────── */}
      <section className="px-8 py-16 md:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:divide-x md:divide-gray-100">
          {DIFERENCIAIS.map((item) => (
            <div key={item.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <h3 className="mb-2 text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Thin divider ────────────────────────────────────────────────────── */}
      <div className="mx-8 border-t border-gray-100 md:mx-16" />

      {/* ── Como funciona ─────────────────────────────────────────────────────── */}
      <section className="px-8 py-16 md:px-16">
        <p className="mb-10 text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
          Como funciona
        </p>
        <div className="divide-y divide-gray-100">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[80px_1fr_2fr]"
            >
              <span className="text-3xl font-extralight" style={{ color: primaryColor }}>
                {step.number}
              </span>
              <h3 className="text-lg font-medium text-gray-900 md:col-start-2">{step.title}</h3>
              <p className="col-span-2 text-sm text-gray-500 md:col-span-1 md:col-start-3">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Thin divider ────────────────────────────────────────────────────── */}
      <div className="mx-8 border-t border-gray-100 md:mx-16" />

      {/* ── Highlights (no section heading noise) ───────────────────────────── */}
      <section className="px-8 py-16 md:px-16">
        <h2 className="mb-10 text-2xl font-light text-gray-900">Imóveis em destaque</h2>
        <HighlightedPropertiesGrid
          agencyId={agencyId}
          cta={
            <Link
              href="/imoveis"
              className="mt-8 flex items-center gap-2 text-sm font-semibold transition-transform motion-safe:active:scale-[0.97]"
              style={{ color: primaryColor }}
            >
              Ver todos os imóveis <ArrowRight size={14} />
            </Link>
          }
        />
      </section>

      <SiteFooter />
    </main>
  )
}
