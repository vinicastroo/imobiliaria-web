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
  Layers,
  LogOut,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
  UserRound,
  Building,
  Users,
  UserCheck,
  CreditCard,
  Building2,
  Settings,
  ContactRound,
} from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { NotificationsBell } from '@/components/notifications-bell'

import staticLogo from '@/public/logo-auros.svg'

const ROLE_LABELS: Record<string, string> = {
  OWNER:       'Proprietário',
  MANAGER:     'Gerente',
  REALTOR:     'Corretor',
  SUPER_ADMIN: 'Super Admin',
}

interface MenubarProps {
  logoUrl?: string | null
}

export function Menubar({ logoUrl }: MenubarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname      = usePathname()
  const { data: session } = useSession()

  const userRole         = session?.user?.role ?? ''
  const userName         = session?.user?.name ?? ''
  const isSuperAdmin     = userRole === 'SUPER_ADMIN'
  const isSuperAdminPanel = isSuperAdmin && !session?.user?.agencyId
  const isOwnerOrAdmin   = userRole === 'OWNER' || isSuperAdmin
  const isRealtor        = userRole === 'REALTOR'
  const hasEnterprises   = usePlanFeature('enterprises')
  const hasClients       = usePlanFeature('clients')

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-primary z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl",
        isExpanded ? "w-60" : "w-[72px]",
      )}
    >
      {/* Expand / collapse toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(v => !v)}
        className="absolute -right-3 top-8 h-6 w-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-primary shadow-sm z-50 transition-colors"
        aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
      >
        {isExpanded ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>

      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div className={cn(
        "flex items-center gap-3 py-5 shrink-0 border-b border-white/10",
        isExpanded ? "px-4" : "justify-center px-0",
      )}>
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Image src={staticLogo} alt="Logo" fill className="object-contain" />
            )}
          </div>
          <span className={cn(
            "font-semibold text-white text-base whitespace-nowrap transition-all duration-300 overflow-hidden",
            isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0",
          )}>
            Backoffice
          </span>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-0.5">

        {/* Super admin — platform routes */}
        {isSuperAdmin && (
          <>
            <SectionLabel label="Plataforma" isExpanded={isExpanded} />
            <NavItem href="/admin/agencies" icon={Building2} label="Imobiliárias"
              isActive={pathname === '/admin/agencies'} isExpanded={isExpanded} />
            <NavItem href="/admin/plans" icon={CreditCard} label="Planos"
              isActive={pathname === '/admin/plans'} isExpanded={isExpanded} />
          </>
        )}

        {/* Tenant routes */}
        {!isSuperAdminPanel && (
          <>
            <SectionLabel label="Gestão" isExpanded={isExpanded} />

            <NavItem href="/admin/imoveis" icon={Home} label="Imóveis"
              isActive={pathname === '/admin/imoveis'} isExpanded={isExpanded} />

            {hasClients && (
              <NavItem href="/admin/crm" icon={ContactRound} label="CRM"
                isActive={pathname.startsWith('/admin/crm')} isExpanded={isExpanded} badge="Beta" />
            )}

            {!isRealtor && (
              <>
                <NavItem href="/admin/corretores" icon={UserRound} label="Corretores"
                  isActive={pathname === '/admin/corretores'} isExpanded={isExpanded} />

                {hasClients && (
                  <NavItem href="/admin/clientes" icon={UserCheck} label="Clientes"
                    isActive={pathname === '/admin/clientes'} isExpanded={isExpanded} />
                )}

                {hasEnterprises && (
                  <NavItem href="/admin/empreendimentos" icon={Building} label="Empreendimentos"
                    isActive={pathname === '/admin/empreendimentos'} isExpanded={isExpanded} />
                )}

                <SectionLabel label="Cadastros" isExpanded={isExpanded} />

                <NavItem href="/admin/tipo-imovel" icon={Tag} label="Tipos de Imóvel"
                  isActive={pathname === '/admin/tipo-imovel'} isExpanded={isExpanded} />

                <NavItem href="/admin/infraestruturas" icon={Layers} label="Infraestrutura"
                  isActive={pathname === '/admin/infraestruturas'} isExpanded={isExpanded} />

                <NavItem href="/admin/usuarios" icon={Users} label="Usuários"
                  isActive={pathname === '/admin/usuarios'} isExpanded={isExpanded} />
              </>
            )}

            {isOwnerOrAdmin && (
              <>
                <SectionLabel label="Sistema" isExpanded={isExpanded} />
                <NavItem href="/admin/configuracoes" icon={Settings} label="Configurações"
                  isActive={pathname === '/admin/configuracoes'} isExpanded={isExpanded} />
              </>
            )}
          </>
        )}
        </div>

        <NotificationsBell isExpanded={isExpanded} />
      </nav>

      {/* ── User info + sign out ─────────────────────────────────────── */}
      <div className="shrink-0 px-3 pb-4 pt-3 border-t border-white/10 flex flex-col gap-1">
        {/* User info */}
        <div className={cn(
          "flex items-center py-2 rounded-lg",
          isExpanded ? "gap-3 px-2" : "justify-center px-0",
        )}>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 ring-2 ring-white/10">
            <span className="text-[11px] font-bold text-white leading-none">{initials}</span>
          </div>
          <div className={cn(
            "overflow-hidden transition-all duration-300 min-w-0",
            isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0",
          )}>
            <p className="text-sm font-medium text-white leading-tight truncate">{userName}</p>
            <p className="text-xs text-white/50 leading-tight">{ROLE_LABELS[userRole] ?? userRole}</p>
          </div>
        </div>

        <NavItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          icon={LogOut}
          label="Sair"
          isExpanded={isExpanded}
          variant="danger"
        />
      </div>
    </aside>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ label, isExpanded }: { label: string; isExpanded: boolean }) {
  if (isExpanded) {
    return (
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 px-2 pt-4 pb-1 select-none">
        {label}
      </p>
    )
  }
  return <div className="my-2 mx-2 border-t border-white/10" />
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  href?:      string
  icon:       LucideIcon
  label:      string
  isExpanded: boolean
  isActive?:  boolean
  onClick?:   () => void
  variant?:   'default' | 'danger'
  badge?:     string
}

function NavItem({ href, icon: Icon, label, isExpanded, isActive, onClick, variant = 'default', badge }: NavItemProps) {
  const itemClass = cn(
    "flex items-center rounded-lg h-10 w-full text-sm transition-all duration-150 select-none",
    isExpanded ? "gap-3 px-3" : "justify-center px-0",
    variant === 'danger'
      ? "text-white/40 hover:text-red-300 hover:bg-red-500/20 cursor-pointer"
      : isActive
        ? "bg-white/15 text-white font-medium shadow-sm"
        : "text-white/65 hover:text-white hover:bg-white/10 cursor-pointer",
  )

  const labelEl = (
    <span className={cn(
      "whitespace-nowrap transition-all duration-300 overflow-hidden flex items-center gap-2",
      isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0",
    )}>
      {label}
      {badge && (
        <span className="text-[10px] font-semibold bg-amber-400/25 text-amber-300 px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </span>
  )

  const element = href ? (
    <Link href={href} className={itemClass}>
      <Icon size={18} className="shrink-0" />
      {labelEl}
    </Link>
  ) : (
    <button type="button" className={itemClass} onClick={onClick}>
      <Icon size={18} className="shrink-0" />
      {labelEl}
    </button>
  )

  if (isExpanded) return element

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
