"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { usePlanFeature } from '@/hooks/use-plan-feature'
import {
  Home,
  Tag,
  LogOut,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
  UserRound,
  Building,
  Users,
  CreditCard,
  Building2,
  Settings,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import logo from '@/public/logo-auros.svg'

export function Menubar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const isSuperAdmin = userRole === 'SUPER_ADMIN'
  const isOwnerOrAdmin = userRole === 'OWNER' || isSuperAdmin
  const isRealtor = userRole === 'REALTOR'
  const hasEnterprises = usePlanFeature('enterprises')

  const toggleMenu = () => setIsExpanded(!isExpanded)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col justify-between py-6 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <button
        onClick={toggleMenu}
        className="absolute -right-3 top-9 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-[#17375F] shadow-sm z-50 transition-colors"
      >
        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="flex flex-col gap-6 w-full">
        <div className={cn(
          "flex items-center px-4 h-12 transition-all duration-300",
          isExpanded ? "justify-start gap-3" : "justify-center"
        )}>
          <Link href="/admin" className='flex items-center justify-center gap-2 hover:opacity-70'>
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src={logo}
                alt="Logo Auros"
                fill
                className="object-contain"
              />
            </div>


            <div className={cn(
              "overflow-hidden transition-all duration-300 whitespace-nowrap",
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}>
              <span className="font-bold text-[#17375F] text-lg">Auros Imob</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col px-3">
          <NavItem
            href="/admin/imoveis"
            icon={Home}
            label="Imóveis"
            isActive={pathname === '/admin/imoveis'}
            className="border-t border-muted"
            isExpanded={isExpanded}
          />
          {!isRealtor && (
            <>
              <NavItem
                href="/admin/tipo-imovel"
                icon={Tag}
                label="Tipos de Imóvel"
                isActive={pathname === '/admin/tipo-imovel'}
                className="border-t border-muted"
                isExpanded={isExpanded}
              />
              <NavItem
                href="/admin/corretores"
                icon={UserRound}
                label="Corretores"
                isActive={pathname === '/admin/corretores'}
                className="border-t border-muted"
                isExpanded={isExpanded}
              />
              {hasEnterprises && (
                <NavItem
                  href="/admin/empreendimentos"
                  icon={Building}
                  label="Empreendimentos"
                  isActive={pathname === '/admin/empreendimentos'}
                  className="border-t border-muted"
                  isExpanded={isExpanded}
                />
              )}
              <NavItem
                href="/admin/usuarios"
                icon={Users}
                label="Usuários"
                isActive={pathname === '/admin/usuarios'}
                className="border-t border-muted"
                isExpanded={isExpanded}
              />
            </>
          )}
          {isOwnerOrAdmin && (
            <NavItem
              href="/admin/configuracoes"
              icon={Settings}
              label="Configurações"
              isActive={pathname === '/admin/configuracoes'}
              className="border-t border-muted"
              isExpanded={isExpanded}
            />
          )}

          {isSuperAdmin && (
            <>
              <div className="my-2 border-t border-gray-300" />
              <NavItem
                href="/admin/plans"
                icon={CreditCard}
                label="Planos"
                isActive={pathname === '/admin/plans'}
                isExpanded={isExpanded}
              />
              <NavItem
                href="/admin/agencies"
                icon={Building2}
                label="Imobiliárias"
                isActive={pathname === '/admin/agencies'}
                className="border-t border-muted"
                isExpanded={isExpanded}
              />
            </>
          )}
        </nav>
      </div>

      <div className="px-3 flex items-center justify-center">
        <NavItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          icon={LogOut}
          label="Sair do sistema"
          isExpanded={isExpanded}
          variant="danger"
          // Exemplo de uso: adicionando margem extra ou borda no logout
          className="mt-2 border-t border-muted"
        />
      </div>
    </aside>
  )
}

// --- ATUALIZAÇÃO AQUI ---

interface NavItemProps {
  href?: string
  icon: LucideIcon
  label: string
  isExpanded: boolean
  isActive?: boolean
  onClick?: () => void
  variant?: 'default' | 'danger'
  className?: string // 1. Adicionado na interface (opcional)
}

function NavItem({
  href,
  icon: Icon,
  label,
  isExpanded,
  isActive,
  onClick,
  variant = 'default',
  className // 2. Desestruturado aqui
}: NavItemProps) {

  const colorClass = variant === 'danger'
    ? "text-red-500 hover:text-red-700 hover:bg-red-50"
    : isActive
      ? "text-[#17375F] bg-blue-50 font-medium"
      : "text-gray-500 hover:text-[#17375F] hover:bg-gray-100"

  const content = (
    <Button
      variant="ghost"
      className={cn(
        "w-full flex items-center justify-center transition-all duration-300 relative group h-12 cursor-pointer border-muted ",
        isExpanded ? "justify-start px-4" : "justify-center px-0",
        colorClass,
        className // 3. Aplicado no final para permitir sobrescrita
      )}
      onClick={onClick}
    >
      <Icon size={24} className="shrink-0" />

      <span className={cn(
        "whitespace-nowrap overflow-hidden transition-all duration-300 ml-3",
        isExpanded ? "w-auto opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 absolute"
      )}>
        {label}
      </span>
    </Button>
  )

  if (isExpanded) return href ? <Link href={href} className="w-full">{content}</Link> : content

  const wrappedContent = href ? <Link href={href} className="w-full">{content}</Link> : content

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {wrappedContent}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}