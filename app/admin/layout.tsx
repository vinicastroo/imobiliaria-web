import { Menubar } from '@/components/menu'
import "@/app/globals.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Menubar /> {/* O menu fixo */}

      {/* O conteúdo com padding para não colidir com o menu */}
      <main className="pl-20 w-full">
        {children}
      </main>
    </div>
  )
}