"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

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
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    api.on("reInit", () => {
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
      api.off("select", () => setCurrent(api.selectedScrollSnap()))
      api.off("reInit", () => updateState(api))
    }
  }, [api, updateState])

  if (!files || files.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-gray-100 flex items-center justify-center rounded-xl">
        <p className="text-gray-400">Sem imagens disponíveis</p>
      </div>
    )
  }

  return (
    <div className="w-full relative group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {files.map((file, index) => (
            <CarouselItem key={file.id}>
              <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={file.path}
                  alt={`${propertyName} - Imagem ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  priority={index === 0}
                />

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {files.length > 1 && (
          <>
            <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-none h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-none h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>

      {/* --- BOLINHAS / INDICADORES --- */}
      {count > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 px-4 pointer-events-none">
          {/* pointer-events-auto na div interna para permitir clique nas bolinhas */}
          <div className="flex gap-2 overflow-x-auto max-w-full px-2 py-1 scrollbar-hide pointer-events-auto">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`
                  h-2 rounded-full transition-all duration-300 shadow-sm
                  ${index === current
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                  }
                `}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contador numérico */}
      <div className="absolute bottom-4 right-4 bg-black/40 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10 hidden md:block">
        {current + 1} / {count}
      </div>
    </div>
  )
}