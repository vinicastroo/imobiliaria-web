'use client'

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

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { NotificationsBell } from '@/components/notifications-bell'

import staticLogo from '@/public/logo-auros.svg'

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Proprietário',
  MANAGER: 'Gerente',
  REALTOR: 'Corretor',
  SUPER_ADMIN: 'Super Admin',
}

interface MenubarProps {
  logoUrl?: string | null
}

export function Menubar({ logoUrl }: MenubarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const userRole = session?.user?.role ?? ''
  const userName = session?.user?.name ?? ''
  const isSuperAdmin = userRole === 'SUPER_ADMIN'
  const isSuperAdminPanel = isSuperAdmin && !session?.user?.agencyId
  const isOwnerOrAdmin = userRole === 'OWNER' || isSuperAdmin
  const isRealtor = userRole === 'REALTOR'
  const hasEnterprises = usePlanFeature('enterprises')
  const hasClients = usePlanFeature('clients')

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <aside
      className={cn(
        'bg-primary fixed top-0 left-0 z-50 flex h-screen flex-col shadow-xl transition-all duration-300 ease-in-out',
        isExpanded ? 'w-60' : 'w-[72px]',
      )}
    >
      {/* Expand / collapse toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="hover:text-primary absolute top-8 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors"
        aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
      >
        {isExpanded ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>

      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex shrink-0 items-center gap-3 border-b border-white/10 py-5',
          isExpanded ? 'px-4' : 'justify-center px-0',
        )}
      >
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          <div className="relative h-9 w-9 shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <Image src={staticLogo} alt="Logo" fill className="object-contain" />
            )}
          </div>
          <span
            className={cn(
              'overflow-hidden text-base font-semibold whitespace-nowrap text-white transition-all duration-300',
              isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0',
            )}
          >
            Backoffice
          </span>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="flex flex-1 flex-col justify-between gap-4 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-0.5">
          {/* Super admin — platform routes */}
          {isSuperAdmin && (
            <>
              <SectionLabel label="Plataforma" isExpanded={isExpanded} />
              <NavItem
                href="/admin/agencies"
                icon={Building2}
                label="Imobiliárias"
                isActive={pathname === '/admin/agencies'}
                isExpanded={isExpanded}
              />
              <NavItem
                href="/admin/plans"
                icon={CreditCard}
                label="Planos"
                isActive={pathname === '/admin/plans'}
                isExpanded={isExpanded}
              />
            </>
          )}

          {/* Tenant routes */}
          {!isSuperAdminPanel && (
            <>
              <SectionLabel label="Gestão" isExpanded={isExpanded} />

              <NavItem
                href="/admin/imoveis"
                icon={Home}
                label="Imóveis"
                isActive={pathname === '/admin/imoveis'}
                isExpanded={isExpanded}
              />

              {hasClients && (
                <NavItem
                  href="/admin/crm"
                  icon={ContactRound}
                  label="CRM"
                  isActive={pathname.startsWith('/admin/crm')}
                  isExpanded={isExpanded}
                  badge="Beta"
                />
              )}

              {!isRealtor && (
                <>
                  <NavItem
                    href="/admin/corretores"
                    icon={UserRound}
                    label="Corretores"
                    isActive={pathname === '/admin/corretores'}
                    isExpanded={isExpanded}
                  />

                  {hasClients && (
                    <NavItem
                      href="/admin/clientes"
                      icon={UserCheck}
                      label="Clientes"
                      isActive={pathname === '/admin/clientes'}
                      isExpanded={isExpanded}
                    />
                  )}

                  {hasEnterprises && (
                    <NavItem
                      href="/admin/empreendimentos"
                      icon={Building}
                      label="Empreendimentos"
                      isActive={pathname === '/admin/empreendimentos'}
                      isExpanded={isExpanded}
                    />
                  )}

                  <SectionLabel label="Cadastros" isExpanded={isExpanded} />

                  <NavItem
                    href="/admin/tipo-imovel"
                    icon={Tag}
                    label="Tipos de Imóvel"
                    isActive={pathname === '/admin/tipo-imovel'}
                    isExpanded={isExpanded}
                  />

                  <NavItem
                    href="/admin/infraestruturas"
                    icon={Layers}
                    label="Infraestrutura"
                    isActive={pathname === '/admin/infraestruturas'}
                    isExpanded={isExpanded}
                  />

                  <NavItem
                    href="/admin/usuarios"
                    icon={Users}
                    label="Usuários"
                    isActive={pathname === '/admin/usuarios'}
                    isExpanded={isExpanded}
                  />
                </>
              )}

              {isOwnerOrAdmin && (
                <>
                  <SectionLabel label="Sistema" isExpanded={isExpanded} />
                  <NavItem
                    href="/admin/configuracoes"
                    icon={Settings}
                    label="Configurações"
                    isActive={pathname === '/admin/configuracoes'}
                    isExpanded={isExpanded}
                  />
                </>
              )}
            </>
          )}
        </div>

        <NotificationsBell isExpanded={isExpanded} />
      </nav>

      {/* ── User info + sign out ─────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-1 border-t border-white/10 px-3 pt-3 pb-4">
        {/* User info */}
        <div
          className={cn(
            'flex items-center rounded-lg py-2',
            isExpanded ? 'gap-3 px-2' : 'justify-center px-0',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/10">
            <span className="text-[11px] leading-none font-bold text-white">{initials}</span>
          </div>
          <div
            className={cn(
              'min-w-0 overflow-hidden transition-all duration-300',
              isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0',
            )}
          >
            <p className="truncate text-sm leading-tight font-medium text-white">{userName}</p>
            <p className="text-xs leading-tight text-white/50">
              {ROLE_LABELS[userRole] ?? userRole}
            </p>
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
      <p className="px-2 pt-4 pb-1 text-[10px] font-semibold tracking-widest text-white/35 uppercase select-none">
        {label}
      </p>
    )
  }
  return <div className="mx-2 my-2 border-t border-white/10" />
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  href?: string
  icon: LucideIcon
  label: string
  isExpanded: boolean
  isActive?: boolean
  onClick?: () => void
  variant?: 'default' | 'danger'
  badge?: string
}

function NavItem({
  href,
  icon: Icon,
  label,
  isExpanded,
  isActive,
  onClick,
  variant = 'default',
  badge,
}: NavItemProps) {
  const itemClass = cn(
    'flex items-center rounded-lg h-10 w-full text-sm transition-all duration-150 select-none',
    isExpanded ? 'gap-3 px-3' : 'justify-center px-0',
    variant === 'danger'
      ? 'text-white/40 hover:text-red-300 hover:bg-red-500/20 cursor-pointer'
      : isActive
        ? 'bg-white/15 text-white font-medium shadow-sm'
        : 'text-white/65 hover:text-white hover:bg-white/10 cursor-pointer',
  )

  const labelEl = (
    <span
      className={cn(
        'flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300',
        isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0',
      )}
    >
      {label}
      {badge && (
        <span className="rounded-full bg-amber-400/25 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-amber-300">
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
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
