"use client"

import React, { useState } from "react"
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  History, 
  PieChart, 
  Plus, 
  Store, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para la demostración
const subscriptionData = {
  stats: {
    activeSubscriptions: 18,
    totalRevenue: 5400000, // En pesos colombianos
    averageSubscriptionValue: 300000,
    pendingRenewals: 3
  },
  recentTransactions: [
    { id: "TX-12345", restaurant: "La Parrilla Gourmet", plan: "Premium", amount: 350000, status: "completed", date: "2025-05-28T10:23:15" },
    { id: "TX-12346", restaurant: "Sushi Express", plan: "Básico", amount: 120000, status: "pending", date: "2025-06-01T11:45:30" },
    { id: "TX-12347", restaurant: "Burger House", plan: "Estándar", amount: 250000, status: "completed", date: "2025-05-25T12:15:42" },
    { id: "TX-12348", restaurant: "Pasta Bella", plan: "Premium", amount: 350000, status: "completed", date: "2025-05-20T13:05:22" },
    { id: "TX-12349", restaurant: "Taco Loco", plan: "Básico", amount: 120000, status: "failed", date: "2025-05-18T13:30:18" }
  ],
  subscriptionPlans: [
    { 
      id: "plan-basic", 
      name: "Básico", 
      price: 120000, 
      features: [
        "Hasta 100 pedidos mensuales",
        "Panel de administración básico",
        "Seguimiento en tiempo real",
        "Soporte por email"
      ],
      restaurants: 6,
      color: "bg-blue-500"
    },
    { 
      id: "plan-standard", 
      name: "Estándar", 
      price: 250000, 
      features: [
        "Hasta 500 pedidos mensuales",
        "Panel de administración completo",
        "Seguimiento en tiempo real",
        "Notificaciones avanzadas",
        "Análisis básico de datos",
        "Soporte prioritario"
      ],
      restaurants: 8,
      color: "bg-heybox-primary"
    },
    { 
      id: "plan-premium", 
      name: "Premium", 
      price: 350000, 
      features: [
        "Pedidos ilimitados",
        "Panel de administración completo",
        "Seguimiento avanzado en tiempo real",
        "Notificaciones personalizadas",
        "Análisis avanzado con IA",
        "Soporte 24/7 prioritario",
        "Personalización de marca"
      ],
      restaurants: 4,
      color: "bg-heybox-secondary"
    }
  ],
  monthlyRevenue: [
    { month: "Enero", revenue: 2450000 },
    { month: "Febrero", revenue: 2800000 },
    { month: "Marzo", revenue: 3100000 },
    { month: "Abril", revenue: 3700000 },
    { month: "Mayo", revenue: 4200000 },
    { month: "Junio", revenue: 5400000 }
  ],
  planDistribution: [
    { plan: "Básico", count: 6, percentage: 33 },
    { plan: "Estándar", count: 8, percentage: 44 },
    { plan: "Premium", count: 4, percentage: 23 }
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
            {change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 text-sm ml-2">vs mes anterior</span>
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

// Componente para el estado de las transacciones
const TransactionStatus = ({ status }: { status: string }) => {
  let color = "bg-gray-100 text-gray-800"
  
  switch (status) {
    case "completed":
      color = "bg-green-100 text-green-800"
      break
    case "pending":
      color = "bg-yellow-100 text-yellow-800"
      break
    case "failed":
      color = "bg-red-100 text-red-800"
      break
  }
  
  const statusText = {
    completed: "Completado",
    pending: "Pendiente",
    failed: "Fallido"
  }[status] || status
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {statusText}
    </span>
  )
}

export default function SubscriptionsPage() {
  // Estado para filtrar transacciones
  const [filter, setFilter] = useState("all")
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Suscripciones</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Exportar Datos
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Plan
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Suscripciones Activas" 
          value={subscriptionData.stats.activeSubscriptions} 
          icon={<Store className="h-6 w-6" />} 
          change={12.5} 
          bgColor="bg-heybox-primary" 
        />
        <StatCard 
          title="Ingresos Mensuales" 
          value={formatCurrency(subscriptionData.stats.totalRevenue)} 
          icon={<DollarSign className="h-6 w-6" />} 
          change={28.6} 
          bgColor="bg-green-500" 
        />
        <StatCard 
          title="Valor Promedio" 
          value={formatCurrency(subscriptionData.stats.averageSubscriptionValue)} 
          icon={<CreditCard className="h-6 w-6" />} 
          change={5.2} 
          bgColor="bg-heybox-secondary" 
        />
        <StatCard 
          title="Renovaciones Pendientes" 
          value={subscriptionData.stats.pendingRenewals} 
          icon={<Calendar className="h-6 w-6" />} 
          bgColor="bg-yellow-500" 
        />
      </div>

      {/* Planes de suscripción */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Planes de Suscripción</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionData.subscriptionPlans.map((plan) => (
              <div key={plan.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`${plan.color} px-6 py-4 text-white`}>
                  <h4 className="text-xl font-bold">{plan.name}</h4>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(plan.price)}</p>
                  <p className="text-sm opacity-90">por mes</p>
                </div>
                <div className="px-6 py-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 flex-shrink-0 mr-2">✓</span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      <Users className="h-4 w-4 inline mr-1" />
                      {plan.restaurants} restaurantes
                    </span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis de suscripciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Ingresos por Suscripciones</h3>
            <div className="text-sm text-gray-500">
              <span className="font-medium text-heybox-primary">+28.6%</span> vs mes anterior
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-4 text-heybox-primary opacity-50" />
                <p className="text-gray-500">Aquí se mostrará la gráfica de ingresos mensuales</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm">
                <span className="font-medium w-24">Junio</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-4 overflow-hidden">
                  <div className="bg-heybox-primary h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-gray-600">{formatCurrency(subscriptionData.monthlyRevenue[5].revenue)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium w-24">Mayo</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-4 overflow-hidden">
                  <div className="bg-heybox-primary h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-gray-600">{formatCurrency(subscriptionData.monthlyRevenue[4].revenue)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium w-24">Abril</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-4 overflow-hidden">
                  <div className="bg-heybox-primary h-2.5 rounded-full" style={{ width: '69%' }}></div>
                </div>
                <span className="text-gray-600">{formatCurrency(subscriptionData.monthlyRevenue[3].revenue)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium w-24">Marzo</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-4 overflow-hidden">
                  <div className="bg-heybox-primary h-2.5 rounded-full" style={{ width: '57%' }}></div>
                </div>
                <span className="text-gray-600">{formatCurrency(subscriptionData.monthlyRevenue[2].revenue)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Distribución de Planes</h3>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative h-40 w-40">
                <div className="rounded-full h-full w-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0">
                    <div className="h-full w-full rounded-full border-8 border-transparent border-t-heybox-primary" style={{ transform: 'rotate(115deg)' }}></div>
                    <div className="h-full w-full rounded-full border-8 border-transparent border-t-heybox-secondary" style={{ transform: 'rotate(0deg)' }}></div>
                    <div className="h-full w-full rounded-full border-8 border-transparent border-t-blue-500" style={{ transform: 'rotate(-120deg)' }}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{subscriptionData.stats.activeSubscriptions}</p>
                    <p className="text-xs text-gray-500">Restaurantes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {subscriptionData.planDistribution.map((item, index) => (
                <div key={item.plan} className="flex items-center">
                  <div className={`h-4 w-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-heybox-primary' : 
                    'bg-heybox-secondary'
                  } mr-2`}></div>
                  <span className="text-sm font-medium">{item.plan}</span>
                  <span className="text-sm text-gray-500 ml-auto">{item.count} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de transacciones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2 sm:mb-0">Historial de Transacciones</h3>
            <div className="inline-flex rounded-md shadow-sm">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                onClick={() => setFilter("all")}
                className="rounded-r-none text-xs"
                size="sm"
              >
                Todos
              </Button>
              <Button 
                variant={filter === "completed" ? "default" : "outline"} 
                onClick={() => setFilter("completed")}
                className="rounded-none border-l-0 border-r-0 text-xs"
                size="sm"
              >
                Completados
              </Button>
              <Button 
                variant={filter === "pending" ? "default" : "outline"} 
                onClick={() => setFilter("pending")}
                className="rounded-none border-r-0 text-xs"
                size="sm"
              >
                Pendientes
              </Button>
              <Button 
                variant={filter === "failed" ? "default" : "outline"} 
                onClick={() => setFilter("failed")}
                className="rounded-l-none text-xs"
                size="sm"
              >
                Fallidos
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transacción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptionData.recentTransactions
                .filter(tx => filter === "all" || tx.status === filter)
                .map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-heybox-primary">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.restaurant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TransactionStatus status={transaction.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-heybox-primary">
                      <History className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button variant="link" className="text-heybox-primary hover:text-heybox-primary/80">
            Ver historial completo
          </Button>
        </div>
      </div>
    </div>
  )
}
