import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface OrderSummary {
  _id: string;
  numeroPedido: string;
  restaurante: {
    _id: string;
    nombre: string;
    logo?: string;
  };
  total: number;
  estado: string;
  fechaCreacion: string;
  items: number; // Cantidad de productos distintos
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [activeTab, setActiveTab] = useState<string>('activos');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mis-pedidos' } });
    }
  }, [isAuthenticated, navigate]);

  // Cargar pedidos del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${API_URL}/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setOrders(response.data.pedidos);
      } catch (error: any) {
        console.error('Error al cargar pedidos:', error);
        setError(error.response?.data?.mensaje || 'No se pudieron cargar tus pedidos.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [API_URL, token]);

  // Filtrar pedidos según la pestaña activa
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'activos') {
      return ['pendiente', 'confirmado', 'preparando', 'listo', 'en_camino'].includes(order.estado);
    } else if (activeTab === 'completados') {
      return order.estado === 'completado';
    } else {
      return order.estado === 'cancelado';
    }
  });

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtener clase CSS según el estado del pedido
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'preparando':
        return 'bg-indigo-100 text-indigo-800';
      case 'listo':
        return 'bg-green-100 text-green-800';
      case 'en_camino':
        return 'bg-purple-100 text-purple-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto según el estado del pedido
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'preparando':
        return 'En preparación';
      case 'listo':
        return 'Listo para recoger';
      case 'en_camino':
        return 'En camino';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>
        
        {/* Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('activos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activos'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activos
            </button>
            
            <button
              onClick={() => setActiveTab('completados')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completados'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completados
            </button>
            
            <button
              onClick={() => setActiveTab('cancelados')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cancelados'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cancelados
            </button>
          </nav>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No hay pedidos {activeTab}</h2>
            {activeTab === 'activos' && (
              <p className="text-gray-500 mb-6">
                No tienes pedidos activos en este momento.
              </p>
            )}
            {activeTab === 'completados' && (
              <p className="text-gray-500 mb-6">
                No tienes pedidos completados.
              </p>
            )}
            {activeTab === 'cancelados' && (
              <p className="text-gray-500 mb-6">
                No tienes pedidos cancelados.
              </p>
            )}
            <Link to="/restaurantes" className="btn-primary">
              Explorar restaurantes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Link 
                key={order._id}
                to={`/pedidos/${order._id}`}
                className="block hover:bg-gray-50"
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        {/* Logo del restaurante */}
                        {order.restaurante.logo ? (
                          <img 
                            src={order.restaurante.logo} 
                            alt={order.restaurante.nombre} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{order.restaurante.nombre}</h3>
                          <p className="text-sm text-gray-500">
                            Pedido #{order.numeroPedido} • {formatDate(order.fechaCreacion)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.estado)}`}>
                          {getStatusText(order.estado)}
                        </span>
                        <div className="ml-6 text-right">
                          <p className="text-lg font-medium text-gray-900">${order.total.toLocaleString('es-CO')}</p>
                          <p className="text-sm text-gray-500">{order.items} {order.items === 1 ? 'producto' : 'productos'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <span className="text-sm font-medium text-primary">
                      Ver detalles
                      <svg className="inline-block ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
