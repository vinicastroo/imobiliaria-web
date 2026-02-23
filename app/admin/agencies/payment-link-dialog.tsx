"use client"

import { useState } from 'react'
import { Copy, ExternalLink, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PaymentLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentLink: string | null
}

export function PaymentLinkDialog({ open, onOpenChange, paymentLink }: PaymentLinkDialogProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!paymentLink) return
    navigator.clipboard.writeText(paymentLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleOpenLink() {
    if (!paymentLink) return
    window.open(paymentLink, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Link de Pagamento</DialogTitle>
          <DialogDescription>
            Imobiliaria cadastrada com sucesso! Envie o link abaixo para o cliente realizar o pagamento da assinatura.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={paymentLink ?? ''}
            className="flex-1 text-sm"
          />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleOpenLink}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
