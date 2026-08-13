import Image from 'next/image'
import { HeroNav } from './hero-nav'
import { HeroSearchForm } from '@/components/hero-search-form'
import { getTenantVisualConfig } from '@/lib/visual-config'

export async function HeroSection() {
  const { logoUrl, primaryColor } = await getTenantVisualConfig()

  return (
    <section className="relative z-10 flex h-screen w-full flex-col overflow-hidden p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt="Vista aérea de imóveis em Rio do Sul e Balneário Camboriú"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <HeroNav logoUrl={logoUrl} />

      <div className="z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-8 px-2 text-center md:px-0">
        <h1 className="text-2xl leading-tight font-light text-white drop-shadow-lg md:text-5xl">
          Assim como o ouro é valioso, <br className="hidden md:block" /> seu novo lar será um
          tesouro inestimável
        </h1>

        <HeroSearchForm primaryColor={primaryColor} />
      </div>
    </section>
  )
}
