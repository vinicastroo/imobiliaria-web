'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Facebook, Instagram, Menu, X } from 'lucide-react'
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

/** Retorna preto ou branco, o que tiver mais contraste contra a cor de fundo informada. */
function getContrastTextColor(hex: string): string {
  const match = /^#?([\da-f]{6})$/i.exec(hex)
  if (!match) return '#ffffff'
  const value = parseInt(match[1], 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#111827' : '#ffffff'
}

export function MenubarHomeClient({ logoUrl, primaryColor, socialLinks }: MenubarHomeClientProps) {
  const { whatsappUrl, instagramUrl, facebookUrl } = socialLinks ?? {}
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const bgColor = primaryColor ?? '#17375F'
  const textColor = getContrastTextColor(bgColor)
  const bgStyle = { backgroundColor: bgColor }

  const logoEl = logoUrl ? (
    <Image
      src={logoUrl}
      alt="Logo"
      width={120}
      height={120}
      className="h-16 w-16 object-contain md:h-[120px] md:w-[120px]"
      priority
      unoptimized
    />
  ) : (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-lg md:h-[120px] md:w-[120px]"
      style={{ backgroundColor: `${textColor}1a` }}
    >
      <Building2 className="h-1/2 w-1/2" style={{ color: textColor }} />
    </div>
  )

  return (
    <header className="relative z-50 flex w-full items-center justify-center" style={bgStyle}>
      <div className="flex w-full max-w-[1200px] items-center justify-between p-4">
        {/* --- LOGO --- */}
        <Link href="/">{logoEl}</Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="flex hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-3">
            {whatsappUrl && (
              <SocialLink href={whatsappUrl} aria="WhatsApp" color={textColor}>
                <WhatsappLogo size={20} />
              </SocialLink>
            )}
            {instagramUrl && (
              <SocialLink href={instagramUrl} aria="Instagram" color={textColor}>
                <Instagram size={16} />
              </SocialLink>
            )}
            {facebookUrl && (
              <SocialLink href={facebookUrl} aria="Facebook" color={textColor}>
                <Facebook size={16} />
              </SocialLink>
            )}
          </div>

          <div
            className="flex items-center gap-6 text-base font-medium"
            style={{ color: textColor }}
          >
            <NavLink href="/imoveis">Imóveis</NavLink>
            <NavLink href="/quem-somos">Quem somos</NavLink>
            <NavLink href="/#contact">Entre em contato</NavLink>
          </div>
        </nav>

        {/* --- BOTÃO HAMBÚRGUER --- */}
        <button
          className="p-2 focus:outline-none md:hidden"
          style={{ color: textColor }}
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
              className="flex items-center justify-center gap-2 p-2 focus:outline-none"
              style={{ color: textColor }}
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-start justify-start gap-8 px-4">
            <Link
              href="/imoveis"
              className="w-full border-b border-white/10 pb-4 text-lg font-light opacity-100 transition-opacity hover:opacity-70"
              style={{ color: textColor }}
              onClick={toggleMenu}
            >
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              className="w-full border-b border-white/10 pb-4 text-lg font-light opacity-100 transition-opacity hover:opacity-70"
              style={{ color: textColor }}
              onClick={toggleMenu}
            >
              Quem somos
            </Link>
            <Link
              href="/#contact"
              className="w-full border-b border-white/10 pb-4 text-lg font-light opacity-100 transition-opacity hover:opacity-70"
              style={{ color: textColor }}
              onClick={toggleMenu}
            >
              Entre em contato
            </Link>
          </div>

          <div className="mx-8 flex justify-center gap-8 border-t border-white/10 p-10">
            {whatsappUrl && (
              <SocialLink href={whatsappUrl} aria="WhatsApp" color={textColor}>
                <WhatsappLogo size={24} />
              </SocialLink>
            )}
            {instagramUrl && (
              <SocialLink href={instagramUrl} aria="Instagram" color={textColor}>
                <Instagram size={24} />
              </SocialLink>
            )}
            {facebookUrl && (
              <SocialLink href={facebookUrl} aria="Facebook" color={textColor}>
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
  color,
  children,
}: {
  href: string
  aria: string
  color: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={aria}
      className="p-1 transition-opacity hover:opacity-70"
      style={{ color }}
    >
      {children}
    </Link>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="transition-opacity hover:underline hover:opacity-80">
      {children}
    </Link>
  )
}
