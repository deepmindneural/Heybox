"use client"

import React, { useState } from "react"
import { 
  ArrowUpRight, 
  Clock, 
  Download,
  MapPin, 
  Bike, 
  ShoppingBag, 
  TrendingUp, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import DeliveryMap from "@/components/DeliveryMap"

// Datos de ejemplo para la demostración
const dashboardData = {
  stats: {
    activeOrders: 8,
    pendingOrders: 3,
    completedToday: 42,
    totalRevenue: 2345000 // En pesos colombianos
  },
  recentOrders: [
    { id: "HB-12350", customer: "Sofía Ramírez", items: 3, amount: 65000, status: "ready", distance: 250, eta: "4 min", date: "2025-06-01T14:23:15" },
    { id: "HB-12351", customer: "Diego Martínez", items: 2, amount: 42500, status: "preparing", distance: 800, eta: "12 min", date: "2025-06-01T14:15:30" },
    { id: "HB-12352", customer: "Laura Pérez", items: 4, amount: 87000, status: "pending", distance: null, eta: null, date: "2025-06-01T14:05:42" },
    { id: "HB-12353", customer: "Miguel López", items: 1, amount: 28500, status: "approaching", distance: 120, eta: "2 min", date: "2025-06-01T13:55:22" },
    { id: "HB-12354", customer: "Valeria González", items: 2, amount: 39000, status: "pending", distance: null, eta: null, date: "2025-06-01T13:50:18" }
  ],
  approachingCustomers: [
    { id: "HB-12353", name: "Miguel López", orderId: "HB-12353", distance: 120, eta: "2 min", latitude: 4.671, longitude: -74.052 },
    { id: "HB-12350", name: "Sofía Ramírez", orderId: "HB-12350", distance: 250, eta: "4 min", latitude: 4.673, longitude: -74.056 },
    { id: "HB-12351", name: "Diego Martínez", orderId: "HB-12351", distance: 800, eta: "12 min", latitude: 4.680, longitude: -74.048 }
  ],
  topProducts: [
    { name: "Hamburguesa Especial", sold: 156, revenue: 1872000 },
    { name: "Pizza Familiar", sold: 98, revenue: 1568000 },
    { name: "Combo Familiar", sold: 76, revenue: 1368000 },
    { name: "Burrito Grande", sold: 64, revenue: 768000 },
    { name: "Ensalada César", sold: 45, revenue: 540000 }
  ]
}

// Componente para las tarjetas de estadísticas
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: number
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
      {change !== undefined && (
        <div className="flex items-center">
          <span className={`${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${change < 0 && 'transform rotate-180'}`} />
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 text-sm ml-2">vs ayer</span>
        </div>
      )}
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

// Componente para el anillo de proximidad
const ProximityIndicator = ({ distance }: { distance: number | null }) => {
  if (distance === null) return null
  
  let bgColor = "bg-red-500"
  if (distance <= 100) bgColor = "bg-green-500"
  else if (distance <= 500) bgColor = "bg-yellow-500"
  
  return (
    <div className="flex items-center gap-1">
      <div className={`h-3 w-3 rounded-full ${bgColor}`}></div>
      <span className="text-sm text-gray-600">{distance}m</span>
    </div>
  )
}

export default function RestaurantDashboard() {
  // Estado para el período seleccionado (podría conectarse a la API para obtener datos según el período)
  const [period, setPeriod] = useState("today")
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard del Restaurante</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <div className="inline-flex rounded-md shadow-sm">
            <Button 
              variant={period === "today" ? "default" : "outline"} 
              onClick={() => setPeriod("today")}
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
          title="Pedidos Activos" 
          value={dashboardData.stats.activeOrders} 
          icon={<ShoppingBag className="h-6 w-6" />} 
          bgColor="bg-[#FF5A5F]" 
        />
        <StatCard 
          title="Pendientes" 
          value={dashboardData.stats.pendingOrders} 
          icon={<Clock className="h-6 w-6" />} 
          bgColor="bg-yellow-500" 
        />
        <StatCard 
          title="Completados Hoy" 
          value={dashboardData.stats.completedToday} 
          icon={<Bike className="h-6 w-6" />} 
          change={15.2} 
          bgColor="bg-green-500" 
        />
        <StatCard 
          title="Ingresos Hoy" 
          value={formatCurrency(dashboardData.stats.totalRevenue)} 
          icon={<ArrowUpRight className="h-6 w-6" />} 
          change={8.7} 
          bgColor="bg-[#00A699]" 
        />
      </div>

      {/* Sección de mapa de clientes en tiempo real */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Seguimiento de Clientes en Tiempo Real</h3>
          <p className="mt-1 text-sm text-gray-500">
            Visualiza la ubicación y proximidad de los clientes que se dirigen a recoger su pedido
          </p>
        </div>
        <div className="h-96 bg-gray-100 overflow-hidden">
          <div className="h-full w-full">
            <DeliveryMap customers={dashboardData.approachingCustomers} />
          </div>
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md z-10">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Muy cerca (&lt;100m)</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Cercano (&lt;500m)</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Lejano (&gt;500m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal del dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Pedidos Activos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artículos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proximidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETA
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
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProximityIndicator distance={order.distance} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.eta || '-'}
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">Clientes En Ruta</h3>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {dashboardData.approachingCustomers.map((customer) => (
                <li key={customer.id} className="py-4 flex items-center">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ${
                    customer.distance <= 100 ? 'bg-green-100 text-green-800' : 
                    customer.distance <= 500 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    <span className="font-bold">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.eta}</div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      {customer.orderId}
                      <span className="mx-2">•</span>
                      <MapPin className="h-3 w-3 mr-1" />
                      {customer.distance}m
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button variant="link" className="text-heybox-primary hover:text-heybox-primary/80">
              Ver en mapa
            </Button>
          </div>
        </div>
      </div>

      {/* Productos populares */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Productos Más Vendidos</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {dashboardData.topProducts.map((product, index) => (
              <div key={product.name} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                  }`}>
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-semibold text-heybox-primary">{product.sold} und.</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                <p className="text-sm text-gray-500">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
