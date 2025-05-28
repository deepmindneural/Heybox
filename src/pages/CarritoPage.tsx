import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import type { Producto, ProductoPedido, Restaurante } from '../types';

interface ItemCarrito extends ProductoPedido {
  nombreProducto: string;
  imagenProducto?: string;
  restauranteId: string;
  restauranteNombre: string;
}

const CarritoPage: React.FC = () => {
  const navigate = useNavigate();
  const [itemsCarrito, setItemsCarrito] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [impuestos, setImpuestos] = useState(0);
  const [propina, setPropina] = useState(0);
  const [porcentajePropina, setPorcentajePropina] = useState(10); // 10% por defecto
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'efectivo'>('tarjeta');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar carrito de localStorage (simula obtener datos del backend)
  useEffect(() => {
    try {
      // En un caso real, esto vendría del contexto de carrito o una llamada a la API
      // Por ahora simulamos con datos de ejemplo
      const itemsEjemplo: ItemCarrito[] = [
        {
          producto: '101',
          nombreProducto: 'Hamburguesa Clásica',
          imagenProducto: 'https://via.placeholder.com/100',
          cantidad: 2,
          precio: 12000,
          opciones: ['Queso Cheddar', 'Bacon'],
          restauranteId: '1',
          restauranteNombre: 'El Buen Sabor'
        },
        {
          producto: '102',
          nombreProducto: 'Papas Fritas',
          imagenProducto: 'https://via.placeholder.com/100',
          cantidad: 1,
          precio: 5000,
          opciones: ['Tamaño grande', 'Salsa BBQ'],
          restauranteId: '1',
          restauranteNombre: 'El Buen Sabor'
        },
        {
          producto: '104',
          nombreProducto: 'Refresco',
          imagenProducto: 'https://via.placeholder.com/100',
          cantidad: 2,
          precio: 3500,
          opciones: ['Cola', 'Tamaño mediano'],
          restauranteId: '1',
          restauranteNombre: 'El Buen Sabor'
        }
      ];
      
      setItemsCarrito(itemsEjemplo);
      
      // Obtener información del restaurante
      const restauranteEjemplo = {
        _id: '1',
        nombre: 'El Buen Sabor',
        descripcion: 'Restaurante de comida casera con los mejores platos tradicionales.',
        direccion: {
          calle: 'Calle Principal 123',
          ciudad: 'Ciudad Ejemplo',
          codigoPostal: '12345',
          coordenadas: { lat: 4.6682, lng: -74.0521 }
        },
        telefono: '123-456-7890',
        horario: {
          lunes: { apertura: '08:00', cierre: '20:00' },
          martes: { apertura: '08:00', cierre: '20:00' },
          miercoles: { apertura: '08:00', cierre: '20:00' },
          jueves: { apertura: '08:00', cierre: '20:00' },
          viernes: { apertura: '08:00', cierre: '22:00' },
          sabado: { apertura: '09:00', cierre: '22:00' },
          domingo: { apertura: '09:00', cierre: '18:00' }
        },
        logo: 'https://via.placeholder.com/150',
        categoria: 'comida rápida',
        calificacion: 4.5,
        numeroCalificaciones: 120,
        activo: true,
        usuario: '123'
      } as Restaurante;
      
      setRestaurante(restauranteEjemplo);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
    }
  }, []);
  
  // Calcular totales
  useEffect(() => {
    if (!itemsCarrito.length) return;
    
    const subtotalCalculado = itemsCarrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const impuestosCalculados = Math.round(subtotalCalculado * 0.19); // IVA 19%
    const propinaCalculada = Math.round(subtotalCalculado * (porcentajePropina / 100));
    const totalCalculado = subtotalCalculado + impuestosCalculados + propinaCalculada;
    
    setSubtotal(subtotalCalculado);
    setImpuestos(impuestosCalculados);
    setPropina(propinaCalculada);
    setTotal(totalCalculado);
  }, [itemsCarrito, porcentajePropina]);
  
  // Cambiar cantidad de un item
  const cambiarCantidad = (itemId: string, incremento: number) => {
    setItemsCarrito(prevItems => {
      return prevItems.map(item => {
        if (item.producto === itemId) {
          const nuevaCantidad = Math.max(1, item.cantidad + incremento);
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      });
    });
  };
  
  // Eliminar item del carrito
  const eliminarItem = (itemId: string) => {
    setItemsCarrito(prevItems => prevItems.filter(item => item.producto !== itemId));
  };
  
  // Cambiar porcentaje de propina
  const cambiarPropina = (porcentaje: number) => {
    setPorcentajePropina(porcentaje);
  };
  
  // Formatear precio
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };
  
  // Finalizar pedido
  const finalizarPedido = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Aquí iría la lógica para enviar el pedido al backend
      // Por ahora, simulamos una pausa
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir a la página de confirmación
      navigate('/pedido-confirmado');
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };
  
  if (itemsCarrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <FiShoppingCart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Agrega productos de nuestros restaurantes para comenzar un pedido.</p>
            <Link 
              to="/restaurantes" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500"
            >
              <FiArrowLeft className="mr-2" /> Explorar restaurantes
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to={`/restaurante/${restaurante?._id}`} className="text-cyan-600 hover:text-cyan-800 flex items-center">
            <FiArrowLeft className="mr-1" /> 
            <span>Volver a {restaurante?.nombre}</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 ml-auto">Tu Pedido</h1>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista de productos */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-white">
                <h2 className="text-lg font-semibold flex items-center">
                  <FiShoppingCart className="mr-2" /> Productos en tu carrito
                </h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {itemsCarrito.map(item => (
                  <li key={item.producto} className="p-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.imagenProducto || 'https://via.placeholder.com/100'}
                        alt={item.nombreProducto}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.nombreProducto}</h3>
                          <p className="ml-4">{formatearPrecio(item.precio * item.cantidad)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{formatearPrecio(item.precio)} c/u</p>
                      </div>
                      
                      {item.opciones && item.opciones.length > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.opciones.join(', ')}
                        </p>
                      )}
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center">
                          <button 
                            onClick={() => cambiarCantidad(item.producto as string, -1)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="mx-2 font-medium">{item.cantidad}</span>
                          <button 
                            onClick={() => cambiarCantidad(item.producto as string, 1)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => eliminarItem(item.producto as string)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Resumen del pedido */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-white">
                <h2 className="text-lg font-semibold">Resumen del pedido</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium text-gray-900">{formatearPrecio(subtotal)}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">IVA (19%)</p>
                    <p className="font-medium text-gray-900">{formatearPrecio(impuestos)}</p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-gray-600 text-sm mb-2">Propina ({porcentajePropina}%)</p>
                    <div className="flex gap-2 mb-2">
                      {[0, 5, 10, 15, 20].map(percent => (
                        <button
                          key={percent}
                          onClick={() => cambiarPropina(percent)}
                          className={`px-3 py-1 rounded-full text-xs ${porcentajePropina === percent 
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                    <p className="text-right font-medium text-gray-900">{formatearPrecio(propina)}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="font-semibold">Total</p>
                    <p className="font-bold text-lg text-gray-900">{formatearPrecio(total)}</p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-gray-600 text-sm mb-2">Método de pago</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMetodoPago('tarjeta')}
                        className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${metodoPago === 'tarjeta' 
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <FiCreditCard className="mr-2" /> Tarjeta
                      </button>
                      
                      <button
                        onClick={() => setMetodoPago('efectivo')}
                        className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${metodoPago === 'efectivo' 
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <FiDollarSign className="mr-2" /> Efectivo
                      </button>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={finalizarPedido}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-medium hover:from-cyan-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      'Finalizar pedido'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarritoPage;
