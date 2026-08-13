import Image from 'next/image'
import { MapPin, CalendarCheck, FileCheck, Handshake } from 'lucide-react'

import journeyImage from '@/public/gilli-secao.png'

const steps = [
  {
    icon: <MapPin className="h-6 w-6 text-[#EE9020]" />,
    title: 'Conhecimento local de verdade',
    description:
      'Atuamos aqui e conhecemos cada bairro: te orientamos sobre localização, valorização e vizinhança.',
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-[#EE9020]" />,
    title: 'Visitas do seu jeito',
    description:
      'Agendamos conforme a sua rotina e acompanhamos você em cada imóvel, sem pressa e sem pressão.',
  },
  {
    icon: <FileCheck className="h-6 w-6 text-[#EE9020]" />,
    title: 'Documentação descomplicada',
    description:
      'Cuidamos de contratos, certidões e financiamento para você assinar com total segurança.',
  },
  {
    icon: <Handshake className="h-6 w-6 text-[#EE9020]" />,
    title: 'Negociação transparente',
    description:
      'Defendemos o melhor acordo para você, com clareza em todas as condições do início ao fim.',
  },
]

export function PropertyJourney() {
  return (
    <section className="mx-auto max-w-6xl bg-white px-4 py-10 font-sans">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <span className="inline-block rounded-full border border-[#EE9020] px-3 py-1 text-xs font-bold tracking-wider text-[#EE9020] uppercase">
          Atendimento Gilli
        </span>
        <h2 className="text-3xl leading-tight font-semibold text-[#0F172A] sm:text-4xl">
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
            <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
