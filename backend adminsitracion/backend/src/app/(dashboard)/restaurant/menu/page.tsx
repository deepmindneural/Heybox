"use client"

import React, { useState } from "react"
import { 
  Search, 
  PlusCircle, 
  X, 
  Edit, 
  Trash, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Camera,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Datos de ejemplo para las categorías y productos
const exampleCategories = [
  { id: "cat1", name: "Hamburguesas", count: 8 },
  { id: "cat2", name: "Pizzas", count: 6 },
  { id: "cat3", name: "Bebidas", count: 12 },
  { id: "cat4", name: "Postres", count: 5 },
  { id: "cat5", name: "Combos", count: 4 },
  { id: "cat6", name: "Entradas", count: 7 }
]

const exampleProducts = [
  { 
    id: "prod1", 
    name: "Hamburguesa Especial", 
    description: "Doble carne, queso, lechuga, tomate, cebolla y salsa especial",
    price: 25000,
    image: "/placeholder.jpg",
    category: "cat1",
    available: true,
    popular: true
  },
  { 
    id: "prod2", 
    name: "Pizza Hawaiana Familiar", 
    description: "Jamón, piña y queso mozzarella",
    price: 45000,
    image: "/placeholder.jpg",
    category: "cat2",
    available: true,
    popular: true
  },
  { 
    id: "prod3", 
    name: "Refresco de Cola", 
    description: "Bebida gaseosa 500ml",
    price: 5000,
    image: "/placeholder.jpg",
    category: "cat3",
    available: true,
    popular: false
  },
  { 
    id: "prod4", 
    name: "Brownie con Helado", 
    description: "Brownie de chocolate con helado de vainilla",
    price: 12000,
    image: "/placeholder.jpg",
    category: "cat4",
    available: true,
    popular: false
  },
  { 
    id: "prod5", 
    name: "Combo Familiar", 
    description: "2 hamburguesas, 1 pizza mediana, 4 refrescos y 2 postres",
    price: 85000,
    image: "/placeholder.jpg",
    category: "cat5",
    available: true,
    popular: true
  },
  { 
    id: "prod6", 
    name: "Papas Fritas", 
    description: "Porción grande de papas fritas con salsa",
    price: 8000,
    image: "/placeholder.jpg",
    category: "cat6",
    available: false,
    popular: false
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

interface ProductCardProps {
  product: any
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleAvailability: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${!product.available ? 'opacity-60' : ''}`}>
      <div className="relative h-40 bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {product.popular && (
          <span className="absolute top-2 right-2 bg-heybox-secondary text-white text-xs px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-heybox-primary">{formatCurrency(product.price)}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.available ? 'Disponible' : 'No disponible'}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => onToggleAvailability(product.id)}
          >
            {product.available ? 'Deshabilitar' : 'Habilitar'}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(product.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDelete(product.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showUnavailable, setShowUnavailable] = useState(true)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [products, setProducts] = useState(exampleProducts)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  // Filtrar productos según criterios
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const isVisible = showUnavailable || product.available
    
    return matchesSearch && matchesCategory && isVisible
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price
    } else {
      return b.price - a.price
    }
  })

  // Función para manejar edición de producto
  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      setEditingProduct(product)
      setShowModal(true)
    }
  }

  // Función para manejar eliminación de producto
  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  // Función para cambiar disponibilidad
  const handleToggleAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ))
  }

  // Función para manejar creación de nuevo producto
  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menú del Restaurante</h1>
        <Button 
          onClick={handleAddProduct}
          className="mt-3 sm:mt-0"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="mr-2 text-gray-400" size={18} />
              <select 
                className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-heybox-primary"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Todas las categorías</option>
                {exampleCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="hidden sm:flex"
              title={sortOrder === 'asc' ? 'Precio: menor a mayor' : 'Precio: mayor a menor'}
            >
              {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showUnavailable"
              checked={showUnavailable}
              onChange={() => setShowUnavailable(!showUnavailable)}
              className="rounded text-heybox-primary focus:ring-heybox-primary h-4 w-4"
            />
            <label htmlFor="showUnavailable" className="ml-2 text-sm text-gray-700">
              Mostrar productos no disponibles
            </label>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-1 text-gray-400" size={16} />
            <span className="text-sm text-gray-700">Precio: </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder('asc')}
              className={`text-xs ${sortOrder === 'asc' ? 'font-bold text-heybox-primary' : ''}`}
            >
              Menor a mayor
            </Button>
            <span className="text-sm text-gray-400">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder('desc')}
              className={`text-xs ${sortOrder === 'desc' ? 'font-bold text-heybox-primary' : ''}`}
            >
              Mayor a menor
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onToggleAvailability={handleToggleAvailability}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Prueba con otra búsqueda o cambia los filtros." : "Agrega productos a tu menú para empezar."}
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
      
      {/* Sección de sugerencias para menús especiales - Similar al sistema de créditos */}
      <div className="mt-8 bg-gradient-to-r from-heybox-primary/10 to-heybox-secondary/10 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sugerencias para tu menú</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-heybox-primary/20">
            <h3 className="font-medium text-heybox-primary mb-2">Menú festivo</h3>
            <p className="text-sm text-gray-600 mb-3">
              Aprovecha las festividades para ofrecer platos especiales y aumentar tus ventas.
            </p>
            <Button variant="outline" size="sm" className="text-heybox-primary border-heybox-primary/50">
              Ver ideas para festividades
            </Button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-heybox-secondary/20">
            <h3 className="font-medium text-heybox-secondary mb-2">Análisis de rendimiento</h3>
            <p className="text-sm text-gray-600 mb-3">
              Descubre qué platos generan más ingresos y optimiza tu menú.
            </p>
            <Button variant="outline" size="sm" className="text-heybox-secondary border-heybox-secondary/50">
              Ver análisis de menú
            </Button>
          </div>
        </div>
      </div>

      {/* Modal formulario - en una implementación real usarías un componente modal adecuado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                  defaultValue={editingProduct?.name || ""}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea 
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                  rows={3}
                  defaultValue={editingProduct?.description || ""}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input 
                    type="number" 
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                    defaultValue={editingProduct?.price || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select 
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3"
                    defaultValue={editingProduct?.category || ""}
                  >
                    {exampleCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="available"
                    className="rounded text-heybox-primary focus:ring-heybox-primary h-4 w-4"
                    defaultChecked={editingProduct?.available ?? true}
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="popular"
                    className="rounded text-heybox-primary focus:ring-heybox-primary h-4 w-4"
                    defaultChecked={editingProduct?.popular ?? false}
                  />
                  <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                    Popular
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                <div className="mt-1 flex items-center">
                  <div className="mr-4 h-16 w-16 flex-shrink-0 border border-gray-300 bg-gray-100 flex items-center justify-center rounded-md">
                    {editingProduct?.image ? (
                      <Image
                        src={editingProduct.image}
                        alt="Imagen del producto"
                        width={64}
                        height={64}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline" type="button">
                    Seleccionar imagen
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // En una implementación real, aquí guardarías los cambios
                    setShowModal(false)
                  }}
                >
                  {editingProduct ? "Guardar cambios" : "Crear producto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
