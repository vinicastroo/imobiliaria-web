'use client'
import type { Property } from "@/app/api/get-property";
import { Button } from "@/components/ui/button";
import type { Realtor } from "@/data/realtors";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export function RealtorsCard({ realtor, property }: { realtor: Realtor; property: Property }) {
  return (
    <div key={realtor.creci} className="flex flex-col gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 rounded-md border border-gray-200">
          <AvatarImage className="aspect-square rounded-md" src={typeof realtor.avatar === 'string' ? realtor.avatar : realtor.avatar} />
          <AvatarFallback>{realtor.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-[#17375F]">{realtor.name}</p>
          <p className="text-xs text-gray-500">CRECI: {realtor.creci}</p>
        </div>
      </div>


      <a
        href={`https://api.whatsapp.com/send?phone=${realtor.phone}&text=Olá, tenho interesse no imóvel: ${property.name}, código: ${property.code}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#ecfbd5] opacity-100 py-2 rounded-full text-sm hover:gap-4 transition-all duration-300  text-[#046d4c] gap-2 mt-1 font-bold flex items-center justify-center"
      >
        <WhatsappLogo size={24} weight="duotone" />
        Falar no WhatsApp
      </a>

    </div>
  )
}