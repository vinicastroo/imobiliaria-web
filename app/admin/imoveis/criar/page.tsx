"use client"

import { PropertyForm } from '@/components/property-form/property-form'

export default function CriarImovelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-[1400px]">
        <PropertyForm mode="create" />
      </main>
    </div>
  )
}
