import { Suspense } from 'react'
import { Metadata } from 'next'
// import { MenubarHome } from '../components/MenubarHome' // Certifique-se de migrar este também
import Footer from '@/components/footer'
import { PropertyList } from '@/components/property-list'
import { PropertyFilter } from '@/components/property-filter'
import square from '@/public/square.svg'
import { MenubarHome } from '@/components/menu-home'

export const metadata: Metadata = {
  title: 'Auros Corretora Imobiliária | Imóveis',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br/imoveis',
  },
  openGraph: {
    images: ['https://www.aurosimobiliaria.com.br/logo.png'],
  },
}

export default function ImoveisPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-30 md:opacity-100"
        style={{
          backgroundImage: `url(${square.src})`,
          backgroundPosition: '110% 0%, -10% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto'
        }}
      />

      <div className="relative z-10 w-full flex-1 flex flex-col">
        <MenubarHome />

        <div className="w-full max-w-[1200px] mx-auto p-4 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#333]">
            {/* O título dinâmico (X Imóveis encontrados) movemos para a lista para evitar prop drilling */}
            Buscar Imóveis
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Sidebar de Filtro */}
            <div className="md:col-span-1 w-full">
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                <PropertyFilter />
              </Suspense>
            </div>

            {/* Lista de Imóveis */}
            <div className="md:col-span-3 w-full">
              <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Skeletons de loading inicial */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>}>
                <PropertyList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}