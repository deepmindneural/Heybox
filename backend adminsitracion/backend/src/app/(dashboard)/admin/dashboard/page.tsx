"use client"

import React, { useState } from "react"
import { 
  BarChart3, 
  ChefHat, 
  Download, 
  ShoppingBag, 
  TrendingUp, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para la demostración
const dashboardData = {
  stats: {
    totalRestaurants: 24,
    totalOrders: 1876,
    totalUsers: 3452,
    totalRevenue: 8739500 // En pesos colombianos
  },
  recentOrders: [
    { id: "HB-12345", restaurant: "La Parrilla Gourmet", customer: "Carlos Ramírez", amount: 78500, status: "completed", date: "2025-06-01T10:23:15" },
    { id: "HB-12346", restaurant: "Sushi Express", customer: "Ana Martínez", amount: 95000, status: "preparing", date: "2025-06-01T11:45:30" },
    { id: "HB-12347", restaurant: "Burger House", customer: "Juan Pérez", amount: 45000, status: "ready", date: "2025-06-01T12:15:42" },
    { id: "HB-12348", restaurant: "Pasta Bella", customer: "María López", amount: 62500, status: "pending", date: "2025-06-01T13:05:22" },
    { id: "HB-12349", restaurant: "Taco Loco", customer: "Pedro González", amount: 37000, status: "approaching", date: "2025-06-01T13:30:18" }
  ],
  topRestaurants: [
    { name: "La Parrilla Gourmet", orders: 357, revenue: 14250000 },
    { name: "Sushi Express", orders: 298, revenue: 11920000 },
    { name: "Burger House", orders: 245, revenue: 7350000 },
    { name: "Pasta Bella", orders: 187, revenue: 6545000 },
    { name: "Taco Loco", orders: 156, revenue: 4680000 }
  ]
}

// Componente para las tarjetas de estadísticas
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: number
  bgColor: string
}

const StatCard = ({ title, value, icon, change, bgColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center">
        <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          <TrendingUp className={`h-4 w-4 mr-1 ${change < 0 && 'transform rotate-180'}`} />
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs mes anterior</span>
      </div>
    </div>
  )
}

// Función para formatear cantidades de dinero en pesos colombianos
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

// Función para formatear fechas
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Componente para el estado de los pedidos
const OrderStatus = ({ status }: { status: string }) => {
  let color = "bg-gray-100 text-gray-800"
  
  switch (status) {
    case "completed":
      color = "bg-green-100 text-green-800"
      break
    case "preparing":
      color = "bg-blue-100 text-blue-800"
      break
    case "ready":
      color = "bg-purple-100 text-purple-800"
      break
    case "approaching":
      color = "bg-yellow-100 text-yellow-800"
      break
    case "pending":
      color = "bg-orange-100 text-orange-800"
      break
  }
  
  const statusText = {
    completed: "Completado",
    preparing: "Preparando",
    ready: "Listo",
    approaching: "En camino",
    pending: "Pendiente"
  }[status] || status
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {statusText}
    </span>
  )
}

export default function AdminDashboard() {
  // Estado para el período seleccionado (podría conectarse a la API para obtener datos según el período)
  const [period, setPeriod] = useState("week")
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <Button 
              variant={period === "day" ? "default" : "outline"} 
              onClick={() => setPeriod("day")}
              className="rounded-r-none"
            >
              Hoy
            </Button>
            <Button 
              variant={period === "week" ? "default" : "outline"} 
              onClick={() => setPeriod("week")}
              className="rounded-none border-l-0 border-r-0"
            >
              Semana
            </Button>
            <Button 
              variant={period === "month" ? "default" : "outline"} 
              onClick={() => setPeriod("month")}
              className="rounded-l-none"
            >
              Mes
            </Button>
          </div>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Restaurantes" 
          value={dashboardData.stats.totalRestaurants} 
          icon={<ChefHat className="h-6 w-6" />} 
          change={8.5} 
          bgColor="bg-blue-500" 
        />
        <StatCard 
          title="Pedidos" 
          value={dashboardData.stats.totalOrders} 
          icon={<ShoppingBag className="h-6 w-6" />} 
          change={12.3} 
          bgColor="bg-heybox-primary" 
        />
        <StatCard 
          title="Usuarios" 
          value={dashboardData.stats.totalUsers} 
          icon={<Users className="h-6 w-6" />} 
          change={5.7} 
          bgColor="bg-heybox-secondary" 
        />
        <StatCard 
          title="Ingresos" 
          value={formatCurrency(dashboardData.stats.totalRevenue)} 
          icon={<BarChart3 className="h-6 w-6" />} 
          change={-2.4} 
          bgColor="bg-purple-500" 
        />
      </div>

      {/* Contenido principal del dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Pedidos Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-heybox-primary">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.restaurant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button variant="link" className="text-heybox-primary hover:text-heybox-primary/80">
              Ver todos los pedidos
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Restaurantes Top</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {dashboardData.topRestaurants.map((restaurant, index) => (
                <li key={restaurant.name} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-sm text-gray-500">{restaurant.orders} pedidos</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(restaurant.revenue)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button variant="link" className="text-heybox-primary hover:text-heybox-primary/80">
              Ver todos los restaurantes
            </Button>
          </div>
        </div>
      </div>

      {/* Sección de mapa (aquí se integraría con Mapbox) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Distribución de Restaurantes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vista general de la ubicación de todos los restaurantes registrados
          </p>
        </div>
        <div className="h-96 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-heybox-primary opacity-50" />
            <p className="text-lg font-medium">Mapa de Restaurantes</p>
            <p className="mt-1 text-sm">El mapa se cargará con la integración de Mapbox</p>
          </div>
        </div>
      </div>
    </div>
  )
}
