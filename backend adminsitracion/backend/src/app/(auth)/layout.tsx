import React from "react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-heybox-light flex flex-col">
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-heybox-primary">HeyBox</span>
            <span className="text-xs bg-heybox-secondary text-white px-1.5 py-0.5 rounded">Admin</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="py-4 px-6 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} HeyBox. Todos los derechos reservados.</p>
        </div>
      </footer>
      
      {/* Toaster para mostrar notificaciones */}
      <Toaster />
    </div>
  )
}
