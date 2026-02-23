import Image from 'next/image'
import { HeroNav } from './hero-nav'
import { HeroSearchForm } from '@/components/hero-search-form'
import { getTenantVisualConfig } from '@/lib/visual-config'

export async function HeroSection() {
  const { logoUrl, primaryColor, secondaryColor } = await getTenantVisualConfig()

  return (
    <section className="relative w-full h-screen flex flex-col p-4 z-10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background-gilli.jpg"
          alt="Imóveis Gilli"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <HeroNav logoUrl={logoUrl} primaryColor={primaryColor} secondaryColor={secondaryColor} />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-[1200px] mx-auto text-center z-10 px-2 md:px-0">
        <h1 className="text-white text-2xl md:text-5xl font-light drop-shadow-lg leading-tight">
          Encontre o imóvel ideal <br className="hidden md:block" /> com quem entende do mercado
        </h1>

        <HeroSearchForm primaryColor={primaryColor} />
      </div>
    </section>
  )
}
