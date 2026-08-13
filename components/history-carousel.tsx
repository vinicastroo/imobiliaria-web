'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi, // 1. Importar o tipo da API
} from '@/components/ui/carousel'
import { useRef, useState, useEffect } from 'react' // 2. Importar hooks
import { cn } from '@/lib/utils' // Para classes condicionais (padrão shadcn)

const historyImages = [
  {
    src: '/auros-1.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-2.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-3.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-4.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-5.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-6.jpg',
    alt: 'Equipe Auros',
  },
  {
    src: '/auros-7.jpg',
    alt: 'Equipe Auros',
  },
]

export function HistoryCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="group relative h-full w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="h-full w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {historyImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Overlay Escuro com Texto */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#17375F]/30 via-transparent to-transparent p-8 pb-16">
                  {' '}
                  {/* Aumentei o pb-16 para dar espaço para as bolinhas */}
                  {/* <div className="text-white transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <p className="font-bold text-xl mb-1">{image.label}</p>
                    <p className="text-sm opacity-90 font-light">{image.sub}</p>
                  </div> */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 hidden border-none bg-white/10 text-white hover:bg-white/30 md:flex" />
        <CarouselNext className="right-4 hidden border-none bg-white/10 text-white hover:bg-white/30 md:flex" />
      </Carousel>

      <div className="absolute right-0 bottom-6 left-0 z-10 flex justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 ease-in-out',
              current === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75',
            )}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
