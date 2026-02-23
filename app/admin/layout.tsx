import { getTenantVisualConfig } from '@/lib/visual-config'
import { Menubar } from '@/components/menu'
import "@/app/globals.css"

// Server Component — fetches tenant visual config once per request.
// getTenantVisualConfig() is deduplicated via React.cache, so the root
// layout and this layout share a single network call.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logoUrl } = await getTenantVisualConfig()

  return (
    <div className="min-h-screen bg-gray-50">
      <Menubar logoUrl={logoUrl} />

      <main className="pl-20 w-full">
        {children}
      </main>
    </div>
  )
}
