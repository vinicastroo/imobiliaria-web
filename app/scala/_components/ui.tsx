import { cn } from '@/lib/utils'
import { Reveal } from '@/components/motion'

/** Faixa hachurada (referência Valeti) — decorativa. */
export function Hatch({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-[repeating-linear-gradient(135deg,var(--scala-border)_0_1px,transparent_1px_9px)]',
        className,
      )}
    />
  )
}

/** Selo em pílula acima dos títulos (Valeti/Arco). */
export function Eyebrow({
  icon: Icon,
  children,
}: {
  icon?: React.ElementType
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--scala-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--scala-ink)] shadow-[0_1px_2px_#0d11170a]">
      {Icon && <Icon className="size-3.5 text-[var(--scala-royal)]" strokeWidth={2} />}
      {children}
    </span>
  )
}

export function SectionHead({
  icon,
  eyebrow,
  title,
  text,
  align = 'center',
}: {
  icon?: React.ElementType
  eyebrow: string
  title: string
  text?: string
  align?: 'center' | 'left'
}) {
  return (
    <Reveal
      className={cn(
        'mb-12 flex max-w-2xl flex-col gap-4',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start',
      )}
    >
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance text-[var(--scala-ink)] sm:text-[42px] sm:leading-[1.1]">
        {title}
      </h2>
      {text && (
        <p className="text-[17px] leading-relaxed text-pretty text-[var(--scala-muted)]">{text}</p>
      )}
    </Reveal>
  )
}

export function PrimaryButton({
  href,
  children,
  className,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'inverse'
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-[15px] font-semibold transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(.2,0,0,1)] active:scale-[0.98]',
        variant === 'primary' &&
          'bg-[var(--scala-royal)] text-white shadow-[0_6px_16px_#1f4fd133] hover:bg-[var(--scala-royal-hover)]',
        variant === 'secondary' &&
          'border border-[var(--scala-border)] bg-white text-[var(--scala-ink)] hover:border-[#141a223d]',
        variant === 'inverse' && 'bg-white text-[var(--scala-royal)] hover:bg-white/90',
        className,
      )}
    >
      {children}
    </a>
  )
}
