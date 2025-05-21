import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserOrders } from '../../services/api';
import { socket } from '../../services/socket';

const OrdersList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los pedidos');
        console.error('Error al cargar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [isAuthenticated]);
  
  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (isAuthenticated) {
      // Escuchar actualizaciones de pedidos
      socket.on('pedido:update', (updatedOrder) => {
        setOrders(prevOrders => prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        ));
      });
      
      return () => {
        socket.off('pedido:update');
      };
    }
  }, [isAuthenticated]);
  
  // Filtrar órdenes según el filtro activo
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') {
      return ['pendiente', 'confirmado', 'en_preparacion', 'listo'].includes(order.estado);
    }
    if (activeFilter === 'completed') {
      return order.estado === 'completado';
    }
    if (activeFilter === 'cancelled') {
      return order.estado === 'cancelado';
    }
    return true;
  });
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-CO', options);
  };
  
  // Obtener clase de color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'en_preparacion':
        return 'bg-purple-100 text-purple-800';
      case 'listo':
        return 'bg-indigo-100 text-indigo-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Formatear estado
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'en_preparacion':
        return 'En preparación';
      case 'listo':
        return 'Listo para recoger';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar pedidos</h3>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Mis Pedidos</h2>
        <button 
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ordenar ahora
        </button>
      </div>
      
      {/* Filtros */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full ${
            activeFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 rounded-full ${
            activeFilter === 'active' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-full ${
            activeFilter === 'completed' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Completados
        </button>
        <button
          onClick={() => setActiveFilter('cancelled')}
          className={`px-4 py-2 rounded-full ${
            activeFilter === 'cancelled' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Cancelados
        </button>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
          
          {activeFilter !== 'all' ? (
            <p className="text-gray-600">
              No tienes pedidos con el filtro seleccionado.{' '}
              <button 
                onClick={() => setActiveFilter('all')}
                className="text-blue-600 hover:underline"
              >
                Ver todos los pedidos
              </button>
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">¡No has realizado ningún pedido aún!</p>
              <button 
                onClick={() => navigate('/restaurants')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Explorar restaurantes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link 
              key={order._id}
              to={`/order/${order._id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                    {order.restaurante?.imagen ? (
                      <img 
                        src={order.restaurante.imagen} 
                        alt={order.restaurante.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {order.restaurante?.nombre || 'Restaurante no disponible'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="text-sm text-gray-500">
                        Pedido #{order._id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                        {formatStatus(order.estado)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-gray-900">
                    ${order.total.toLocaleString('es-CO')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
              </div>
              
              {/* Mostrar los primeros 3 productos */}
              <div className="px-4 pb-4">
                <div className="text-sm text-gray-600 space-y-1">
                  {order.items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.cantidad} x {item.nombre}
                      </span>
                      <span className="font-medium">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-blue-600 text-xs">
                      +{order.items.length - 3} productos más
                    </div>
                  )}
                </div>
              </div>
              
              {/* Acciones según estado */}
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                {['confirmado', 'en_preparacion', 'listo'].includes(order.estado) ? (
                  <div className="text-blue-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Seguir pedido
                  </div>
                ) : order.estado === 'completado' ? (
                  <div className="text-green-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Pedir de nuevo
                  </div>
                ) : (
                  <div className="text-gray-600 font-medium">
                    Ver detalles
                  </div>
                )}
                
                <div className="text-gray-500 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
