'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import api from '@/services/api'
import { AdminPage, PageHeader } from '@/components/admin/page'
import { Skeleton } from '@/components/ui/skeleton'
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
    // Esqueleto com a mesma estrutura do formulário (sem pular layout)
    return (
      <AdminPage width="wide">
        <PageHeader
          breadcrumb={[{ href: '/admin/imoveis', label: 'Imóveis' }, { label: 'Editar imóvel' }]}
          title="Carregando imóvel…"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" aria-busy="true">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </AdminPage>
    )
  }

  return (
    <AdminPage width="wide">
      <PropertyForm mode="edit" propertyId={id} defaultValues={property} />
    </AdminPage>
  )
}
