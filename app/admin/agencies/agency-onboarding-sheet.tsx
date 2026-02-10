"use client"

import { useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

import { AgencyOnboardingForm } from './agency-onboarding-form'
import { PaymentLinkDialog } from './payment-link-dialog'

interface AgencyOnboardingSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgencyOnboardingSheet({ open, onOpenChange }: AgencyOnboardingSheetProps) {
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  function handleSuccess(link: string | null) {
    onOpenChange(false)
    if (link) {
      setPaymentLink(link)
      setShowPaymentDialog(true)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nova Imobiliaria</SheetTitle>
            <SheetDescription>
              Cadastre uma nova imobiliaria com usuario administrador e plano.
            </SheetDescription>
          </SheetHeader>

          <AgencyOnboardingForm onSuccess={handleSuccess} />
        </SheetContent>
      </Sheet>

      <PaymentLinkDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        paymentLink={paymentLink}
      />
    </>
  )
}
