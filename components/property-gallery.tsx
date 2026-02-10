"use client"

import * as React from "react"
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import logo from '@/public/logo-auros-minimalist.svg'
import { cn } from "@/lib/utils"
import { useWatermark } from "@/hooks/use-watermark"
import { WatermarkOverlay } from "@/components/watermark-overlay"

interface GalleryItem {
  img: string
}

export function PropertyGallery({ items, propertyName, isRecentProperty, path }: { items: GalleryItem[], propertyName: string, isRecentProperty?: boolean, path?: string }) {
  const { watermarkUrl } = useWatermark()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (!items || items.length === 0) {
    return (
      <div className={`relative w-full flex items-center justify-center bg-[#17375F] ${isRecentProperty ? 'h-[275px] md:h-[300px]' : 'h-[350px] lg:h-[700px] '}`}>
        <Image src={logo} alt="Auros Logo" width={200} height={200} className="opacity-50" />
      </div>
    )
  }

  return (
    // Adicionado 'group' aqui para controlar os filhos no hover
    <div className="relative w-full group">
      <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className={`relative w-full ${isRecentProperty ? 'h-[275px] md:h-[300px]' : 'h-[350px] lg:h-[500px] '}`} onClick={() => {
              if (isRecentProperty && path) {
                window.open(path, '_blank')
              }
            }}>
              <div className={`w-full h-full relative  ${isRecentProperty ? 'rounded-none' : 'rounded-lg'} overflow-hidden bg-gray-100`}>
                <Image
                  src={item.img}
                  alt={`${propertyName} - Foto ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 cursor-pointer transition-scale duration-300"
                  priority={index === 0}
                />
                {watermarkUrl && <WatermarkOverlay watermarkUrl={watermarkUrl} />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="right-4 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
      </Carousel>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              `${isRecentProperty ? 'h-2 w-2' : 'h-2.5 w-2.5'} rounded-full transition-all duration-300 shadow-sm`,
              index + 1 === current
                ? "bg-white scale-110 w-6"
                : "bg-white/40 hover:bg-white/80"
            )}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador numérico (também segue a mesma lógica de hover) */}
      {!isRecentProperty && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {current} / {count}
        </div>
      )}
    </div>
  )
}