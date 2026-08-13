'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

interface PropertyImagesCarouselProps {
  files: {
    id: string
    path: string
    fileName: string
  }[]
  propertyName: string
}

export function PropertyImagesCarousel({ files, propertyName }: PropertyImagesCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // UseCallback para garantir que a função de atualização seja estável
  const updateState = useCallback((api: CarouselApi) => {
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    // 1. Configura os listeners
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    api.on('reInit', () => {
      updateState(api)
    })

    // 2. Atualização Inicial (Correção do Erro)
    // O setTimeout(..., 0) joga a execução para o próximo ciclo,
    // evitando o bloqueio síncrono que causa o erro de "cascading renders".
    // É uma prática comum ao lidar com inits de bibliotecas de terceiros.
    const timer = setTimeout(() => {
      updateState(api)
    }, 0)

    // Cleanup
    return () => {
      clearTimeout(timer)
      api.off('select', () => setCurrent(api.selectedScrollSnap()))
      api.off('reInit', () => updateState(api))
    }
  }, [api, updateState])

  if (!files || files.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-gray-100 md:h-[600px]">
        <p className="text-gray-400">Sem imagens disponíveis</p>
      </div>
    )
  }

  return (
    <div className="group relative w-full">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {files.map((file, index) => (
            <CarouselItem key={file.id}>
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gray-100 md:h-[600px]">
                <Image
                  src={file.path}
                  alt={`${propertyName} - Imagem ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center"
                  priority={index === 0}
                  quality={100}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {files.length > 1 && (
          <>
            <CarouselPrevious className="left-4 h-10 w-10 border-none bg-white/80 text-gray-800 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white" />
            <CarouselNext className="right-4 h-10 w-10 border-none bg-white/80 text-gray-800 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white" />
          </>
        )}
      </Carousel>

      {/* --- BOLINHAS / INDICADORES --- */}
      {count > 1 && (
        <div className="pointer-events-none absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-2 px-4">
          {/* pointer-events-auto na div interna para permitir clique nas bolinhas */}
          <div className="scrollbar-hide pointer-events-auto flex max-w-full gap-2 overflow-x-auto px-2 py-1">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full shadow-sm transition-all duration-300 ${
                  index === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                } `}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contador numérico */}
      <div className="absolute right-4 bottom-4 z-10 hidden rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:block">
        {current + 1} / {count}
      </div>
    </div>
  )
}
