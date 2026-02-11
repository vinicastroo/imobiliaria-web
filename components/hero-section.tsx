import Image from 'next/image'
import { HeroNav } from '@/components/hero-nav'
import { HeroSearchForm } from '@/components/hero-search-form'

export function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col p-4 z-10 overflow-hidden">
      {/* Background Image - renderizado no HTML inicial (Server Component) */}
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

      <HeroNav />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-[1200px] mx-auto text-center z-10 px-2 md:px-0">
        <h1 className="text-white text-2xl md:text-5xl font-light drop-shadow-lg leading-tight">
          Assim como o ouro é valioso, <br className="hidden md:block" /> seu novo lar será um tesouro inestimável
        </h1>

        <HeroSearchForm />
      </div>
    </section>
  )
}
