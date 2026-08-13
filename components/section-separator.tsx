import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface SectionSeparatorProps {
  title?: string
  icon?: LucideIcon
  className?: string
}

export function SectionSeparator({ title, icon: Icon, className }: SectionSeparatorProps) {
  return (
    <div className={cn('my-8 flex w-full items-center gap-4', className)}>
      {/* Linha da Esquerda */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />

      {/* Conteúdo Central (Ícone ou Texto) */}
      {(title || Icon) && (
        <div className="flex items-center gap-2 px-2 text-sm font-semibold tracking-wider text-[#17375F] uppercase">
          {Icon && <Icon size={16} className="text-[#17375F]" />}
          {title && <span>{title}</span>}
        </div>
      )}

      {/* Se não tiver conteúdo, põe um losango decorativo no meio */}
      {!title && !Icon && <div className="h-2 w-2 rotate-45 bg-gray-300" />}

      {/* Linha da Direita */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-300 via-gray-300 to-transparent" />
    </div>
  )
}
