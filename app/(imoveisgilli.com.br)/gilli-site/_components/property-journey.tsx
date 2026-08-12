import Image from 'next/image'
import { MapPin, CalendarCheck, FileCheck, Handshake } from 'lucide-react'

import cityView from '@/public/background-gilli.jpg'

const steps = [
  {
    icon: <MapPin className="w-6 h-6 text-[#EE9020]" />,
    title: 'Conhecimento local de verdade',
    description: 'Atuamos aqui e conhecemos cada bairro: te orientamos sobre localização, valorização e vizinhança.',
  },
  {
    icon: <CalendarCheck className="w-6 h-6 text-[#EE9020]" />,
    title: 'Visitas do seu jeito',
    description: 'Agendamos conforme a sua rotina e acompanhamos você em cada imóvel, sem pressa e sem pressão.',
  },
  {
    icon: <FileCheck className="w-6 h-6 text-[#EE9020]" />,
    title: 'Documentação descomplicada',
    description: 'Cuidamos de contratos, certidões e financiamento para você assinar com total segurança.',
  },
  {
    icon: <Handshake className="w-6 h-6 text-[#EE9020]" />,
    title: 'Negociação transparente',
    description: 'Defendemos o melhor acordo para você, com clareza em todas as condições do início ao fim.',
  },
]

export function PropertyJourney() {
  return (
    <section className="max-w-6xl mx-auto py-10 font-sans bg-white flex justify-center">
      <div className="flex flex-col md:flex-row w-full justify-between gap-8">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="border border-[#EE9020] text-[#EE9020] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Atendimento Gilli
            </span>
            <h2 className="text-4xl font-semibold text-[#0F172A] leading-tight mt-2">
              Seu próximo endereço, com quem conhece a cidade
            </h2>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
            <Image
              src={cityView}
              alt="Vista da cidade com a igreja matriz e a serra ao fundo"
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Lado direito: passos */}
        <div className="flex-1 space-y-10 h-full flex flex-col justify-end items-center">
          {steps.map((step) => (
            <div key={step.title} className="flex gap-6 h-full">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#0F172A]">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
