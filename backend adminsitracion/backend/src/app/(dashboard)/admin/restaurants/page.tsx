"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Star,
  Check,
  Ban
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Datos de ejemplo para los restaurantes
const restaurants = [
  {
    id: "rest1",
    name: "Burger Deluxe",
    logo: "/placeholder.jpg",
    address: "Calle 85 #15-29, Bogotá",
    phone: "+57 301 234 5678",
    email: "contacto@burgerdeluxe.co",
    status: "active",
    rating: 4.7,
    orders: 1240,
    revenue: 28500000,
    subscriptionStatus: "premium",
    joinDate: "2023-04-15"
  },
  {
    id: "rest2",
    name: "Pizza Heaven",
    logo: "/placeholder.jpg",
    address: "Carrera 11 #93-46, Bogotá",
    phone: "+57 302 345 6789",
    email: "info@pizzaheaven.co",
    status: "active",
    rating: 4.5,
    orders: 980,
    revenue: 22400000,
    subscriptionStatus: "standard",
    joinDate: "2023-05-20"
  },
  {
    id: "rest3",
    name: "Sushi Express",
    logo: "/placeholder.jpg",
    address: "Calle 116 #7-15, Bogotá",
    phone: "+57 303 456 7890",
    email: "contacto@sushiexpress.co",
    status: "inactive",
    rating: 4.2,
    orders: 560,
    revenue: 15600000,
    subscriptionStatus: "basic",
    joinDate: "2023-06-10"
  },
  {
    id: "rest4",
    name: "Taco Loco",
    logo: "/placeholder.jpg",
    address: "Carrera 15 #78-33, Bogotá",
    phone: "+57 304 567 8901",
    email: "hola@tacoloco.co",
    status: "pending",
    rating: 0,
    orders: 0,
    revenue: 0,
    subscriptionStatus: "trial",
    joinDate: "2023-07-05"
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

const statusLabels: Record<string, { label: string, color: string }> = {
  active: { label: "Activo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactivo", color: "bg-red-100 text-red-800" },
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" }
}

const subscriptionLabels: Record<string, { label: string, color: string }> = {
  premium: { label: "Premium", color: "bg-purple-100 text-purple-800" },
  standard: { label: "Estándar", color: "bg-blue-100 text-blue-800" },
  basic: { label: "Básico", color: "bg-gray-100 text-gray-800" },
  trial: { label: "Prueba", color: "bg-teal-100 text-teal-800" }
}

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [subscriptionFilter, setSubscriptionFilter] = useState<string | null>(null)

  // Filtrar restaurantes según criterios
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       restaurant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || restaurant.status === statusFilter
    const matchesSubscription = !subscriptionFilter || restaurant.subscriptionStatus === subscriptionFilter
    
    return matchesSearch && matchesStatus && matchesSubscription
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Restaurantes</h1>
        <Button className="mt-3 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Restaurante
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar restaurantes..."
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="mr-2 text-gray-400" size={18} />
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>
            <div className="flex items-center">
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={subscriptionFilter || ""}
                onChange={(e) => setSubscriptionFilter(e.target.value || null)}
              >
                <option value="">Todas las suscripciones</option>
                <option value="premium">Premium</option>
                <option value="standard">Estándar</option>
                <option value="basic">Básico</option>
                <option value="trial">Prueba</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de restaurantes */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suscripción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métricas
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRestaurants.map(restaurant => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {restaurant.logo ? (
                          <Image 
                            src={restaurant.logo}
                            alt={`Logo de ${restaurant.name}`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-500">
                            {restaurant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {restaurant.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex flex-col space-y-1">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> {restaurant.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> {restaurant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusLabels[restaurant.status].color}`}>
                      {statusLabels[restaurant.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriptionLabels[restaurant.subscriptionStatus].color}`}>
                      {subscriptionLabels[restaurant.subscriptionStatus].label}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Desde: {new Date(restaurant.joinDate).toLocaleDateString('es-CO')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {restaurant.status === 'active' ? (
                        <>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span>{restaurant.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Pedidos: {restaurant.orders.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Ingresos: {formatCurrency(restaurant.revenue)}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">No disponible</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      {restaurant.status === 'active' && (
                        <Link href={`/admin/restaurants/${restaurant.id}`} className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      {restaurant.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {restaurant.status === 'active' && (
                        <button className="text-red-600 hover:text-red-800">
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-800">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
