// REMOVA O "use client" DAQUI!
import Image from 'next/image'
import { Target, Telescope, Heart, CheckCircle2, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Footer from '@/components/footer'
import { MenubarHome } from '@/components/menu-home'
// Importe o novo componente cliente
import { TeamCarousel } from '@/components/team-carousel'
import { HistoryCarousel } from '@/components/history-carousel'
import Link from 'next/link'

export default function QuemSomosPage() {
  return (
    <>
      <MenubarHome />
      <div className="min-h-screen bg-white font-sans">

        <section className="bg-[#17375F] text-white py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Nossa História
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Tradição familiar, visão de futuro e compromisso com o seu sonho.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <h2 className="text-3xl font-bold text-[#17375F] mb-6">
                  A origem de um sonho familiar
                </h2>
                <p>
                  A <strong>Auros</strong> é resultado de uma trajetória construída com trabalho, dedicação e espírito empreendedor. Nossa história tem origem com o casal <strong>Renato e Adriana Niehues</strong>, que há mais de 25 anos mantém o Restaurante Nascente como referência em Rio do Sul.
                </p>
                <p>
                  Em 2016, o filho mais velho, <strong>Jonathan Niehues</strong>, iniciou sua trajetória no mercado imobiliário ao se tornar corretor e se mudar para Balneário Camboriú.
                </p>
                <p>
                  Em 2020, impulsionados pelos desafios da pandemia, nasceu o projeto de criar uma imobiliária familiar baseada nos mesmos valores que sempre guiaram seus negócios.
                </p>
                <div className="border-l-4 border-[#17375F] pl-4 italic text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-md">
                  &quot;Hoje, a Auros segue crescendo de forma estruturada, unindo tradição, inovação e compromisso.&quot;
                </div>
              </div>

              <div className="w-full">
                <HistoryCarousel />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold text-center text-[#17375F] mb-12">Marcos da Nossa Jornada</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#17375F] text-center">
                <span className="text-4xl font-bold text-yellow-500 block mb-2">2016</span>
                <h3 className="font-bold text-[#17375F] mb-2">O Início</h3>
                <p className="text-sm text-gray-600">Jonathan inicia no mercado imobiliário.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#17375F] text-center">
                <span className="text-4xl font-bold text-yellow-500 block mb-2">2020</span>
                <h3 className="font-bold text-[#17375F] mb-2">A Visão</h3>
                <p className="text-sm text-gray-600">Identificação da oportunidade imobiliária.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#17375F] text-center">
                <span className="text-4xl font-bold text-yellow-500 block mb-2">2023</span>
                <h3 className="font-bold text-[#17375F] mb-2">Fundação</h3>
                <p className="text-sm text-gray-600">Fundação da Auros em Rio do Sul.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#17375F] text-center">
                <span className="text-4xl font-bold text-yellow-500 block mb-2">2024</span>
                <h3 className="font-bold text-[#17375F] mb-2">Expansão</h3>
                <p className="text-sm text-gray-600">Chegada a Balneário Camboriú.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#17375F]">Nossa Essência</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg bg-[#17375F] text-white">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Target size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Missão</h3>
                  <p className="text-blue-100 text-sm">Oferecer uma experiência imobiliária acolhedora, transparente e personalizada.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-[#17375F]/10 rounded-full flex items-center justify-center mb-6">
                    <Telescope size={32} className="text-[#17375F]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#17375F] mb-4">Visão</h3>
                  <p className="text-gray-600 text-sm">Ser referência no mercado imobiliário pela confiança e qualidade.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-[#17375F]/10 rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-[#17375F]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#17375F] mb-4">Valores</h3>
                  <ul className="text-sm text-gray-600 space-y-2 text-left w-full">
                    <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#17375F] mt-0.5" /> Transparência e ética</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#17375F] mt-0.5" /> Atendimento humanizado</li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#17375F] mt-0.5" /> Compromisso e união</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#17375F]">Quem Faz Acontecer</h2>
              <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                Conheça os profissionais dedicados que trabalham diariamente para encontrar o imóvel perfeito para você.
              </p>
            </div>
            <TeamCarousel />
          </div>
        </section>

        <section className="relative py-32 flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1475503572774-15a45e5d60b9"
            alt="Background CTA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#17375F]/65 mix-blend-multiply "></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para viver o extraordinário?
            </h2>
            <p className="text-gray-100 text-lg max-w-xl mx-auto mb-8">
              Do investimento seguro ao lar dos sonhos, nossa expertise está à sua disposição.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="cursor-pointer bg-white text-[#17375F] hover:bg-gray-100 font-semibold py-6 px-8" asChild>
                <Link href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá, gostaria de mais informações sobre os imóveis disponíveis.">
                  <Phone className='mr-2' />
                  Fale com um especialista
                </Link>
              </Button>
              <Button variant="link" className="cursor-pointer text-white text-base hover:text-blue-200  py-6 decoration-white">
                <Link href="/imoveis">
                  Explorar Catálogo
                </Link>
              </Button>
            </div>
          </div>
        </section >
      </div >

      <Footer />
    </>
  )
}