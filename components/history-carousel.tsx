"use client"

import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi, // 1. Importar o tipo da API
} from "@/components/ui/carousel"
import { useRef, useState, useEffect } from "react" // 2. Importar hooks
import { cn } from "@/lib/utils" // Para classes condicionais (padrão shadcn)

const historyImages = [
  {
    src: "/auros-1.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-2.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-3.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-4.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-5.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-6.jpg",
    alt: "Equipe Auros",
  },
  {
    src: "/auros-7.jpg",
    alt: "Equipe Auros",
  },
]

export function HistoryCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="w-full h-full relative group"> 
      <Carousel
        setApi={setApi} 
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {historyImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Overlay Escuro com Texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17375F]/30 via-transparent to-transparent flex items-end p-8 pb-16"> {/* Aumentei o pb-16 para dar espaço para as bolinhas */}
                  {/* <div className="text-white transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <p className="font-bold text-xl mb-1">{image.label}</p>
                    <p className="text-sm opacity-90 font-light">{image.sub}</p>
                  </div> */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/30 border-none text-white hidden md:flex" />
        <CarouselNext className="right-4 bg-white/10 hover:bg-white/30 border-none text-white hidden md:flex" />
      </Carousel>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 ease-in-out",
              current === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}