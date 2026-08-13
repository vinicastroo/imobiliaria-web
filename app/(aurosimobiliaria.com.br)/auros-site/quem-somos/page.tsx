import { Metadata } from 'next'
import Image from 'next/image'
import { Target, Telescope, Heart, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quem Somos | Auros Corretora Imobiliária',
  description:
    'Conheça a história, missão e equipe da Auros Corretora Imobiliária. Tradição familiar com mais de 25 anos e presença em Rio do Sul e Balneário Camboriú.',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br/quem-somos',
  },
  openGraph: {
    title: 'Quem Somos | Auros Corretora Imobiliária',
    description:
      'Conheça a história, missão e equipe da Auros Corretora Imobiliária. Tradição familiar com mais de 25 anos.',
    url: 'https://aurosimobiliaria.com.br/quem-somos',
    type: 'website',
    images: [
      {
        url: 'https://aurosimobiliaria.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Auros Corretora Imobiliária',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quem Somos | Auros Corretora Imobiliária',
    description: 'Conheça a história, missão e equipe da Auros Corretora Imobiliária.',
    images: ['https://aurosimobiliaria.com.br/logo.png'],
  },
}

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Quem Somos - Auros Corretora Imobiliária',
  url: 'https://aurosimobiliaria.com.br/quem-somos',
  description:
    'Conheça a história, missão e equipe da Auros Corretora Imobiliária. Fundada em 2023 em Rio do Sul, SC.',
  mainEntity: {
    '@type': 'RealEstateAgent',
    name: 'Auros Corretora Imobiliária',
    foundingDate: '2023-02-07',
    url: 'https://aurosimobiliaria.com.br',
  },
}

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Footer from '../_components/footer'
import { MenubarHome } from '@/components/menu-home'
// Importe o novo componente cliente
import { TeamCarousel } from '@/components/team-carousel'
import { HistoryCarousel } from '@/components/history-carousel'
import Link from 'next/link'

export default function QuemSomosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <MenubarHome />
      <div className="min-h-screen bg-white font-sans">
        <section className="relative overflow-hidden bg-[#17375F] py-10 text-white">
          <div className="relative z-10 container mx-auto space-y-4 px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Nossa História</h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100 md:text-xl">
              Tradição familiar, visão de futuro e compromisso com o seu sonho.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-6 text-sm leading-relaxed text-gray-600">
                <h2 className="mb-6 text-3xl font-bold text-[#17375F]">
                  A origem de um sonho familiar
                </h2>
                <p>
                  A <strong>Auros</strong> é resultado de uma trajetória construída com trabalho,
                  dedicação e espírito empreendedor. Nossa história tem origem com o casal{' '}
                  <strong>Renato e Adriana Niehues</strong>, que há mais de 25 anos mantém o
                  Restaurante Nascente como referência em Rio do Sul, sempre pautado pelo
                  atendimento próximo, pela qualidade e pela confiança.
                </p>

                <p>
                  Em 2016, o filho mais velho, <strong>Jonathan Niehues</strong>, iniciou sua
                  trajetória no mercado imobiliário ao se tornar corretor e se mudar para Balneário
                  Camboriú, adquirindo experiência, conhecimento e visão estratégica no setor. Sua
                  caminhada profissional tornou-se uma importante inspiração para toda a família.
                </p>

                <p>
                  Em 2020, impulsionados pelos desafios da pandemia e pela necessidade de
                  diversificar as fontes de renda, a família identificou no mercado imobiliário uma
                  oportunidade de crescimento sólido. A partir dessa visão, nasceu o projeto de
                  criar uma imobiliária familiar, baseada nos mesmos valores que sempre guiaram seus
                  negócios.
                </p>

                <p>
                  Assim, em 07 de fevereiro de 2023, foi fundada a Auros, em Rio do Sul – Santa
                  Catarina, com o propósito de oferecer um atendimento transparente e de excelência.
                  Com uma base sólida, parcerias confiáveis e uma equipe comprometida, a empresa
                  consolidou sua atuação e, em 20 de dezembro de 2024, expandiu para Balneário
                  Camboriú, fortalecendo ainda mais sua presença no mercado do Litoral Norte.
                </p>

                <div className="rounded-r-md border-l-4 border-[#17375F] bg-gray-50 py-4 pr-4 pl-4 text-gray-700 italic">
                  &quot;Hoje, a Auros segue crescendo de forma estruturada, unindo tradição,
                  inovação e compromisso, mantendo viva a essência familiar que transforma cada
                  atendimento em uma relação de confiança e cada negócio em uma conquista
                  compartilhada.&quot;
                </div>
              </div>

              <div className="w-full">
                <HistoryCarousel />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center text-2xl font-bold text-[#17375F]">
              Marcos da Nossa Jornada
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="rounded-lg border-t-4 border-[#17375F] bg-white p-6 text-center shadow-sm">
                <span className="mb-2 block text-4xl font-bold text-yellow-500">2016</span>
                <h3 className="mb-2 font-bold text-[#17375F]">O Início</h3>
                <p className="text-sm text-gray-600">Jonathan inicia no mercado imobiliário.</p>
              </div>
              <div className="rounded-lg border-t-4 border-[#17375F] bg-white p-6 text-center shadow-sm">
                <span className="mb-2 block text-4xl font-bold text-yellow-500">2020</span>
                <h3 className="mb-2 font-bold text-[#17375F]">A Visão</h3>
                <p className="text-sm text-gray-600">Identificação da oportunidade imobiliária.</p>
              </div>
              <div className="rounded-lg border-t-4 border-[#17375F] bg-white p-6 text-center shadow-sm">
                <span className="mb-2 block text-4xl font-bold text-yellow-500">2023</span>
                <h3 className="mb-2 font-bold text-[#17375F]">Fundação</h3>
                <p className="text-sm text-gray-600">Fundação da Auros em Rio do Sul.</p>
              </div>
              <div className="rounded-lg border-t-4 border-[#17375F] bg-white p-6 text-center shadow-sm">
                <span className="mb-2 block text-4xl font-bold text-yellow-500">2024</span>
                <h3 className="mb-2 font-bold text-[#17375F]">Expansão</h3>
                <p className="text-sm text-gray-600">Chegada a Balneário Camboriú.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-[#17375F]">Nossa Essência</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="border-none shadow-lg">
                <CardContent className="flex h-full flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#17375F]/10">
                    <Target size={32} className="text-[#17375F]" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-[#17375F]">Missão</h3>
                  <p className="text-sm text-gray-600">
                    Oferecer uma experiência imobiliária acolhedora, transparente e personalizada,
                    guiando cada cliente com dedicação e ética. Trabalhamos para transformar o sonho
                    de um lar em realidade, garantindo um atendimento humano, cuidadoso e de
                    excelência em todas as etapas do processo.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none bg-[#17375F] text-white shadow-lg">
                <CardContent className="flex h-full flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <Telescope size={32} className="text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">Visão</h3>
                  <p className="text-sm text-blue-100">
                    Ser referência no mercado imobiliário de Santa Catarina pela confiança,
                    qualidade e relacionamento próximo com nossos clientes. Buscamos crescer de
                    forma responsável, expandindo nossa presença e mantendo sempre o compromisso
                    familiar que nos diferencia.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardContent className="flex h-full flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#17375F]/10">
                    <Heart size={32} className="text-[#17375F]" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-[#17375F]">Valores</h3>
                  <p className="text-sm text-gray-600">
                    Na Auros, atuamos com transparência, ética e responsabilidade, construindo
                    relações de confiança e respeito. Valorizamos o acolhimento e o atendimento
                    humanizado, compreendendo as reais necessidades de cada cliente. Com
                    compromisso, união e integridade, buscamos excelência sem abrir mão dos
                    princípios familiares que nos guiam.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-[#17375F]">Quem Faz Acontecer</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-500">
                Conheça os profissionais dedicados que trabalham diariamente para encontrar o imóvel
                perfeito para você.
              </p>
            </div>
            <TeamCarousel />
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden py-32">
          <Image
            src="https://images.unsplash.com/photo-1475503572774-15a45e5d60b9"
            alt="Background CTA"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#17375F]/65 mix-blend-multiply"></div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Pronto para viver o extraordinário?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-100">
              Do investimento seguro ao lar dos sonhos, nossa expertise está à sua disposição.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="cursor-pointer bg-white px-8 py-6 font-semibold text-[#17375F] hover:bg-gray-100"
                asChild
              >
                <Link href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá, gostaria de mais informações sobre os imóveis disponíveis.">
                  <Phone className="mr-2" />
                  Fale com um especialista
                </Link>
              </Button>
              <Button
                variant="link"
                className="cursor-pointer py-6 text-base text-white decoration-white hover:text-blue-200"
              >
                <Link href="/imoveis">Explorar Catálogo</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
