import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchOrderDetails, cancelOrder } from '../../services/api';
import { socket } from '../../services/socket';

interface OrderDetailProps {
  orderId: string;
  showHeader?: boolean;
  showActions?: boolean;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ 
  orderId,
  showHeader = true,
  showActions = true
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  
  // Cargar detalles del pedido
  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId || !isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchOrderDetails(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los detalles del pedido');
        console.error('Error al cargar detalles del pedido:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderData();
  }, [orderId, isAuthenticated]);
  
  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (orderId) {
      // Escuchar actualizaciones del pedido
      socket.on(`pedido:${orderId}:update`, (updatedOrder) => {
        setOrder(updatedOrder);
      });
      
      return () => {
        socket.off(`pedido:${orderId}:update`);
      };
    }
  }, [orderId]);
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-CO', options);
  };
  
  // Cancelar pedido
  const handleCancelOrder = async () => {
    if (!order || !isAuthenticated) return;
    
    if (!window.confirm('¿Estás seguro que deseas cancelar este pedido?')) {
      return;
    }
    
    setCancelLoading(true);
    
    try {
      await cancelOrder(order._id);
      // La actualización vendrá a través del socket
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cancelar el pedido');
      console.error('Error al cancelar el pedido:', err);
    } finally {
      setCancelLoading(false);
    }
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
        <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar el pedido</h3>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Pedido no encontrado</h3>
        <p className="text-gray-600">No se pudo encontrar información para este pedido.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Pedido #{order._id.substring(0, 8)}
              </h2>
              <p className="text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
              {formatStatus(order.estado)}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Restaurante */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurante</h3>
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
              <p className="text-gray-600">
                {order.restaurante?.direccion || 'Dirección no disponible'}
              </p>
              <Link
                to={`/restaurant/${order.restaurante?._id}`}
                className="text-blue-600 hover:underline text-sm mt-1 inline-block"
              >
                Ver restaurante
              </Link>
            </div>
          </div>
        </div>
        
        {/* Items del pedido */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Productos</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{item.cantidad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">${item.precio.toLocaleString('es-CO')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Información del pedido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Información de entrega</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-3">
                <span className="block text-sm font-medium text-gray-700">Nombre:</span>
                <span className="block text-gray-900 mt-1">{order.nombre}</span>
              </div>
              <div className="mb-3">
                <span className="block text-sm font-medium text-gray-700">Teléfono:</span>
                <span className="block text-gray-900 mt-1">{order.telefono}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">Dirección:</span>
                <span className="block text-gray-900 mt-1">{order.direccion}</span>
              </div>
              {order.notas && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="block text-sm font-medium text-gray-700">Notas:</span>
                  <span className="block text-gray-900 mt-1">{order.notas}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen de pago</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${order.subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span className="text-gray-900">${order.impuestos.toLocaleString('es-CO')}</span>
                </div>
                {order.propina > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Propina</span>
                    <span className="text-gray-900">${order.propina.toLocaleString('es-CO')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                  <span>Total</span>
                  <span>${order.total.toLocaleString('es-CO')}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium text-gray-700">Método de pago:</span>
                  <span className="text-gray-900 ml-2 capitalize">
                    {order.metodoPago === 'efectivo' ? 'Efectivo' : 
                     order.metodoPago === 'tarjeta' ? 'Tarjeta (al recoger)' : 
                     order.metodoPago}
                  </span>
                </div>
              </div>
            </div>
            
            {order.codigoRetiro && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-1">Código de retiro</h4>
                <div className="bg-white p-3 rounded border border-blue-200 text-center">
                  <span className="text-2xl font-bold tracking-widest text-blue-800">
                    {order.codigoRetiro}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Muestra este código al recoger tu pedido
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Acciones */}
        {showActions && (
          <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3">
            {['pendiente', 'confirmado'].includes(order.estado) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className={`px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 ${
                  cancelLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {cancelLoading ? 'Cancelando...' : 'Cancelar pedido'}
              </button>
            )}
            
            {['confirmado', 'en_preparacion', 'listo'].includes(order.estado) && (
              <Link
                to={`/track/${order._id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Seguir pedido
              </Link>
            )}
            
            <Link
              to={'/orders'}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Ver todos mis pedidos
            </Link>
            
            {order.estado === 'completado' && (
              <button
                onClick={() => navigate(`/restaurant/${order.restaurante?._id}`)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Ordenar de nuevo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
