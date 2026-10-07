import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Sparkles, Building2, Users, ShieldCheck, RefreshCw } from 'lucide-react'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { HeroSearchForm } from '@/components/hero-search-form'
import { SiteFooter } from './site-footer'

interface ModernTemplateProps {
  agencyId: string
}

const HIGHLIGHTS = [
  { icon: Search, label: 'Busca inteligente' },
  { icon: MapPin, label: 'Localização estratégica' },
  { icon: Sparkles, label: 'Curadoria exclusiva' },
]

const STEPS = [
  {
    number: '01',
    title: 'Buscar',
    description: 'Filtre por cidade, bairro, tipo e faixa de valor em segundos.',
  },
  {
    number: '02',
    title: 'Visitar',
    description: 'Agende com o corretor responsável e conheça o imóvel de perto.',
  },
  {
    number: '03',
    title: 'Fechar negócio',
    description: 'Negocie condições com apoio da nossa equipe até a assinatura.',
  },
]

export async function ModernTemplate({ agencyId }: ModernTemplateProps) {
  const { logoUrl, primaryColor, secondaryColor } = await getTenantVisualConfig()

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* ── Hero: full-viewport photo with dark scrim + gradient blobs ──────── */}
      <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden sm:pb-24">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover"
        />
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-950/85 via-gray-950/60 to-gray-950/90" />
        <div
          className="absolute -top-32 -right-32 -z-10 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ backgroundColor: primaryColor, opacity: 0.3 }}
        />
        <div
          className="absolute -bottom-40 -left-32 -z-10 h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{ backgroundColor: secondaryColor, opacity: 0.2 }}
        />

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          ) : (
            <div className="h-8 w-32 rounded bg-white/20" />
          )}
          <Link
            href="/imoveis"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Ver imóveis
          </Link>
        </nav>

        {/* Headline + search */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
          <h1 className="max-w-2xl text-3xl leading-tight font-light text-white drop-shadow-lg md:text-5xl">
            Encontre o imóvel
            <br className="hidden md:block" /> dos seus sonhos
          </h1>
          <div className="w-full max-w-3xl">
            <HeroSearchForm primaryColor={primaryColor} />
          </div>
        </div>

        {/* Floating glass highlights — overlaps into the next section */}
        <div className="relative z-10 mx-auto -mb-20 hidden w-full max-w-4xl px-6 sm:block">
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={20} className="text-white" />
                <span className="text-xs font-medium text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diferenciais: asymmetric bento ───────────────────────────────────── */}
      <section className="w-full bg-white px-4 py-16 sm:pt-28 md:px-12">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
            Por que buscar imóveis com a gente
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
            <div
              className="flex flex-col justify-end gap-3 rounded-2xl p-8 text-white md:col-span-2 md:row-span-2"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              <Users size={28} />
              <h3 className="text-xl font-semibold">Corretores à disposição</h3>
              <p className="max-w-md text-sm text-white/85">
                Fale direto com quem conhece cada imóvel, sem intermediários e sem espera.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <ShieldCheck size={24} style={{ color: primaryColor }} />
              <h3 className="font-semibold text-gray-900">Dados verificados</h3>
              <p className="text-sm text-gray-500">
                Cada anúncio passa por conferência antes de ir ao ar.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <RefreshCw size={24} style={{ color: primaryColor }} />
              <h3 className="font-semibold text-gray-900">Novidades toda semana</h3>
              <p className="text-sm text-gray-500">
                Imóveis novos publicados com frequência, direto no seu filtro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como funciona ─────────────────────────────────────────────────────── */}
      <section className="w-full bg-zinc-50 px-4 py-16 md:px-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col gap-3 px-6 py-8 first:pt-0 md:py-0">
              <span className="text-4xl font-light" style={{ color: primaryColor }}>
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Highlighted properties ────────────────────────────────────────── */}
      <section className="flex w-full flex-col items-center gap-10 bg-white px-4 py-16">
        <div className="text-center">
          <p className="mb-1 flex items-center justify-center gap-2 text-sm font-semibold tracking-widest text-gray-400 uppercase">
            <Building2 size={14} /> Seleção especial
          </p>
          <h2 className="text-3xl font-bold text-(--primary-color,#17375F)">Imóveis em Destaque</h2>
        </div>
        <HighlightedPropertiesGrid
          agencyId={agencyId}
          cta={
            <Link
              href="/imoveis"
              className="mt-4 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 motion-safe:active:scale-[0.97]"
              style={{ backgroundColor: primaryColor }}
            >
              <Search size={16} /> Ver todos os imóveis
            </Link>
          }
        />
      </section>

      <SiteFooter />
    </main>
  )
}
