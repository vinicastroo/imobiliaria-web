'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Menu as MenuIcon, X } from 'lucide-react'

import { Menubar } from '@/components/menu'
import { DURATION, EASE, MotionProvider } from '@/components/motion'
import scalaLogo from '@/public/brand/scala-logo.svg'

import { SIDEBAR_COOKIE } from '@/lib/sidebar'

interface AdminShellProps {
  children: React.ReactNode
  tenantLogoUrl?: string | null
  tenantName?: string | null
  tenantColor?: string | null
  /** Lido do cookie no servidor, para não piscar ao carregar. */
  initialExpanded: boolean
}

/**
 * Estrutura do painel: menu lateral que empurra o conteúdo (desktop, estado
 * salvo em cookie), gaveta no celular e transição suave entre páginas.
 */
export function AdminShell({ children, initialExpanded, ...tenant }: AdminShellProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  const toggle = () => {
    setExpanded((v) => {
      const next = !v
      document.cookie = `${SIDEBAR_COOKIE}=${next ? 'expanded' : 'collapsed'}; path=/; max-age=31536000; samesite=lax`
      return next
    })
  }

  // Esc fecha a gaveta
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <MotionProvider>
      <div className="min-h-screen bg-[var(--scala-paper)]">
        {/* Desktop: menu fixo que empurra o conteúdo */}
        <div
          className={`fixed inset-y-0 left-0 z-40 hidden lg:block ${expanded ? 'w-[248px]' : 'w-[72px]'}`}
        >
          <Menubar {...tenant} isExpanded={expanded} onToggle={toggle} />
        </div>

        {/* Celular: barra superior + gaveta */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--scala-border)] bg-white/90 px-4 backdrop-blur lg:hidden">
          <Image src={scalaLogo} alt="Scala" className="h-6 w-auto" />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
            className="flex size-9 items-center justify-center rounded-lg text-[var(--scala-ink)] hover:bg-[#141a220d]"
          >
            <MenuIcon className="size-5" />
          </button>
        </header>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 z-50 bg-[#0d111766] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Menu do painel"
                className="fixed inset-y-0 left-0 z-50 shadow-[0_16px_40px_#0d11172e] lg:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: DURATION.medium, ease: EASE }}
              >
                <Menubar
                  {...tenant}
                  isExpanded
                  variant="drawer"
                  onNavigate={() => setDrawerOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar menu"
                  className="absolute top-4 -right-12 flex size-9 items-center justify-center rounded-full bg-white text-[var(--scala-ink)] shadow"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main
          className={`transition-[padding] duration-300 ease-[cubic-bezier(.2,0,0,1)] ${
            expanded ? 'lg:pl-[248px]' : 'lg:pl-[72px]'
          }`}
        >
          {/* Transição entre páginas: entra com fade + leve subida */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.medium, ease: EASE }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </MotionProvider>
  )
}
