"use client"

import React, { useState } from "react"
import { 
  Clock, 
  Filter, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Bike,
  Package,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para pedidos
const exampleOrders = [
  {
    id: "ORD-7859",
    customer: "Alejandro Gómez",
    items: 4,
    total: 37500,
    status: "Preparando",
    statusColor: "bg-yellow-500",
    date: "2025-06-01T12:34:56",
    phone: "+57 311 456 7890",
    address: "Calle 85 #15-32, Bogotá",
    paymentMethod: "Tarjeta de crédito",
    items: [
      { id: 1, name: "Hamburguesa Clásica", price: 12000, quantity: 1 },
      { id: 2, name: "Papas Fritas Grandes", price: 7500, quantity: 1 },
      { id: 3, name: "Coca-Cola 500ml", price: 5000, quantity: 2 }
    ]
  },
  {
    id: "ORD-7858",
    customer: "Camila Rodríguez",
    items: 2,
    total: 26000,
    status: "Entregado",
    statusColor: "bg-green-500",
    date: "2025-06-01T11:20:36",
    phone: "+57 300 123 4567",
    address: "Carrera 11 #94-75, Bogotá",
    paymentMethod: "Efectivo",
    items: [
      { id: 4, name: "Pizza Vegetariana", price: 18000, quantity: 1 },
      { id: 5, name: "Gaseosa Familiar", price: 8000, quantity: 1 }
    ]
  },
  {
    id: "ORD-7857",
    customer: "Daniel Martínez",
    items: 3,
    total: 45000,
    status: "En camino",
    statusColor: "bg-blue-500",
    date: "2025-06-01T10:45:22",
    phone: "+57 315 987 6543",
    address: "Calle 93 #19-55, Bogotá",
    paymentMethod: "Transferencia bancaria",
    items: [
      { id: 6, name: "Pollo Asado Completo", price: 28000, quantity: 1 },
      { id: 7, name: "Ensalada César", price: 12000, quantity: 1 },
      { id: 8, name: "Jugo Natural", price: 5000, quantity: 1 }
    ]
  },
  {
    id: "ORD-7856",
    customer: "Valentina López",
    items: 2,
    total: 32500,
    status: "Listo para recoger",
    statusColor: "bg-purple-500",
    date: "2025-06-01T09:30:15",
    phone: "+57 320 765 4321",
    address: "Carrera 7 #72-41, Bogotá",
    paymentMethod: "Tarjeta de débito",
    items: [
      { id: 9, name: "Wrap de Pollo", price: 15000, quantity: 1 },
      { id: 10, name: "Combo Postre + Café", price: 17500, quantity: 1 }
    ]
  },
  {
    id: "ORD-7855",
    customer: "Sebastián Herrera",
    items: 5,
    total: 68000,
    status: "Cancelado",
    statusColor: "bg-red-500",
    date: "2025-06-01T08:15:42",
    phone: "+57 310 234 5678",
    address: "Calle 100 #15-82, Bogotá",
    paymentMethod: "Tarjeta de crédito",
    items: [
      { id: 11, name: "Parrillada Familiar", price: 48000, quantity: 1 },
      { id: 12, name: "Papas Fritas Familiares", price: 12000, quantity: 1 },
      { id: 13, name: "Refresco 2L", price: 8000, quantity: 1 }
    ]
  }
]

// Función para formatear precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
}

// Función para formatear fecha
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar pedidos según los criterios seleccionados
  const filteredOrders = exampleOrders.filter(order => {
    // Filtrar por estado si hay uno seleccionado
    if (filterStatus && order.status !== filterStatus) {
      return false;
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Obtener el pedido seleccionado para mostrar detalles
  const orderDetails = selectedOrder 
    ? exampleOrders.find(order => order.id === selectedOrder) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoy
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Barra de filtros y búsqueda */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o dirección..."
            className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Estado
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown de estados (simplificado) */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
              <div className="py-1">
                {["Todos", "Preparando", "Listo para recoger", "En camino", "Entregado", "Cancelado"].map((status) => (
                  <button
                    key={status}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setFilterStatus(status === "Todos" ? null : status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vista principal: Lista de pedidos y detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de pedidos */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">Pedido</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500 tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedOrder === order.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full text-white ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron pedidos con los filtros seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredOrders.length}</span> de <span className="font-medium">{exampleOrders.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-primary hover:bg-gray-50"
                  >
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de detalles del pedido */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          {orderDetails ? (
            <div className="h-full flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Detalles del Pedido</h3>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${orderDetails.statusColor}`}>
                    {orderDetails.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{orderDetails.id}</p>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                    <p className="mt-1">{orderDetails.customer}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Contacto</h4>
                    <p className="mt-1">{orderDetails.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dirección</h4>
                    <p className="mt-1">{orderDetails.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Método de Pago</h4>
                    <p className="mt-1">{orderDetails.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha y Hora</h4>
                    <p className="mt-1">{formatDate(orderDetails.date)}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Productos</h4>
                    <ul className="space-y-3">
                      {orderDetails.items.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <div>
                            <span className="text-sm font-medium">{item.name}</span>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                          </div>
                          <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">{formatPrice(orderDetails.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  
                  {orderDetails.status === "Preparando" && (
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Listo
                    </Button>
                  )}
                  
                  {orderDetails.status === "Listo para recoger" && (
                    <Button>
                      <Bike className="h-4 w-4 mr-2" />
                      En camino
                    </Button>
                  )}
                  
                  {orderDetails.status === "En camino" && (
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Entregado
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin pedido seleccionado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un pedido de la lista para ver sus detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
