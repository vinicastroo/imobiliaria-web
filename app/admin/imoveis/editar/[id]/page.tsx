'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import api from '@/services/api'
import { PropertyForm } from '@/components/property-form/property-form'
import type { PropertyData } from '@/components/property-form/types'

export default function EditarImovelPage() {
  const params = useParams()
  const id = params?.id as string

  const { data: property, isLoading } = useQuery<PropertyData>({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/imovel/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  if (isLoading || !property) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#17375F]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-8">
        <PropertyForm mode="edit" propertyId={id} defaultValues={property} />
      </main>
    </div>
  )
}
