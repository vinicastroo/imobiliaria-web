'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import logo from '@/public/logo-auros-minimalist.svg'
import { cn } from '@/lib/utils'

interface GalleryItem {
  img: string
}

interface PropertyGalleryProps {
  items: GalleryItem[]
  propertyName: string
  isRecentProperty?: boolean
  path?: string
}

export function PropertyGallery({
  items,
  propertyName,
  isRecentProperty,
  path,
}: PropertyGalleryProps) {
  const router = useRouter()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      React.startTransition(() => {
        setCurrent(api.selectedScrollSnap() + 1)
      })
    }

    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (!items || items.length === 0) {
    return (
      <div
        className={`relative flex w-full items-center justify-center bg-[#17375F] ${isRecentProperty ? 'h-[275px] md:h-[300px]' : 'h-[350px] lg:h-[700px]'}`}
      >
        <Image src={logo} alt="Auros Logo" width={200} height={200} className="opacity-50" />
      </div>
    )
  }

  return (
    // Adicionado 'group' aqui para controlar os filhos no hover
    <div className="group relative w-full">
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className={`relative w-full ${isRecentProperty ? 'h-[275px] md:h-[300px]' : 'h-[350px] lg:h-[500px]'}`}
              onClick={() => {
                if (isRecentProperty && path) {
                  router.push(path)
                }
              }}
            >
              <div
                className={`relative h-full w-full ${isRecentProperty ? 'rounded-none' : 'rounded-lg'} overflow-hidden bg-gray-100`}
              >
                <Image
                  src={item.img}
                  alt={`${propertyName} - Foto ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="transition-scale cursor-pointer object-cover duration-300 group-hover:scale-105"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 border-none bg-white/80 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-white" />
        <CarouselNext className="right-4 border-none bg-white/80 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-white" />
      </Carousel>

      <div className="absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-2 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              `${isRecentProperty ? 'h-2 w-2' : 'h-2.5 w-2.5'} rounded-full shadow-sm transition-all duration-300`,
              index + 1 === current ? 'w-6 scale-110 bg-white' : 'bg-white/40 hover:bg-white/80',
            )}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador numérico (também segue a mesma lógica de hover) */}
      {!isRecentProperty && (
        <div className="absolute right-4 bottom-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          {current} / {count}
        </div>
      )}
    </div>
  )
}
