'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { motion } from 'motion/react'
import {
  Home,
  Tag,
  Layers,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
  UserRound,
  Building,
  Users,
  UserCheck,
  CreditCard,
  Building2,
  Settings,
  ContactRound,
  Inbox,
  LayoutDashboard,
} from 'lucide-react'

import { usePlanFeature } from '@/hooks/use-plan-feature'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { NotificationsBell } from '@/components/notifications-bell'
import { DURATION, EASE } from '@/components/motion'

import scalaLogo from '@/public/brand/scala-logo.svg'
import scalaMark from '@/public/brand/scala-mark.svg'

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Proprietário',
  MANAGER: 'Gerente',
  REALTOR: 'Corretor',
  SUPER_ADMIN: 'Super Admin',
}

export interface MenubarProps {
  /** Ícone da imobiliária (VisualConfig.iconUrl). */
  tenantLogoUrl?: string | null
  /** Nome da imobiliária; null no painel de plataforma (super admin). */
  tenantName?: string | null
  /** Cor da imobiliária: fundo do ícone (os ícones costumam ser brancos). */
  tenantColor?: string | null
  isExpanded: boolean
  onToggle?: () => void
  /** Na gaveta do celular o menu é sempre expandido e não tem botão de recolher. */
  variant?: 'desktop' | 'drawer'
  onNavigate?: () => void
}

type NavDef = {
  href: string
  icon: LucideIcon
  label: string
  match?: 'exact' | 'prefix'
  badge?: string
  show: boolean
}

export function Menubar({
  tenantLogoUrl,
  tenantName,
  tenantColor,
  isExpanded,
  onToggle,
  variant = 'desktop',
  onNavigate,
}: MenubarProps) {
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

  const groups: Array<{ label: string; items: NavDef[] }> = [
    {
      label: 'Plataforma',
      items: [
        { href: '/admin/agencies', icon: Building2, label: 'Imobiliárias', show: isSuperAdmin },
        { href: '/admin/plans', icon: CreditCard, label: 'Planos', show: isSuperAdmin },
        { href: '/admin/demo-requests', icon: Inbox, label: 'Pedidos de demo', show: isSuperAdmin },
      ],
    },
    {
      label: 'Gestão',
      items: [
        { href: '/admin', icon: LayoutDashboard, label: 'Início', show: !isSuperAdminPanel },
        { href: '/admin/imoveis', icon: Home, label: 'Imóveis', show: !isSuperAdminPanel },
        {
          href: '/admin/crm',
          icon: ContactRound,
          label: 'CRM',
          match: 'prefix',
          badge: 'Beta',
          show: !isSuperAdminPanel && hasClients,
        },
        {
          href: '/admin/corretores',
          icon: UserRound,
          label: 'Corretores',
          show: !isSuperAdminPanel && !isRealtor,
        },
        {
          href: '/admin/clientes',
          icon: UserCheck,
          label: 'Clientes',
          show: !isSuperAdminPanel && !isRealtor && hasClients,
        },
        {
          href: '/admin/empreendimentos',
          icon: Building,
          label: 'Empreendimentos',
          show: !isSuperAdminPanel && !isRealtor && hasEnterprises,
        },
      ],
    },
    {
      label: 'Cadastros',
      items: [
        {
          href: '/admin/tipo-imovel',
          icon: Tag,
          label: 'Tipos de imóvel',
          show: !isSuperAdminPanel && !isRealtor,
        },
        {
          href: '/admin/infraestruturas',
          icon: Layers,
          label: 'Infraestrutura',
          show: !isSuperAdminPanel && !isRealtor,
        },
        {
          href: '/admin/usuarios',
          icon: Users,
          label: 'Usuários',
          show: !isSuperAdminPanel && !isRealtor,
        },
      ],
    },
    {
      label: 'Sistema',
      items: [
        {
          href: '/admin/configuracoes',
          icon: Settings,
          label: 'Configurações',
          show: !isSuperAdminPanel && isOwnerOrAdmin,
        },
      ],
    },
  ]

  const isActive = (item: NavDef) =>
    item.match === 'prefix' ? pathname.startsWith(item.href) : pathname === item.href

  return (
    <aside
      aria-label="Menu do painel"
      className={cn(
        'flex h-full flex-col border-r border-[var(--scala-border)] bg-white',
        variant === 'desktop' && 'transition-[width] duration-300 ease-[cubic-bezier(.2,0,0,1)]',
        variant === 'desktop' ? (isExpanded ? 'w-[248px]' : 'w-[72px]') : 'w-[280px]',
      )}
    >
      {/* ── Logo + recolher ─────────────────────────────────────────── */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center',
          isExpanded ? 'justify-between px-4' : 'justify-center px-0',
        )}
      >
        <Link
          href="/admin"
          aria-label="Scala — início"
          onClick={onNavigate}
          className="flex items-center"
        >
          {isExpanded ? (
            <Image src={scalaLogo} alt="Scala" className="h-6 w-auto" priority />
          ) : (
            <Image src={scalaMark} alt="Scala" className="h-6 w-auto" priority />
          )}
        </Link>
        {variant === 'desktop' && isExpanded && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Recolher menu"
            className="flex size-8 items-center justify-center rounded-lg text-[var(--scala-muted)] transition-colors hover:bg-[#141a220d] hover:text-[var(--scala-ink)]"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {/* ── Imobiliária ─────────────────────────────────────────────── */}
      {tenantName && (
        <div className={cn('shrink-0 pb-3', isExpanded ? 'px-3' : 'flex justify-center px-0')}>
          <div
            title={tenantName}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border border-[var(--scala-border)] bg-[var(--scala-paper)]',
              isExpanded ? 'px-2.5 py-2' : 'p-1.5',
            )}
          >
            <div
              className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--scala-night)] p-0.5"
              style={tenantColor ? { backgroundColor: tenantColor } : undefined}
            >
              {tenantLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tenantLogoUrl} alt="" className="h-full w-full object-contain" />
              ) : (
                <span className="text-[11px] font-bold text-white">
                  {tenantName.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[var(--scala-ink)]">
                  {tenantName}
                </p>
                <p className="text-[11px] text-[var(--scala-muted)]">Imobiliária</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Navegação ───────────────────────────────────────────────── */}
      <nav className="thin-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-3">
        {groups.map((group) => {
          const visible = group.items.filter((i) => i.show)
          if (!visible.length) return null
          return (
            <div key={group.label} className="flex flex-col gap-0.5">
              {isExpanded ? (
                <p className="px-3 pt-4 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-[var(--scala-muted)] uppercase select-none">
                  {group.label}
                </p>
              ) : (
                <div className="mx-auto my-2.5 h-px w-6 bg-[var(--scala-border)]" />
              )}
              {visible.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                  isActive={isActive(item)}
                  isExpanded={isExpanded}
                  layoutGroup={variant}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )
        })}
      </nav>

      {/* ── Rodapé: notificações, usuário, sair ─────────────────────── */}
      <div className="flex shrink-0 flex-col gap-1 border-t border-[var(--scala-border)] p-3">
        <NotificationsBell isExpanded={isExpanded} />

        {variant === 'desktop' && !isExpanded && (
          <WithTooltip label="Expandir menu" show>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expandir menu"
              className="flex h-9 w-full items-center justify-center rounded-lg text-[var(--scala-muted)] transition-colors hover:bg-[#141a220d] hover:text-[var(--scala-ink)]"
            >
              <PanelLeftOpen className="size-[18px]" />
            </button>
          </WithTooltip>
        )}

        <div
          className={cn(
            'mt-1 flex items-center rounded-xl',
            isExpanded ? 'gap-2.5 bg-[var(--scala-paper)] px-2.5 py-2' : 'flex-col gap-1',
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--scala-royal-soft)] text-[11px] font-semibold text-[var(--scala-royal)]">
            {initials || '·'}
          </span>
          {isExpanded && (
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[13px] font-medium text-[var(--scala-ink)]"
                title={userName}
              >
                {userName}
              </p>
              <p className="text-[11px] text-[var(--scala-muted)]">
                {ROLE_LABELS[userRole] ?? userRole}
              </p>
            </div>
          )}
          <WithTooltip label="Sair" show={!isExpanded}>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              aria-label="Sair"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--scala-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" />
            </button>
          </WithTooltip>
        </div>
      </div>
    </aside>
  )
}

// ─── Item de navegação ────────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  isExpanded,
  isActive,
  badge,
  layoutGroup,
  onNavigate,
}: {
  href: string
  icon: LucideIcon
  label: string
  isExpanded: boolean
  isActive: boolean
  badge?: string
  layoutGroup: string
  onNavigate?: () => void
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative flex h-9 w-full items-center rounded-lg text-sm transition-colors duration-150 select-none',
        isExpanded ? 'gap-3 px-3' : 'justify-center px-0',
        isActive
          ? 'bg-[var(--scala-royal-soft)] font-medium text-[var(--scala-royal)]'
          : 'text-[var(--scala-muted)] hover:bg-[#141a2208] hover:text-[var(--scala-ink)]',
      )}
    >
      {isActive && (
        <motion.span
          layoutId={`nav-indicator-${layoutGroup}`}
          className="absolute top-1.5 bottom-1.5 -left-3 w-[3px] rounded-r-full bg-[var(--scala-royal)]"
          transition={{ duration: DURATION.medium, ease: EASE }}
        />
      )}
      <Icon size={18} className="shrink-0" />
      {isExpanded && (
        <span className="flex min-w-0 items-center gap-2 truncate">
          {label}
          {badge && (
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-amber-800">
              {badge}
            </span>
          )}
        </span>
      )}
    </Link>
  )

  return (
    <WithTooltip label={label} show={!isExpanded}>
      {link}
    </WithTooltip>
  )
}

function WithTooltip({
  label,
  show,
  children,
}: {
  label: string
  show: boolean
  children: React.ReactElement
}) {
  if (!show) return children
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
