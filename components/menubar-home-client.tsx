'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Menu, X } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

export interface SocialLinks {
  whatsappUrl?: string
  instagramUrl?: string
  facebookUrl?: string
}

interface MenubarHomeClientProps {
  logoUrl: string | null
  primaryColor?: string
  socialLinks?: SocialLinks
}

const AUROS_SOCIAL: SocialLinks = {
  whatsappUrl: 'https://api.whatsapp.com/send?phone=5547988163739&text=Ol%C3%A1',
  instagramUrl: 'https://www.instagram.com/auroscorretoraimobiliaria/',
  facebookUrl: 'https://www.facebook.com/AurosCorretoraImob?locale=pt_BR',
}

export function MenubarHomeClient({ logoUrl, primaryColor, socialLinks }: MenubarHomeClientProps) {
  const { whatsappUrl, instagramUrl, facebookUrl } = socialLinks ?? AUROS_SOCIAL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const logoEl = (
    <Image
      src={logoUrl ?? '/logo-default.svg'}
      alt="Logo"
      width={120}
      height={120}
      className="h-16 w-16 object-contain md:h-[120px] md:w-[120px]"
      priority
      unoptimized
    />
  )

  const bgStyle = { backgroundColor: primaryColor ?? '#17375F' }

  return (
    <header className="relative z-50 flex w-full items-center justify-center" style={bgStyle}>
      <div className="flex w-full max-w-[1200px] items-center justify-between p-4">
        {/* --- LOGO --- */}
        <Link href="/">{logoEl}</Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="flex hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-3">
            <SocialLink href={whatsappUrl} aria="WhatsApp">
              <WhatsappLogo size={20} />
            </SocialLink>
            <SocialLink href={instagramUrl} aria="Instagram">
              <Instagram size={16} />
            </SocialLink>
            {facebookUrl && (
              <SocialLink href={facebookUrl} aria="Facebook">
                <Facebook size={16} />
              </SocialLink>
            )}
          </div>

          <div className="flex items-center gap-6 text-base font-medium text-white">
            <NavLink href="/imoveis">Imóveis</NavLink>
            <NavLink href="/quem-somos">Quem somos</NavLink>
            <NavLink href="/#contact">Entre em contato</NavLink>
          </div>
        </nav>

        {/* --- BOTÃO HAMBÚRGUER --- */}
        <button
          className="p-2 text-white focus:outline-none md:hidden"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* --- MENU MOBILE FULL SCREEN --- */}
      {isMobileMenuOpen && (
        <div
          className="animate-in fade-in slide-in-from-right fixed inset-0 z-[9999] flex flex-col duration-300"
          style={bgStyle}
        >
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between p-4">
            <Link href="/" onClick={toggleMenu}>
              {logoEl}
            </Link>
            <button
              className="flex items-center justify-center gap-2 p-2 text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-start justify-start gap-8 px-4">
            <Link
              href="/imoveis"
              className="w-full border-b border-white/10 pb-4 text-lg font-light text-white transition-colors hover:text-gray-300"
              onClick={toggleMenu}
            >
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              className="w-full border-b border-white/10 pb-4 text-lg font-light text-white transition-colors hover:text-gray-300"
              onClick={toggleMenu}
            >
              Quem somos
            </Link>
            <Link
              href="/#contact"
              className="w-full border-b border-white/10 pb-4 text-lg font-light text-white transition-colors hover:text-gray-300"
              onClick={toggleMenu}
            >
              Entre em contato
            </Link>
          </div>

          <div className="mx-8 flex justify-center gap-8 border-t border-white/10 p-10">
            <SocialLink href={whatsappUrl} aria="WhatsApp">
              <WhatsappLogo size={24} />
            </SocialLink>
            <SocialLink href={instagramUrl} aria="Instagram">
              <Instagram size={24} />
            </SocialLink>
            {facebookUrl && (
              <SocialLink href={facebookUrl} aria="Facebook">
                <Facebook size={24} />
              </SocialLink>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function SocialLink({
  href,
  aria,
  children,
}: {
  href: string
  aria: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={aria}
      className="p-1 text-white transition-colors hover:text-gray-300"
    >
      {children}
    </Link>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-white transition-opacity hover:underline hover:opacity-80">
      {children}
    </Link>
  )
}
