import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SectionSeparatorProps {
  title?: string
  icon?: LucideIcon
  className?: string
}

export function SectionSeparator({ title, icon: Icon, className }: SectionSeparatorProps) {
  return (
    <div className={cn("flex items-center gap-4 my-8 w-full", className)}>
      {/* Linha da Esquerda */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-gray-300 flex-1" />

      {/* Conteúdo Central (Ícone ou Texto) */}
      {(title || Icon) && (
        <div className="flex items-center gap-2 text-[#17375F] font-semibold uppercase tracking-wider text-sm px-2">
          {Icon && <Icon size={16} className="text-[#17375F]" />}
          {title && <span>{title}</span>}
        </div>
      )}

      {/* Se não tiver conteúdo, põe um losango decorativo no meio */}
      {!title && !Icon && (
        <div className="h-2 w-2 bg-gray-300 rotate-45" />
      )}

      {/* Linha da Direita */}
      <div className="h-[1px] bg-gradient-to-r from-gray-300 via-gray-300 to-transparent flex-1" />
    </div>
  )
}