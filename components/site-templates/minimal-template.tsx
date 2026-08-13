import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { SiteFooter } from './site-footer'

interface MinimalTemplateProps {
  agencyId: string
}

export async function MinimalTemplate({ agencyId }: MinimalTemplateProps) {
  const { logoUrl, primaryColor } = await getTenantVisualConfig()

  return (
    <main className="flex min-h-screen flex-col bg-white">
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

      {/* ── Typography-forward hero ─────────────────────────────────────────── */}
      <section className="max-w-[900px] px-8 py-24 md:px-16 md:py-32">
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
          className="inline-flex items-center gap-3 border-b-2 pb-1 text-sm font-semibold transition-colors"
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          Explorar imóveis <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Thin divider ────────────────────────────────────────────────────── */}
      <div className="mx-8 border-t border-gray-100 md:mx-16" />

      {/* ── Highlights (no section heading noise) ───────────────────────────── */}
      <section className="px-8 py-16 md:px-16">
        <p className="mb-10 text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase">
          Destaques
        </p>
        <HighlightedPropertiesGrid
          agencyId={agencyId}
          renderCTA={(hasData) =>
            hasData ? (
              <Link
                href="/imoveis"
                className="mt-8 flex items-center gap-2 text-sm font-semibold"
                style={{ color: primaryColor }}
              >
                Ver todos os imóveis <ArrowRight size={14} />
              </Link>
            ) : null
          }
        />
      </section>

      <SiteFooter />
    </main>
  )
}
