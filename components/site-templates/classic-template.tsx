import Link from 'next/link'
import Image from 'next/image'
import { Building2, ShieldCheck, Headphones } from 'lucide-react'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { getTenantIdentity } from '@/lib/tenant-info'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { HeroSearchForm } from '@/components/hero-search-form'
import { SiteFooter } from './site-footer'

interface ClassicTemplateProps {
  agencyId: string
}

const TRUST_ITEMS = [
  { icon: Building2, label: 'Imóveis selecionados' },
  { icon: ShieldCheck, label: 'Negociação segura' },
  { icon: Headphones, label: 'Atendimento próximo' },
]

export async function ClassicTemplate({ agencyId }: ClassicTemplateProps) {
  const [{ logoUrl, primaryColor, secondaryColor }, { name }] = await Promise.all([
    getTenantVisualConfig(),
    getTenantIdentity(),
  ])

  return (
    <main className="flex min-h-[100dvh] flex-col bg-white">
      {/* ── Header: logo centrado + links ─────────────────────────────────── */}
      <header className="border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={160}
              height={56}
              className="h-12 w-auto object-contain"
              unoptimized
            />
          ) : (
            <div className="h-10 w-36 rounded bg-gray-100" />
          )}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="transition-colors hover:text-gray-900">
              Início
            </Link>
            <Link href="/imoveis" className="transition-colors hover:text-gray-900">
              Imóveis
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Banner hero: real photo with brand-color scrim ───────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 text-center text-white md:py-28">
        <Image
          src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}e6 0%, ${secondaryColor}cc 100%)`,
          }}
        />
        <p className="mb-3 text-sm font-semibold tracking-widest text-white/80 uppercase">
          Bem-vindo à nossa imobiliária
        </p>
        <h1 className="mb-6 text-3xl leading-tight font-bold drop-shadow-sm md:text-5xl">
          O imóvel certo
          <br className="hidden md:block" /> está aqui
        </h1>
        <div className="mx-auto max-w-3xl">
          <HeroSearchForm primaryColor={primaryColor} />
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white px-6 py-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:grid-cols-3">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 sm:justify-start">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform motion-safe:hover:scale-110"
                style={{ backgroundColor: `${primaryColor}1a`, color: primaryColor }}
              >
                <Icon size={18} />
              </span>
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quem somos: foto + texto ──────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">Quem somos</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              A {name} nasceu para simplificar a busca por um imóvel. Acompanhamos cada etapa, da
              primeira visita até a assinatura do contrato.
            </p>
            <p className="leading-relaxed text-gray-600">
              Trabalhamos com uma curadoria cuidadosa de imóveis e corretores que conhecem cada
              bairro de perto.
            </p>
          </div>
        </div>
      </section>

      {/* ── Highlighted properties ─────────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Imóveis em Destaque</h2>
              <p className="mt-1 text-sm text-gray-500">Selecionados especialmente para você</p>
            </div>
            <Link
              href="/imoveis"
              className="rounded-lg border px-4 py-2 text-sm font-semibold transition-all hover:bg-gray-100 motion-safe:active:scale-[0.97]"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Ver todos
            </Link>
          </div>
          <div className="flex justify-center">
            <HighlightedPropertiesGrid agencyId={agencyId} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
