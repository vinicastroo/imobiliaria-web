'use client'

import { PropertyForm } from '@/components/property-form/property-form'

export default function CriarImovelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-[1400px] flex-1 p-4 md:p-8">
        <PropertyForm mode="create" />
      </main>
    </div>
  )
}
