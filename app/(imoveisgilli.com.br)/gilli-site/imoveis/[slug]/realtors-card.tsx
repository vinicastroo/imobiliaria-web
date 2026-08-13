'use client'
import type { Property } from '@/app/api/get-property'
import { Button } from '@/components/ui/button'
import type { Realtor } from '@/data/realtors'
import { WhatsappLogo } from '@phosphor-icons/react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'

export function RealtorsCard({ realtor, property }: { realtor: Realtor; property: Property }) {
  return (
    <div
      key={realtor.creci}
      className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 rounded-md border border-gray-200">
          <AvatarImage
            className="aspect-square rounded-md"
            src={typeof realtor.avatar === 'string' ? realtor.avatar : realtor.avatar}
          />
          <AvatarFallback>{realtor.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-[#EE9020]">{realtor.name}</p>
          <p className="text-xs text-gray-500">CRECI: {realtor.creci}</p>
        </div>
      </div>

      <a
        href={`https://api.whatsapp.com/send?phone=${realtor.phone}&text=Olá, tenho interesse no imóvel: ${property.name}, código: ${property.code}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-[#ecfbd5] py-2 text-sm font-bold text-[#046d4c] opacity-100 transition-all duration-300 hover:gap-4"
      >
        <WhatsappLogo size={24} weight="duotone" />
        Falar no WhatsApp
      </a>
    </div>
  )
}
