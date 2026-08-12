import Image from 'next/image'
import { MapPin, CalendarCheck, FileCheck, Handshake } from 'lucide-react'

import journeyImage from '@/public/gilli-secao.png'

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
    <section className="max-w-6xl mx-auto py-10 px-4 font-sans bg-white">
      <div className="mx-auto max-w-2xl text-center space-y-4">
        <span className="inline-block border border-[#EE9020] text-[#EE9020] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Atendimento Gilli
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#0F172A] leading-tight">
          Seu próximo endereço, com quem conhece a cidade
        </h2>
      </div>

      <div className="relative mt-10 aspect-[16/7] w-full overflow-hidden rounded-2xl shadow-xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#EE9020]/70 via-transparent to-transparent" />
        <Image
          src={journeyImage}
          alt="Corretor caminhando com um casal por uma rua da região de Aurora"
          placeholder="blur"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex flex-col items-start gap-3 rounded-2xl border border-[#EE9020]/20 bg-orange-50/40 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EE9020]/10">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">{step.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
