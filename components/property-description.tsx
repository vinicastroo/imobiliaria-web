"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PropertyDescriptionProps {
  description: string
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Verifica se o texto é curto (opcional, para não mostrar botão se for pequeno)
  const isShortText = description.length < 500

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[#17375F] uppercase">Sobre o imóvel</h3>

      <div
        className={cn(
          "relative overflow-hidden transition-all duration-500 ease-in-out",
          // Se não estiver expandido e não for curto, limita a altura
          !isExpanded && !isShortText ? "max-h-[250px]" : "max-h-full"
        )}
      >
        <div
          className="prose prose-slate max-w-none
            prose-headings:text-[#17375F] prose-headings:font-bold
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-strong:text-[#17375F]
            prose-ul:list-disc prose-ul:pl-5
            prose-li:marker:text-[#17375F] prose-li:text-gray-600
            [&_li_p]:m-0 [&_li]:mb-1
            [&_p:empty]:hidden" // Remove parágrafos vazios que vêm do editor
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Gradiente para suavizar o corte quando fechado */}
        {!isExpanded && !isShortText && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {!isShortText && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#17375F] hover:text-[#17375F]/80 hover:bg-transparent p-0 font-semibold h-auto flex items-center gap-2"
        >
          {isExpanded ? (
            <>Ler menos <ChevronUp size={16} /></>
          ) : (
            <>Ler descrição completa <ChevronDown size={16} /></>
          )}
        </Button>
      )}
    </div>
  )
}