'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Menu, X } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

function SocialLink({
  href,
  children,
  ariaLabel,
}: {
  href: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={ariaLabel}
      className="text-white transition-colors hover:text-gray-300"
    >
      {children}
    </Link>
  )
}

interface HeroNavProps {
  logoUrl?: string | null
}

export function HeroNav({ logoUrl }: HeroNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMenu = () => setIsMobileMenuOpen(false)

  const logoSrc = logoUrl ?? './logo-auros-minimalist.svg'

  return (
    <>
      <div className="relative z-50 mx-auto flex w-full max-w-[1200px] items-center justify-between py-4">
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Auros Logo"
            width={120}
            height={120}
            className="h-16 w-16 object-contain md:h-32 md:w-32"
          />
        </Link>

        <button className="z-50 p-2 text-white md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>

        <nav className="flex hidden items-end gap-2 font-medium text-white md:flex">
          <div className="flex gap-4">
            <SocialLink
              href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá"
              ariaLabel="WhatsApp da Auros Imobiliária"
            >
              <WhatsappLogo size={20} />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/auroscorretoraimobiliaria/"
              ariaLabel="Instagram da Auros Imobiliária"
            >
              <Instagram size={16} />
            </SocialLink>
            <SocialLink
              href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR"
              ariaLabel="Facebook da Auros Imobiliária"
            >
              <Facebook size={16} />
            </SocialLink>
          </div>
          <div className="flex gap-6">
            <Link href="/imoveis" className="transition-colors hover:text-gray-200 hover:underline">
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              className="transition-colors hover:text-gray-200 hover:underline"
            >
              Quem somos
            </Link>
            <Link href="#contact" className="transition-colors hover:text-gray-200 hover:underline">
              Entre em contato
            </Link>
          </div>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="animate-in fade-in slide-in-from-right fixed inset-0 z-[999] flex flex-col bg-[#17375F] duration-300">
          <div className="flex items-center justify-between p-8">
            <Link href="/" onClick={closeMenu}>
              <Image
                src={logoSrc}
                alt="Auros Logo"
                width={100}
                height={100}
                className="h-16 w-16 object-contain"
              />
            </Link>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 p-2 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-start justify-start gap-10 px-5">
            <Link
              href="/imoveis"
              onClick={closeMenu}
              className="w-full border-b border-white/10 pb-2 text-lg font-light text-white transition-colors hover:text-gray-300"
            >
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              onClick={closeMenu}
              className="w-full border-b border-white/10 pb-2 text-lg font-light text-white transition-colors hover:text-gray-300"
            >
              Quem somos
            </Link>
            <Link
              href="#contact"
              onClick={closeMenu}
              className="w-full border-b border-white/10 pb-2 text-lg font-light text-white transition-colors hover:text-gray-300"
            >
              Entre em contato
            </Link>
          </div>

          <div className="flex justify-center gap-8 border-t border-white/10 p-10">
            <SocialLink
              href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá"
              ariaLabel="WhatsApp da Auros Imobiliária"
            >
              <WhatsappLogo size={25} />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/auroscorretoraimobiliaria/"
              ariaLabel="Instagram da Auros Imobiliária"
            >
              <Instagram size={25} />
            </SocialLink>
            <SocialLink
              href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR"
              ariaLabel="Facebook da Auros Imobiliária"
            >
              <Facebook size={25} />
            </SocialLink>
          </div>
        </div>
      )}
    </>
  )
}
