import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Peças padrão das telas do painel Scala. Toda tela usa:
 *   <AdminPage>
 *     <PageHeader title description actions />
 *     ...conteúdo...
 *   </AdminPage>
 * Telas do menu não têm "Voltar" (o menu já navega). Subtelas (criar/editar)
 * mostram o caminho em `breadcrumb`.
 */

export function AdminPage({
  children,
  className,
  width = 'default',
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  width?: 'default' | 'wide' | 'narrow'
}) {
  return (
    <div
      {...rest}
      className={cn(
        'mx-auto w-full px-4 py-6 md:px-8 md:py-8',
        width === 'default' && 'max-w-[1200px]',
        width === 'wide' && 'max-w-[1440px]',
        width === 'narrow' && 'max-w-[880px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  badge,
  className,
}: {
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  breadcrumb?: Array<{ href?: string; label: string }>
  badge?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('mb-6 flex flex-col gap-3 md:mb-8', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav
          aria-label="Caminho"
          className="text-muted-foreground flex items-center gap-1.5 text-sm"
        >
          {breadcrumb.map((item, i) => (
            <span key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 opacity-60" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--scala-ink)]">
            {title}
            {badge}
          </h1>
          {description && <p className="text-muted-foreground mt-1 text-[15px]">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

/** Contêiner padrão de lista/tabela: cartão branco com barra de ferramentas opcional. */
export function DataCard({
  children,
  toolbar,
  footer,
  className,
}: {
  children: React.ReactNode
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--scala-border)] bg-white shadow-[0_1px_2px_#0d11170a]',
        className,
      )}
    >
      {toolbar && (
        <div className="flex flex-col gap-3 border-b border-[var(--scala-border)] p-3 sm:flex-row sm:items-center sm:justify-between">
          {toolbar}
        </div>
      )}
      {children}
      {footer && <div className="border-t border-[var(--scala-border)] px-4 py-3">{footer}</div>}
    </section>
  )
}

/** Seção de formulário: título, descrição e conteúdo, num cartão. */
export function FormSection({
  id,
  title,
  description,
  children,
  className,
  aside,
}: {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  aside?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 rounded-xl border border-[var(--scala-border)] bg-white p-5 shadow-[0_1px_2px_#0d11170a] md:p-6',
        className,
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--scala-ink)]">{title}</h2>
          {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}
