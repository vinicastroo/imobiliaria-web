"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Menu, X } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

function SocialLink({ href, children, ariaLabel }: { href: string, children: React.ReactNode, ariaLabel?: string }) {
  return (
    <Link href={href} target="_blank" aria-label={ariaLabel} className="text-white hover:text-gray-300 transition-colors">
      {children}
    </Link>
  )
}

interface HeroNavProps {
  logoUrl?: string | null
  primaryColor?: string
  secondaryColor?: string
}

export function HeroNav({ logoUrl, primaryColor, secondaryColor }: HeroNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMenu = () => setIsMobileMenuOpen(false)

  const logoSrc = logoUrl ?? './logo-gilli.svg'

  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center py-4 z-50 relative">
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Imóveis Gilli Logo"
            width={120}
            height={120}
            className="w-16 h-16 md:w-32 md:h-32 object-contain"
          />
        </Link>

        <button
          className="md:hidden text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        <nav className="hidden md:flex flex items-end gap-2 text-white font-medium">
          <div className="flex gap-4">
            <SocialLink href="https://api.whatsapp.com/send?phone=55XXXXXXXXXXX&&text=Olá" ariaLabel="WhatsApp da Imóveis Gilli">
              <WhatsappLogo size={20} />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/imoveisgilli/" ariaLabel="Instagram da Imóveis Gilli">
              <Instagram size={16} />
            </SocialLink>
          </div>
          <div className="flex gap-6">
            <Link href="/imoveis" className="hover:underline hover:text-gray-200 transition-colors">Imóveis</Link>
            <Link href="#contact" className="hover:underline hover:text-gray-200 transition-colors">Entre em contato</Link>
          </div>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col animate-in fade-in slide-in-from-right duration-300" style={{ backgroundColor: primaryColor }}>

          <div className="flex justify-between items-center p-8">
            <Link href="/" onClick={closeMenu}>
              <Image
                src={logoSrc}
                alt="Imóveis Gilli Logo"
                width={100}
                height={100}
                className="w-16 h-16 object-contain"
              />
            </Link>
            <button onClick={closeMenu} className="text-white p-2 flex justify-center items-center gap-2">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-start justify-start gap-10 px-5">
            <Link
              href="/imoveis"
              onClick={closeMenu}
              className="text-white text-lg font-light hover:text-gray-300 transition-colors border-b w-full pb-2 border-white/10"
            >
              Imóveis
            </Link>
            <Link
              href="#contact"
              onClick={closeMenu}
              className="text-white text-lg font-light hover:text-gray-300 transition-colors border-b w-full pb-2 border-white/10"
            >
              Entre em contato
            </Link>
          </div>

          <div className="p-10 flex justify-center gap-8 border-t border-white/10">
            <SocialLink href="https://api.whatsapp.com/send?phone=55XXXXXXXXXXX&&text=Olá" ariaLabel="WhatsApp da Imóveis Gilli">
              <WhatsappLogo size={25} />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/imoveisgilli/" ariaLabel="Instagram da Imóveis Gilli">
              <Instagram size={25} />
            </SocialLink>
          </div>
        </div>
      )}
    </>
  )
}
