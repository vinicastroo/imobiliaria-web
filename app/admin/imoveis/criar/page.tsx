'use client'

import { AdminPage } from '@/components/admin/page'
import { PropertyForm } from '@/components/property-form/property-form'

export default function CriarImovelPage() {
  return (
    <AdminPage width="wide">
      <PropertyForm mode="create" />
    </AdminPage>
  )
}
