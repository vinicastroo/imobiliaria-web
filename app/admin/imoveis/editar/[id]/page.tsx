"use client"

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-[1400px]">
        <PropertyForm
          mode="edit"
          propertyId={id}
          defaultValues={property}
        />
      </main>
    </div>
  )
}
