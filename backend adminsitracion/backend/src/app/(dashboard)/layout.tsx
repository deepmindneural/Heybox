"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  BarChart3, 
  ChefHat, 
  ChevronsLeft, 
  ChevronsRight, 
  ClipboardList, 
  CreditCard,
  Home, 
  LogOut, 
  Map, 
  MessageSquare, 
  Settings, 
  ShoppingBag, 
  Store,
  Users 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
  isActive: boolean
  isCollapsed: boolean
}

const SidebarItem = ({ icon, title, href, isActive, isCollapsed }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-3 px-3 rounded-lg transition-colors",
        isCollapsed ? "justify-center" : "justify-start",
        isActive 
          ? "bg-heybox-primary/10 text-heybox-primary" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <div className={cn(
        "flex items-center",
        isCollapsed ? "justify-center w-full" : "justify-start"
      )}>
        {React.cloneElement(icon as React.ReactElement, {
          className: cn("h-5 w-5", isCollapsed ? "mx-0" : "mr-3")
        })}
        {!isCollapsed && <span>{title}</span>}
      </div>
    </Link>
  )
}

// Datos de restaurantes para demo
const restaurantData = {
  "burger@heybox.co": {
    name: "Burger Deluxe",
    logo: "BD",
    type: "Hamburguesas",
    address: "Calle 123 #45-67",
    rating: 4.7
  },
  "pizza@heybox.co": {
    name: "Pizza Heaven",
    logo: "PH",
    type: "Pizzería",
    address: "Carrera 89 #12-34",
    rating: 4.5
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<typeof restaurantData[keyof typeof restaurantData] | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  
  // Determinar si el usuario es administrador general o de restaurante
  const isAdmin = pathname.startsWith("/admin")
  
  // Cargar datos del restaurante actual al iniciar (simulado)
  useEffect(() => {
    // Obtener el email del usuario del localStorage (en una implementación real vendría de un contexto de autenticación)
    const userEmail = localStorage.getItem('userEmail') || ''
    
    if (!isAdmin && userEmail && restaurantData[userEmail as keyof typeof restaurantData]) {
      setCurrentRestaurant(restaurantData[userEmail as keyof typeof restaurantData])
    } else if (!isAdmin) {
      // Valor por defecto para demo si no hay email guardado
      setCurrentRestaurant(restaurantData["burger@heybox.co"])
    }
  }, [isAdmin])
  
  // Menú para administrador general
  const adminMenu = [
    { title: "Dashboard", icon: <Home />, href: "/admin/dashboard" },
    { title: "Restaurantes", icon: <ChefHat />, href: "/admin/restaurants" },
    { title: "Usuarios", icon: <Users />, href: "/admin/users" },
    { title: "Pedidos", icon: <ShoppingBag />, href: "/admin/orders" },
    { title: "Pagos", icon: <CreditCard />, href: "/admin/payments" },
    { title: "Métricas", icon: <BarChart3 />, href: "/admin/metrics" },
    { title: "Configuración", icon: <Settings />, href: "/admin/settings" },
  ]
  
  // Menú para administrador de restaurante
  const restaurantMenu = [
    { title: "Dashboard", icon: <Home />, href: "/restaurant/dashboard" },
    { title: "Pedidos", icon: <ShoppingBag />, href: "/restaurant/orders" },
    { title: "Seguimiento", icon: <Map />, href: "/restaurant/tracking" },
    { title: "Menú", icon: <ClipboardList />, href: "/restaurant/menu" },
    { title: "Clientes", icon: <Users />, href: "/restaurant/customers" },
    { title: "Mensajes", icon: <MessageSquare />, href: "/restaurant/messages" },
    { title: "Configuración", icon: <Settings />, href: "/restaurant/settings" },
  ]
  
  // Seleccionar el menú apropiado según el tipo de usuario
  const menuItems = isAdmin ? adminMenu : restaurantMenu
  
  const handleLogout = () => {
    // Limpiar datos del usuario del localStorage
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    
    toast({
      title: "Cerrando sesión...",
      description: "Has cerrado sesión correctamente.",
    })
    
    // Redireccionar al login
    window.location.href = "/login"
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={toggleMobileSidebar}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex lg:ml-0">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-heybox-primary">HeyBox</span>
                {isAdmin ? (
                  <span className="text-xs bg-heybox-secondary text-white px-1.5 py-0.5 rounded">
                    Admin General
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-heybox-secondary text-white px-1.5 py-0.5 rounded">
                      Restaurante
                    </span>
                    {currentRestaurant && (
                      <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                        <div className="h-6 w-6 rounded-full bg-heybox-primary/20 flex items-center justify-center text-heybox-primary font-semibold text-xs">
                          {currentRestaurant.logo}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {currentRestaurant.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {currentRestaurant.type}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Link>
            </div>

            {/* Right side items */}
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <div className="hidden md:block mr-3 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {isAdmin ? "Administrador" : currentRestaurant?.name || "Restaurante"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isAdmin ? "Gestión Global" : 
                          currentRestaurant ? 
                            `${currentRestaurant.type} · ${currentRestaurant.rating}★` : 
                            "Mi Restaurante"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-heybox-primary focus:ring-offset-2"
                    >
                      <span className="sr-only">Abrir menú de usuario</span>
                      <div className="h-8 w-8 rounded-full bg-heybox-primary/20 flex items-center justify-center text-heybox-primary font-semibold">
                        {isAdmin ? "A" : currentRestaurant?.logo || "R"}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div
          className={cn(
            "fixed inset-0 z-40 md:hidden",
            isMobileSidebarOpen ? "block" : "hidden"
          )}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleMobileSidebar}
          ></div>

          {/* Sidebar panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleMobileSidebar}
              >
                <span className="sr-only">Cerrar sidebar</span>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-heybox-primary">HeyBox</span>
                <span className="ml-2 text-xs bg-heybox-secondary text-white px-1.5 py-0.5 rounded">
                  {isAdmin ? "Admin" : "Restaurante"}
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    icon={item.icon}
                    title={item.title}
                    href={item.href}
                    isActive={pathname === item.href}
                    isCollapsed={false}
                  />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div
          className={cn(
            "hidden md:flex md:flex-col border-r border-gray-200 transition-all duration-300 ease-in-out bg-white",
            isSidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between px-4 mb-6">
              {!isSidebarCollapsed && (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-heybox-primary">HeyBox</span>
                  <span className="ml-2 text-xs bg-heybox-secondary text-white px-1.5 py-0.5 rounded">
                    {isAdmin ? "Admin" : "Rest"}
                  </span>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isSidebarCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
              </button>
            </div>
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  title={item.title}
                  href={item.href}
                  isActive={pathname === item.href}
                  isCollapsed={isSidebarCollapsed}
                />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center text-red-600 hover:bg-red-50 rounded-lg",
                isSidebarCollapsed ? "justify-center w-full p-2" : "px-3 py-2 w-full"
              )}
            >
              <LogOut className={cn("h-5 w-5", isSidebarCollapsed ? "" : "mr-2")} />
              {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
