import Image from 'next/image'
import { FileText, ArrowUpRight, DollarSign, FileSearchCorner, Workflow } from 'lucide-react'

import journeyImage from '@/public/auros-secao.png'

const RentJourney = () => {
  const steps = [
    {
      icon: <FileSearchCorner className="h-6 w-6 text-blue-950" />,
      title: 'Análise de Perfil',
      description:
        'Analisamos suas necessidades, objetivos e orçamento para encontrar o imóvel ideal.',
    },
    {
      icon: <Workflow className="h-6 w-6 text-blue-950" />,
      title: 'Acompanhamento em Cada Etapa',
      description:
        'Estamos ao seu lado desde a escolha até a entrega das chaves, com total transparência.',
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-950" />,
      title: 'Cuidando de Toda a Burocracia',
      description: 'Organizamos contratos, documentos e processos para você ter tranquilidade.',
    },
    {
      icon: <DollarSign className="h-6 w-6 text-blue-950" />,
      title: 'Garantindo o Melhor Negócio',
      description: 'Negociamos as melhores condições para que você faça um investimento seguro.',
    },
  ]

  return (
    <section className="mx-auto flex max-w-6xl justify-center bg-white py-10 font-sans">
      <div className="lg:0 flex w-full flex-col justify-between gap-8 md:flex-row">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="rounded-full border border-blue-950/90 px-3 py-1 text-xs font-bold tracking-wider text-blue-950/90 uppercase">
              Jornada Simplificada
            </span>
            <h2 className="mt-2 text-4xl leading-tight font-semibold text-blue-950">
              Como te ajudamos a alcançar seu sonho?
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-950 via-transparent to-transparent opacity-60"></div>
            <Image
              src={journeyImage}
              alt="Casal se mudando para o novo apartamento com vista para o mar"
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Lado Direito: Passos */}
        <div className="flex h-full flex-1 flex-col items-center justify-end space-y-10">
          {steps.map((step, index) => (
            <div key={index} className="flex h-full gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#17375F]">{step.title}</h3>
                <p className="max-w-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RentJourney
