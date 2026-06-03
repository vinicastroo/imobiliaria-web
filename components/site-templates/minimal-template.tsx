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
    <main className="flex flex-col min-h-screen bg-white">

      {/* ── Minimal top bar ────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-gray-100">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" width={120} height={40} className="object-contain h-9 w-auto" unoptimized />
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
      <section className="px-8 md:px-16 py-24 md:py-32 max-w-[900px]">
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-400 mb-6">
          Imobiliária
        </p>
        <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 leading-[1.1] mb-8">
          Imóveis escolhidos<br /> com cuidado.
        </h1>
        <p className="text-lg text-gray-500 font-light mb-10 max-w-lg leading-relaxed">
          Encontre o espaço ideal para viver ou investir com a orientação de quem entende do mercado.
        </p>
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-3 text-sm font-semibold border-b-2 pb-1 transition-colors"
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          Explorar imóveis <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Thin divider ────────────────────────────────────────────────────── */}
      <div className="mx-8 md:mx-16 border-t border-gray-100" />

      {/* ── Highlights (no section heading noise) ───────────────────────────── */}
      <section className="px-8 md:px-16 py-16">
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-400 mb-10">
          Destaques
        </p>
        <HighlightedPropertiesGrid
          agencyId={agencyId}
          renderCTA={(hasData) =>
            hasData ? (
              <Link
                href="/imoveis"
                className="mt-8 text-sm font-semibold flex items-center gap-2"
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
