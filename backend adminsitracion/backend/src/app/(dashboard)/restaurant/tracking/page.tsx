"use client"

import React, { useState } from "react"
import { Search, Package, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderTracking } from "@/components/OrderTracking"
import Link from "next/link"

// Datos de ejemplo para pedidos
const exampleOrders = [
  {
    id: "ORD-7859",
    customer: "Alejandro Gómez",
    status: "preparando",
    date: "2025-06-01T12:34:56",
    address: "Calle 85 #15-32, Bogotá",
  },
  {
    id: "ORD-7858",
    customer: "Camila Rodríguez",
    status: "entregado",
    date: "2025-06-01T11:20:36",
    address: "Carrera 11 #94-75, Bogotá",
  },
  {
    id: "ORD-7857",
    customer: "Daniel Martínez",
    status: "en_camino",
    date: "2025-06-01T10:45:22",
    address: "Calle 93 #19-55, Bogotá",
  },
  {
    id: "ORD-7856",
    customer: "Valentina López",
    status: "empacado",
    date: "2025-06-01T09:30:15",
    address: "Carrera 7 #72-41, Bogotá",
  },
  {
    id: "ORD-7855",
    customer: "Sebastián Herrera",
    status: "cerca",
    date: "2025-06-01T08:15:42",
    address: "Calle 100 #15-82, Bogotá",
  }
]

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

// Función para obtener color del estado
const getStatusColor = (status: string) => {
  const colors = {
    preparando: "bg-yellow-500",
    empacado: "bg-purple-500",
    en_camino: "bg-blue-500",
    cerca: "bg-orange-500",
    entregado: "bg-green-500"
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
};

// Función para obtener etiqueta del estado
const getStatusLabel = (status: string) => {
  const labels = {
    preparando: "Preparando",
    empacado: "Empacado",
    en_camino: "En camino",
    cerca: "Cerca",
    entregado: "Entregado"
  };
  return labels[status as keyof typeof labels] || status;
};

export default function TrackingPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar pedidos según el término de búsqueda
  const filteredOrders = exampleOrders.filter(order => {
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

  // Obtener el pedido seleccionado
  const orderDetails = selectedOrder 
    ? exampleOrders.find(order => order.id === selectedOrder) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seguimiento de Pedidos</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoy
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o dirección..."
            className="pl-9 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vista principal: Lista de pedidos y detalles de seguimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de pedidos en seguimiento */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Pedidos Activos</h3>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedOrder === order.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedOrder(order.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{order.customer}</h4>
                    <p className="text-sm text-gray-500">{order.id}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{order.address}</p>
              </div>
            ))}
            
            {filteredOrders.length === 0 && (
              <div className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron pedidos con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel de seguimiento detallado */}
        <div className="lg:col-span-2">
          {orderDetails ? (
            <OrderTracking 
              orderId={orderDetails.id} 
              currentStatus={orderDetails.status as any} 
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center p-6">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin pedido seleccionado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona un pedido de la lista para ver su seguimiento en tiempo real
                </p>
                <div className="mt-6">
                  <Link href="/restaurant/orders">
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Ir a Gestión de Pedidos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
