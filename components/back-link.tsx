import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils' // Utilitário padrão do shadcn para mesclar classes

interface BackLinkProps {
  href?: string
  className?: string
}

export function BackLink({ href = '/', className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground hover:text-[#17375F] transition-colors w-fit mb-2",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="font-medium">Voltar</span>
    </Link>
  )
}