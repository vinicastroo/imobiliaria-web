'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Menu, X } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

export function MenubarHome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="flex justify-center items-center bg-[#17375F] w-full relative z-50">
      <div className="w-full max-w-[1200px] flex justify-between items-center p-4">

        {/* --- LOGO --- */}
        <Link href="/">
          <Image
            src="/logo-auros-minimalist.svg"
            alt="Logo Auros"
            width={120}
            height={120}
            className="w-16 h-16 md:w-[120px] md:h-[120px] object-contain"
            priority
          />
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex flex items-end gap-3">
          {/* Ícones Sociais Desktop */}
          <div className="flex items-center gap-3">
            <SocialLink href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá" aria="WhatsApp">
              <WhatsappLogo size={20} />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/auroscorretoraimobiliaria/" aria="Instagram">
              <Instagram size={16} />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR" aria="Facebook">
              <Facebook size={16} />
            </SocialLink>
          </div>

          {/* Links de Texto Desktop */}
          <div className="flex items-center gap-6 text-white font-medium text-base">
            <NavLink href="/imoveis">Imóveis</NavLink>
            <NavLink href="/quem-somos">Quem somos</NavLink>
            <NavLink href="/#contact">Entre em contato</NavLink>
          </div>
        </nav>

        {/* --- BOTÃO HAMBÚRGUER (Abre o menu) --- */}
        <button
          className="md:hidden text-white p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* --- MENU MOBILE FULL SCREEN (Sobrepõe tudo) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#17375F] z-[9999] flex flex-col animate-in fade-in slide-in-from-right duration-300">

          <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center p-4">
            <Link href="/" onClick={toggleMenu}>
              <Image
                src="/logo-auros-minimalist.svg"
                alt="Logo Auros"
                width={120}
                height={120}
                className="w-16 h-16 object-contain"
                priority
              />
            </Link>
            <button
              className="text-white p-2 flex justify-center items-center gap-2 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Conteúdo Centralizado */}
          <div className="flex-1 flex flex-col items-start justify-start gap-8 px-4">
            <Link
              href="/imoveis"
              className="text-white text-lg border-b border-white/10 w-full pb-4 font-light hover:text-gray-300 transition-colors"
              onClick={toggleMenu}
            >
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              className="text-white text-lg border-b border-white/10 w-full pb-4 font-light hover:text-gray-300 transition-colors"
              onClick={toggleMenu}
            >
              Quem somos
            </Link>
            <Link
              href="/#contact"
              className="text-white text-lg border-b border-white/10 w-full pb-4 font-light hover:text-gray-300 transition-colors"
              onClick={toggleMenu}
            >
              Entre em contato
            </Link>
          </div>

          {/* Rodapé Mobile */}
          <div className="p-10 flex justify-center gap-8 border-t border-white/10 mx-8">
            <SocialLink href="https://api.whatsapp.com/send?phone=5547988163739&text=Olá" aria="WhatsApp">
              <WhatsappLogo size={24} />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/auroscorretoraimobiliaria/" aria="Instagram">
              <Instagram size={24} />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR" aria="Facebook">
              <Facebook size={24} />
            </SocialLink>
          </div>
        </div>
      )}

    </header>
  )
}

function SocialLink({ href, aria, children }: { href: string, aria: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={aria}
      className="text-white hover:text-gray-300 transition-colors p-1"
    >
      {children}
    </Link>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:underline hover:opacity-80 transition-opacity">
      {children}
    </Link>
  )
}