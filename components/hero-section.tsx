"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Search, Facebook, Instagram, MessageCircle, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// Importe suas APIs aqui
import { getCities } from '@/app/api/get-cities'
import { getTypes } from '@/app/api/get-types'
import { getNeighborhoods } from '@/app/api/get-neighborhoods'
import { WhatsappLogo } from '@phosphor-icons/react'


const createSchema = z.object({
  type_id: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
})

type SchemaQuestion = z.infer<typeof createSchema>


export function HeroSection() {
  const router = useRouter()
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
    // Construção da URL de busca
    const params = new URLSearchParams()
    if (data.type_id) params.set('tipoImovel', data.type_id)
    if (data.city) params.set('cidade', data.city)
    if (data.neighborhood) params.set('bairro', data.neighborhood)

    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <section className="relative w-full h-screen flex flex-col p-4">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover object-[center_-80px]"
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay escuro opcional para leitura */}
      </div>

      {/* Header / Navbar area */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center py-4 gap-4 z-10">
        <Link href="/">
          <Image src="./logo-auros-minimalist.svg" alt="Auros Logo" width={120} height={120} className="w-20 h-20 md:w-32 md:h-32" />
        </Link>

        <nav className="flex flex-col md:flex-row items-center gap-6 text-white font-medium">
          <div className="flex gap-4">
            <Link href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá, vim pelo site" target="_blank" className="hover:opacity-80 transition-opacity">
              <WhatsappLogo size={20} />
            </Link>
            <Link href="https://www.instagram.com/auroscorretoraimobiliaria/" target="_blank" className="hover:opacity-80 transition-opacity">
              <Instagram size={16} />
            </Link>
            <Link href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR" target="_blank" className="hover:opacity-80 transition-opacity">
              <Facebook size={16} />
            </Link>
          </div>
          <Link href="/imoveis" className="hover:underline">Imóveis</Link>
          <Link href="#contact" className="hover:underline">Entre em contato</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-[1200px] mx-auto text-center z-10">
        <h1 className="text-white text-2xl md:text-5xl font-light drop-shadow-lg">
          Assim como o ouro é valioso, seu novo lar será um tesouro inestimável
        </h1>

        <Card className="w-full bg-white/90 md:bg-white/10 md:backdrop-blur-md border-none shadow-2xl">
          <CardContent className="py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-center">

              <div className="w-full text-left">
                <Controller
                  name="type_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="bg-white text-black w-full h-[300px]">
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
                {/* <Label className="text-gray-700 md:text-white font-semibold">Cidade</Label> */}
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white text-black w-full h-14">
                        <SelectValue placeholder="Cidade do imóvel" />
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
                {/* <Label className="text-gray-700 md:text-white font-semibold">Bairro</Label> */}
                <Controller
                  name="neighborhood"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!neighborhoods} >
                      <SelectTrigger className="bg-white text-black w-full h-28">
                        <SelectValue placeholder="Bairro do imóvel" />
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

              <div className="flex items-end w-full">
                <Button size="lg" className="w-full text-lg gap-2 bg-[#17375F]" disabled={isLoading}>
                  <Search size={20} />
                  Buscar
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}