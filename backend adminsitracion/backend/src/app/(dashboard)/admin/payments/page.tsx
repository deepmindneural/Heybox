"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Search,
  Download,
  Filter,
  CalendarRange,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para los pagos
const payments = [
  {
    id: "pay1",
    restaurantId: "rest1",
    restaurantName: "Burger Deluxe",
    amount: 150000,
    status: "completed",
    type: "subscription",
    plan: "premium",
    date: "2023-08-15T10:30:00",
    invoiceNumber: "INV-2023-001",
    paymentMethod: "tarjeta",
    cardLast4: "4242"
  },
  {
    id: "pay2",
    restaurantId: "rest2",
    restaurantName: "Pizza Heaven",
    amount: 100000,
    status: "completed",
    type: "subscription",
    plan: "standard",
    date: "2023-08-10T14:20:00",
    invoiceNumber: "INV-2023-002",
    paymentMethod: "transferencia",
    reference: "REF78932"
  },
  {
    id: "pay3",
    restaurantId: "rest3",
    restaurantName: "Sushi Express",
    amount: 50000,
    status: "completed",
    type: "subscription",
    plan: "basic",
    date: "2023-08-05T09:15:00",
    invoiceNumber: "INV-2023-003",
    paymentMethod: "tarjeta",
    cardLast4: "9876"
  },
  {
    id: "pay4",
    restaurantId: "rest1",
    restaurantName: "Burger Deluxe",
    amount: 25000,
    status: "pending",
    type: "fee",
    description: "Comisión por ventas extra",
    date: "2023-08-18T16:45:00",
    invoiceNumber: "INV-2023-004",
    paymentMethod: "pendiente"
  },
  {
    id: "pay5",
    restaurantId: "rest4",
    restaurantName: "Taco Loco",
    amount: 0,
    status: "waived",
    type: "subscription",
    plan: "trial",
    description: "Período de prueba gratuito",
    date: "2023-08-01T11:30:00",
    invoiceNumber: "INV-2023-005",
    paymentMethod: "n/a"
  },
  {
    id: "pay6",
    restaurantId: "rest2",
    restaurantName: "Pizza Heaven",
    amount: 20000,
    status: "failed",
    type: "fee",
    description: "Comisión por ventas - Intento fallido",
    date: "2023-08-16T13:20:00",
    invoiceNumber: "INV-2023-006",
    paymentMethod: "tarjeta",
    cardLast4: "5678",
    failureReason: "Fondos insuficientes"
  }
]

// Función para formatear cantidades de dinero en pesos colombianos
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Configuración de estados y tipos de pago
const statusLabels: Record<string, { label: string, color: string, icon: React.ReactNode }> = {
  completed: { 
    label: "Completado", 
    color: "bg-green-100 text-green-800", 
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
  pending: { 
    label: "Pendiente", 
    color: "bg-yellow-100 text-yellow-800", 
    icon: <Clock className="h-4 w-4 text-yellow-500" />
  },
  failed: { 
    label: "Fallido", 
    color: "bg-red-100 text-red-800", 
    icon: <AlertCircle className="h-4 w-4 text-red-500" />
  },
  waived: { 
    label: "Condonado", 
    color: "bg-blue-100 text-blue-800", 
    icon: <CheckCircle className="h-4 w-4 text-blue-500" />
  }
}

const typeLabels: Record<string, { label: string, color: string }> = {
  subscription: { label: "Suscripción", color: "bg-purple-100 text-purple-800" },
  fee: { label: "Comisión", color: "bg-blue-100 text-blue-800" }
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  // Filtrar pagos según criterios
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || payment.status === statusFilter
    const matchesType = !typeFilter || payment.type === typeFilter
    
    // Filtro de fecha simplificado (en realidad necesitarías una librería como date-fns para esto)
    let matchesDate = true
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      matchesDate = payment.date.startsWith(today)
    } else if (dateFilter === 'week') {
      // Implementación simplificada - en producción usarías una lógica más robusta
      const paymentDate = new Date(payment.date)
      const now = new Date()
      const weekAgo = new Date(now.setDate(now.getDate() - 7))
      matchesDate = paymentDate >= weekAgo
    } else if (dateFilter === 'month') {
      const currentMonth = new Date().getMonth() + 1
      const paymentMonth = new Date(payment.date).getMonth() + 1
      matchesDate = currentMonth === paymentMonth
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  }).sort((a, b) => {
    // Ordenar por fecha
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  })

  // Total de ingresos filtrados
  const totalAmount = filteredPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
        <Button variant="outline" className="mt-3 sm:mt-0">
          <Download className="h-4 w-4 mr-2" />
          Exportar Pagos
        </Button>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500">Total Recaudado (filtrado)</div>
          <div className="mt-1 text-2xl font-semibold text-heybox-primary">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500">Pagos Pendientes</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-500">
            {formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500">Pagos Fallidos</div>
          <div className="mt-1 text-2xl font-semibold text-red-500">
            {formatCurrency(payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0))}
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por restaurante o factura..."
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <Filter className="mr-2 text-gray-400" size={18} />
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">Todos los estados</option>
                <option value="completed">Completados</option>
                <option value="pending">Pendientes</option>
                <option value="failed">Fallidos</option>
                <option value="waived">Condonados</option>
              </select>
            </div>
            <div className="flex items-center">
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={typeFilter || ""}
                onChange={(e) => setTypeFilter(e.target.value || null)}
              >
                <option value="">Todos los tipos</option>
                <option value="subscription">Suscripciones</option>
                <option value="fee">Comisiones</option>
              </select>
            </div>
            <div className="flex items-center">
              <CalendarRange className="mr-2 text-gray-400" size={18} />
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={dateFilter || ""}
                onChange={(e) => setDateFilter(e.target.value || null)}
              >
                <option value="">Cualquier fecha</option>
                <option value="today">Hoy</option>
                <option value="week">Última semana</option>
                <option value="month">Este mes</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
            >
              {sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de pagos */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.invoiceNumber}</div>
                    <div className="text-xs text-gray-500">
                      {payment.paymentMethod === 'tarjeta' && (
                        <div className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" /> 
                          Tarjeta •••• {payment.cardLast4}
                        </div>
                      )}
                      {payment.paymentMethod === 'transferencia' && (
                        <div>Ref: {payment.reference}</div>
                      )}
                      {payment.paymentMethod === 'pendiente' && (
                        <div>Pago pendiente</div>
                      )}
                      {payment.paymentMethod === 'n/a' && (
                        <div>No aplica</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.restaurantName}</div>
                    <div className="text-xs text-gray-500">ID: {payment.restaurantId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString('es-CO')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleTimeString('es-CO', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeLabels[payment.type].color}`}>
                      {typeLabels[payment.type].label}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.type === 'subscription' && payment.plan && (
                        <span>Plan: {payment.plan}</span>
                      )}
                      {payment.description && (
                        <span>{payment.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {statusLabels[payment.status].icon}
                      <span className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusLabels[payment.status].color}`}>
                        {statusLabels[payment.status].label}
                      </span>
                    </div>
                    {payment.status === 'failed' && payment.failureReason && (
                      <div className="text-xs text-red-500 mt-1">
                        {payment.failureReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      payment.status === 'completed' ? 'text-green-600' : 
                      payment.status === 'pending' ? 'text-yellow-600' :
                      payment.status === 'failed' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link 
                        href={`/admin/payments/${payment.id}`} 
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <FileText className="h-4 w-4" />
                      </Link>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Descargar factura"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pagos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Prueba con otros filtros o elimina la búsqueda.
          </p>
          {searchTerm && (
            <div className="mt-6">
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="text-sm"
              >
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
