"use client"

import Image from 'next/image'
import { Linkedin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const teamMembers = [
  {
    id: 1,
    name: "Renato Niehues",
    role: "Sócio Proprietário & Corretor Imobiliário",
    image: "/renato.png",
    bio: "Mais de 25 anos de experiência em gestão, garantindo segurança e confiança em cada negociação."
  },
  {
    id: 2,
    name: "Adriana Niehues",
    role: "Sócia Proprietária & Corretora Imobiliária",
    image: "/adriana.png",
    bio: "Referência em atendimento humanizado, tornando a experiência imobiliária acolhedora e familiar."
  },
  {
    id: 3,
    name: "Jonathan Niehues",
    role: "Sócio Proprietário & Corretor Imobiliário",
    image: "/jonathan.jpeg",
    bio: "Especialista no mercado de luxo e investimentos estratégicos no litoral catarinense desde 2016."
  },
  {
    id: 4,
    name: "Rodrigo Niehues",
    role: "Sócio Proprietário & Corretor Imobiliário",
    image: "/digo.jpg",
    bio: "Foco em inteligência de mercado para conectar clientes às melhores oportunidades."
  },
  {
    id: 5,
    name: "Laiza Heesch",
    role: "Sócia Proprietária & Gestora de Operações",
    image: "/laiza.png",
    bio: "Gestão eficiente que garante fluidez e excelência em todas as etapas operacionais."
  },
  {
    id: 6,
    name: "Rafaela Helena",
    role: "Arquiteta",
    image: "/rafaela.png",
    bio: "Olhar técnico e estético que revela o potencial dos imóveis e agrega valor aos projetos."
  },
  {
    id: 7,
    name: "Venâncio Schmöller",
    role: "Corretor Imobiliário &  avaliador imobiliário",
    image: "/venancio.jpeg",
    bio: "Dedicação e transparência para entender seus objetivos e realizar o sonho da casa própria."
  },
  {
    id: 8,
    name: "Michele Stahnke",
    role: "Corretora Imobiliária",
    image: "/michele.png",
    bio: "Consultoria personalizada e escuta ativa para guiar você com assertividade na escolha ideal."
  },
]
export function TeamCarousel() {
  return (
    <div className="p-5 ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {teamMembers.map((member) => (
            <CarouselItem key={member.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="h-full">
                <Card className="border shadow-none hover:shadow-xl transition-all duration-300 h-full group overflow-hidden">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative w-full h-80 overflow-hidden bg-gray-200">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* <div className="absolute inset-0 bg-[#17375F]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <Button size="icon" variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                          <Linkedin size={24} />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                          <Instagram size={24} />
                        </Button>
                      </div> */}
                    </div>

                    <div className="p-6 flex flex-col flex-1 text-center bg-white relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#17375F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      <h3 className="text-xl font-bold text-[#17375F]">{member.name}</h3>
                      <p className="text-xs font-medium text-gray-500 mb-4 mt-1 uppercase tracking-wider">{member.role}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex cursor-pointer -left-4 border-[#17375F] text-[#17375F] hover:bg-[#17375F] hover:text-white" />
        <CarouselNext className="hidden md:flex cursor-pointer -right-4 border-[#17375F] text-[#17375F] hover:bg-[#17375F] hover:text-white" />
      </Carousel>
    </div>
  )
}