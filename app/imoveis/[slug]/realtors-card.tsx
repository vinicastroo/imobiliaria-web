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

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 mt-1"
        asChild
      >
        <a
          href={`https://api.whatsapp.com/send?phone=${realtor.phone}&text=Olá, tenho interesse no imóvel: ${property.name}, código: ${property.code}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappLogo size={32} weight="fill" />
          Falar no WhatsApp
        </a>
      </Button>
    </div>
  )
}