"use client"

import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import logo from '@/public/logo-auros-minimalist.svg'

interface GalleryItem {
  img: string
}

export function PropertyGallery({ items, propertyName }: { items: GalleryItem[], propertyName: string }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[600px] bg-[#17375F] flex items-center justify-center rounded-lg">
        <Image src={logo} alt="Auros Logo" width={200} height={200} className="opacity-50" />
      </div>
    )
  }

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index} className="relative w-full h-[300px] md:h-[600px]">
            <div className="w-full h-full relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.img}
                alt={`${propertyName} - Foto ${index + 1}`}
                fill
                className="object-contain md:object-cover"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  )
}