import { FileText, ArrowUpRight, DollarSign, FileSearchCorner, Workflow } from 'lucide-react';

const RentJourney = () => {
  const steps = [
    {
      icon: <FileSearchCorner className="w-6 h-6 text-blue-950" />,
      title: "Análise de Perfil",
      description: "Analisamos suas necessidades, objetivos e orçamento para encontrar o imóvel ideal."
    },
    {
      icon: <Workflow className="w-6 h-6 text-blue-950" />,
      title: "Acompanhamento em Cada Etapa",
      description: "Estamos ao seu lado desde a escolha até a entrega das chaves, com total transparência."
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-950" />,
      title: "Cuidando de Toda a Burocracia",
      description: "Organizamos contratos, documentos e processos para você ter tranquilidade.",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-blue-950" />,
      title: "Garantindo o Melhor Negócio",
      description: "Negociamos as melhores condições para que você faça um investimento seguro."
    }
  ];

  return (
    <section className="max-w-6xl mx-auto py-10 font-sans bg-white flex justify-center">
      <div className="flex flex-col md:flex-row w-full justify-between gap-8 lg:0">

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="border border-blue-950/90 text-blue-950/90 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Jornada Simplificada
            </span>
            <h2 className="text-4xl font-semibold text-blue-950 leading-tight mt-2">
              Como te ajudamos a alcançar seu sonho?
            </h2>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#032550] via-transparent to-transparent opacity-60"></div>
            <img
              src="/journey.jpg"
              alt="Casal feliz na cozinha"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Lado Direito: Passos */}
        <div className="flex-1 space-y-10 h-full flex flex-col justify-end items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6  h-full  ">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#17375F]">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  {step.description}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RentJourney;