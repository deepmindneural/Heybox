"use client"

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Clock, Phone, MapPin, Package, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Importar el componente de mapa con carga dinámica para evitar problemas SSR
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
})

// Datos de ejemplo para el seguimiento
type DeliveryStatus = 'preparando' | 'empacado' | 'en_camino' | 'cerca' | 'entregado'

interface TrackingStep {
  id: DeliveryStatus
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  current: boolean
  time?: string
}

interface DeliveryLocation {
  customer: {
    name: string
    address: string
    phone: string
    location: [number, number] // [latitud, longitud]
    distance: number // en metros
  }
  restaurant: {
    name: string
    address: string
    location: [number, number] // [latitud, longitud]
  }
  driver?: {
    name: string
    phone: string
    location: [number, number] // [latitud, longitud]
    eta?: number // tiempo estimado en minutos
  }
}

// Función para generar los pasos de seguimiento según el estado actual
const getTrackingSteps = (status: DeliveryStatus): TrackingStep[] => {
  const steps: TrackingStep[] = [
    {
      id: 'preparando',
      title: 'Preparando',
      description: 'Tu pedido está siendo preparado',
      icon: <Package className="h-6 w-6" />,
      completed: false,
      current: false,
      time: '12:30'
    },
    {
      id: 'empacado',
      title: 'Empacado',
      description: 'Tu pedido está listo para salir',
      icon: <Package className="h-6 w-6" />,
      completed: false,
      current: false,
      time: '12:45'
    },
    {
      id: 'en_camino',
      title: 'En camino',
      description: 'El repartidor va en camino',
      icon: <Truck className="h-6 w-6" />,
      completed: false,
      current: false,
      time: '12:50'
    },
    {
      id: 'cerca',
      title: 'Cerca',
      description: 'El repartidor está cerca de tu ubicación',
      icon: <MapPin className="h-6 w-6" />,
      completed: false,
      current: false,
      time: '13:05'
    },
    {
      id: 'entregado',
      title: 'Entregado',
      description: 'Tu pedido ha sido entregado',
      icon: <CheckCircle className="h-6 w-6" />,
      completed: false,
      current: false
    }
  ]

  // Actualizar el estado de los pasos según el estado actual
  const statusIndex = steps.findIndex(step => step.id === status)
  
  for (let i = 0; i < steps.length; i++) {
    if (i < statusIndex) {
      steps[i].completed = true
      steps[i].current = false
    } else if (i === statusIndex) {
      steps[i].completed = false
      steps[i].current = true
    } else {
      steps[i].completed = false
      steps[i].current = false
    }
  }

  return steps
}

export function OrderTracking({ 
  orderId = 'ORD-7857',
  currentStatus = 'en_camino' as DeliveryStatus
}) {
  const [status, setStatus] = useState<DeliveryStatus>(currentStatus)
  
  // Datos de ejemplo para la ubicación
  const deliveryData: DeliveryLocation = {
    customer: {
      name: 'Daniel Martínez',
      address: 'Calle 93 #19-55, Bogotá',
      phone: '+57 315 987 6543',
      location: [4.6769, -74.0481], // Ubicación del cliente (ejemplo)
      distance: 1200 // 1.2 km
    },
    restaurant: {
      name: 'HeyBox Restaurant',
      address: 'Calle 85 #15-32, Bogotá',
      location: [4.6711, -74.0539] // Ubicación del restaurante (ejemplo)
    },
    driver: {
      name: 'Carlos Ramírez',
      phone: '+57 312 456 7890',
      location: [4.6732, -74.0510], // Ubicación actual del repartidor (ejemplo)
      eta: 15 // 15 minutos
    }
  }

  // Obtener los pasos de seguimiento según el estado actual
  const trackingSteps = getTrackingSteps(status)
  
  // Para simular cambios en el estado (solo para demo)
  const handleAdvanceStatus = () => {
    const statusOrder: DeliveryStatus[] = ['preparando', 'empacado', 'en_camino', 'cerca', 'entregado']
    const currentIndex = statusOrder.indexOf(status)
    if (currentIndex < statusOrder.length - 1) {
      setStatus(statusOrder[currentIndex + 1])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Seguimiento de Pedido</h3>
          <span className="text-sm text-gray-500">{orderId}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {/* Mapa de seguimiento */}
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <DeliveryMap 
              customers={[
                {
                  id: '1',
                  name: deliveryData.customer.name,
                  orderId: orderId,
                  distance: deliveryData.customer.distance,
                  eta: `${deliveryData.driver?.eta || 15} min`,
                  latitude: deliveryData.customer.location[0],
                  longitude: deliveryData.customer.location[1]
                }
              ]}
              restaurantLocation={deliveryData.restaurant.location}
            />
          </div>
          
          {/* Información del repartidor */}
          {status === 'en_camino' || status === 'cerca' ? (
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Repartidor: {deliveryData.driver?.name}</h4>
                  <p className="text-sm text-gray-500">Llegará en aproximadamente {deliveryData.driver?.eta} minutos</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                Llamar
              </Button>
            </div>
          ) : null}

          {/* Pasos de seguimiento */}
          <div className="space-y-6">
            <h4 className="font-medium">Estado del pedido</h4>
            <div className="relative">
              {/* Línea de progreso */}
              <div className="absolute left-5 top-0 w-px h-full bg-gray-200"></div>
              
              {/* Pasos */}
              <div className="space-y-8">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="relative flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                      step.completed ? 'bg-green-100 text-green-600' : 
                      step.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="ml-4">
                      <h5 className="font-medium">{step.title}</h5>
                      <p className="text-sm text-gray-500">{step.description}</p>
                      {step.time && <p className="text-xs text-gray-400 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.time}
                      </p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dirección de entrega</h4>
              <p className="text-sm">{deliveryData.customer.address}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Contacto</h4>
              <p className="text-sm">{deliveryData.customer.phone}</p>
            </div>
          </div>
          
          {/* Solo para demostración: botón para avanzar estado */}
          <div className="border-t pt-4">
            <Button 
              className="w-full"
              onClick={handleAdvanceStatus}
              disabled={status === 'entregado'}
            >
              {status === 'entregado' ? 'Pedido Completado' : 'Actualizar Estado (Demo)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
