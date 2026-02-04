"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Search, Facebook, Instagram, Menu, X } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { getCities } from '@/app/api/get-cities'
import { getTypes } from '@/app/api/get-types'
import { getNeighborhoods } from '@/app/api/get-neighborhoods'

const createSchema = z.object({
  type_id: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
})

type SchemaQuestion = z.infer<typeof createSchema>

export function HeroSection() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { control, watch, handleSubmit, formState: { isLoading } } = useForm<SchemaQuestion>({
    resolver: zodResolver(createSchema),
  })

  const city = watch('city')

  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: getCities })
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: getTypes })
  const { data: neighborhoods } = useQuery({
    queryKey: ['neighborhoods', city],
    queryFn: () => getNeighborhoods({ city }),
    enabled: !!city
  })

  const onSubmit = (data: SchemaQuestion) => {
    const params = new URLSearchParams()
    if (data.type_id) params.set('tipoImovel', data.type_id)
    if (data.city) params.set('cidade', data.city)
    if (data.neighborhood) params.set('bairro', data.neighborhood)

    router.push(`/imoveis?${params.toString()}`)
  }

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <section className="relative w-full h-screen flex flex-col p-4 z-10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover "
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center py-4 z-50 relative">
        <Link href="/">
          <Image
            src="./logo-auros-minimalist.svg"
            alt="Auros Logo"
            width={120}
            height={120}
            className="w-16 h-16 md:w-32 md:h-32 object-contain"
          />
        </Link>

        {/* Botão Hamburger (Só abre, não fecha aqui visualmente pois o menu cobrirá tudo) */}
        <button
          className="md:hidden text-white p-2 z-50"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Menu Desktop */}
        <nav className="hidden md:flex flex items-end gap-2 text-white font-medium">
          <div className="flex gap-4">
            <SocialLink href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá"><WhatsappLogo size={20} /></SocialLink>
            <SocialLink href="https://www.instagram.com/auroscorretoraimobiliaria/"><Instagram size={16} /></SocialLink>
            <SocialLink href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR"><Facebook size={16} /></SocialLink>
          </div>
          <div className="flex gap-6">
            <Link href="/imoveis" className="hover:underline hover:text-gray-200 transition-colors">Imóveis</Link>
            <Link href="/quem-somos" className="hover:underline hover:text-gray-200 transition-colors">Quem somos</Link>
            <Link href="#contact" className="hover:underline hover:text-gray-200 transition-colors">Entre em contato</Link>
          </div>
        </nav>
      </div>


      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#17375F] z-[999] flex flex-col animate-in fade-in slide-in-from-right duration-300">

          {/* Cabeçalho do Menu Mobile (Logo + Botão Fechar) */}
          <div className="flex justify-between items-center p-8">
            <Link href="/" onClick={closeMenu}>
              <Image
                src="./logo-auros-minimalist.svg"
                alt="Auros Logo"
                width={100}
                height={100}
                className="w-16 h-16 object-contain"
              />
            </Link>
            <button onClick={closeMenu} className="text-white p-2 flex justify-center items-center gap-2">
              <X size={20} />
            </button>
          </div>

          {/* Links Centralizados */}
          <div className="flex-1 flex flex-col items-start justify-start gap-10 px-5">
            <Link
              href="/imoveis"
              onClick={closeMenu}
              className="text-white text-lg font-light hover:text-gray-300 transition-colors border-b w-full pb-2 border-white/10"
            >
              Imóveis
            </Link>
            <Link
              href="/quem-somos"
              onClick={closeMenu}
              className="text-white text-lg font-light hover:text-gray-300 transition-colors border-b w-full pb-2 border-white/10"
            >
              Quem somos
            </Link>
            <Link
              href="#contact"
              onClick={closeMenu}
              className="text-white text-lg font-light hover:text-gray-300 transition-colors border-b w-full pb-2 border-white/10"
            >
              Entre em contato
            </Link>
          </div>

          {/* Rodapé do Menu (Redes Sociais) */}
          <div className="p-10 flex justify-center gap-8 border-t border-white/10">
            <SocialLink href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá">
              <WhatsappLogo size={25} />
            </SocialLink>
            <SocialLink href="https://www.instagram.com/auroscorretoraimobiliaria/">
              <Instagram size={25} />
            </SocialLink>
            <SocialLink href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR">
              <Facebook size={25} />
            </SocialLink>
          </div>
        </div>
      )}


      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-[1200px] mx-auto text-center z-10 px-2 md:px-0">
        <h1 className="text-white text-2xl md:text-5xl font-light drop-shadow-lg leading-tight">
          Assim como o ouro é valioso, <br className="hidden md:block" /> seu novo lar será um tesouro inestimável
        </h1>

        <Card className="w-full bg-white/95 md:bg-white/10 md:backdrop-blur-md border-none shadow-2xl">
          <CardContent className="py-6 px-4 md:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-center">

              <div className="w-full text-left">
                <Controller
                  name="type_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                        <SelectValue placeholder="Tipo de Imóvel" />
                      </SelectTrigger>
                      <SelectContent>
                        {types?.map((type: { id: string; description: string }) => (
                          <SelectItem key={type.id} value={type.description}>{type.description}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="w-full text-left">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                        <SelectValue placeholder="Cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((c: { city: string }) => (
                          <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="w-full text-left">
                <Controller
                  name="neighborhood"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!neighborhoods} >
                      <SelectTrigger className="bg-white text-black w-full h-12 md:h-14 border-0 md:border">
                        <SelectValue placeholder="Bairro" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods?.map((n: { neighborhood: string }) => (
                          <SelectItem key={n.neighborhood} value={n.neighborhood}>{n.neighborhood}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-end w-full md:w-auto">
                <Button size="lg" className="cursor-pointer w-full md:w-auto text-lg gap-2 bg-[#17375F] hover:bg-[#122b4a] px-14 py-3" disabled={isLoading}>
                  <Search size={20} />
                  <span className="text-base md:hidden">Buscar Imóveis</span>
                  <span className="hidden text-base md:inline ">Buscar</span>
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SocialLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" className="text-white hover:text-gray-300 transition-colors">
      {children}
    </Link>
  )
}