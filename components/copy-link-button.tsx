"use client"

import { useState } from "react"
import { Link as LinkIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CopyLinkButtonProps {
  className?: string
}

export function CopyLinkButton({ className }: CopyLinkButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopy = () => {
    // Garante que roda apenas no cliente
    if (typeof window === "undefined") return

    const url = window.location.href

    navigator.clipboard.writeText(url)
      .then(() => {
        setHasCopied(true)
        toast.success("Link do imóvel copiado!", {
          description: "Agora você pode colar o link onde quiser.",
        })

        // Volta ao estado original após 2 segundos
        setTimeout(() => setHasCopied(false), 2000)
      })
      .catch(() => {
        toast.error("Erro ao copiar link.")
      })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn(
        "gap-2 w-full cursor-pointer border-[#17375F] text-[#17375F] hover:bg-[#17375F] hover:text-white transition-all duration-300 min-w-[130px]",
        className
      )}
    >
      {hasCopied ? (
        <>
          <Check size={16} className="animate-in zoom-in" />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <LinkIcon size={16} />
          <span>Copiar do imóvel Link</span>
        </>
      )}
    </Button>
  )
}