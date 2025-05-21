import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLocation as useLocationContext } from '../context/LocationContext';
import OrderTracking from '../components/OrderTracking';
import ProximityMap from '../components/ProximityMap';

interface OrderDetailPageProps {}

interface OrderDetail {
  _id: string;
  numeroPedido: string;
  usuario: {
    _id: string;
    nombre: string;
    telefono: string;
  };
  restaurante: {
    _id: string;
    nombre: string;
    direccion: {
      calle: string;
      ciudad: string;
      codigoPostal: string;
      ubicacion: {
        lat: number;
        lng: number;
      };
    };
    telefono: string;
    logo: string;
  };
  productos: Array<{
    producto: {
      _id: string;
      nombre: string;
      precio: number;
      imagen: string;
    };
    cantidad: number;
    opciones: string[];
    comentarios?: string;
    precioUnitario: number;
  }>;
  metodoPago: {
    tipo: string;
    detalles: {
      ultimosDigitos?: string;
      transaccionId?: string;
    };
  };
  estado: string;
  estadoHistorial: Array<{
    estado: string;
    fecha: string;
    comentario?: string;
  }>;
  codigoVerificacion: string;
  subtotal: number;
  total: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface LocationState {
  success?: boolean;
  numeroPedido?: string;
  codigoVerificacion?: string;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const { 
    iniciarSeguimiento, 
    detenerSeguimiento, 
    ubicacionActual, 
    isTracking 
  } = useLocationContext();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const locationState = location.state as LocationState | null;

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/pedidos/${orderId}` } });
    }
  }, [isAuthenticated, navigate, orderId]);

  // Cargar los detalles del pedido
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !orderId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${API_URL}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setOrder(response.data.pedido);
      } catch (error: any) {
        console.error('Error al cargar detalles del pedido:', error);
        setError(error.response?.data?.mensaje || 'No se pudo cargar la información del pedido.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [API_URL, orderId, token]);

  // Iniciar seguimiento de ubicación si el pedido está en progreso
  useEffect(() => {
    if (order && ['preparando', 'listo', 'en_camino'].includes(order.estado)) {
      if (!isTracking) {
        iniciarSeguimiento(order._id);
      }
    } else {
      if (isTracking) {
        detenerSeguimiento();
      }
    }
    
    return () => {
      if (isTracking) {
        detenerSeguimiento();
      }
    };
  }, [order, isTracking, iniciarSeguimiento, detenerSeguimiento]);

  // Mostrar modal de confirmación si viene desde checkout exitoso
  useEffect(() => {
    if (locationState?.success) {
      // Si viene de un checkout exitoso, mostrar información de confirmación
      setShowVerificationModal(true);
      // Prellenar el código de verificación si existe en el state
      if (locationState.codigoVerificacion) {
        setVerificationCode(locationState.codigoVerificacion);
      }
    }
  }, [locationState]);

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

  // Verificar pedido
  const handleVerifyOrder = async () => {
    if (!order || !verificationCode) return;
    
    try {
      setVerificationError(null);
      
      const response = await axios.post(
        `${API_URL}/orders/${order._id}/verify`,
        { codigoVerificacion: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Actualizar el estado del pedido en la UI
      setOrder(prevOrder => {
        if (!prevOrder) return null;
        return {
          ...prevOrder,
          estado: 'completado',
          estadoHistorial: [
            ...prevOrder.estadoHistorial,
            {
              estado: 'completado',
              fecha: new Date().toISOString(),
              comentario: 'Pedido verificado y completado'
            }
          ]
        };
      });
      
      // Cerrar modal
      setShowVerificationModal(false);
      
      // Mostrar notificación de éxito
      alert('¡Pedido verificado correctamente!');
    } catch (error: any) {
      console.error('Error al verificar pedido:', error);
      setVerificationError(error.response?.data?.mensaje || 'Código de verificación incorrecto. Intenta nuevamente.');
    }
  };

  // Cancelar pedido
  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const response = await axios.post(
        `${API_URL}/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Actualizar el estado del pedido en la UI
      setOrder(prevOrder => {
        if (!prevOrder) return null;
        return {
          ...prevOrder,
          estado: 'cancelado',
          estadoHistorial: [
            ...prevOrder.estadoHistorial,
            {
              estado: 'cancelado',
              fecha: new Date().toISOString(),
              comentario: 'Pedido cancelado por el usuario'
            }
          ]
        };
      });
      
      // Mostrar notificación de éxito
      alert('Pedido cancelado correctamente.');
    } catch (error: any) {
      console.error('Error al cancelar pedido:', error);
      alert(error.response?.data?.mensaje || 'No se pudo cancelar el pedido. Contacta con soporte.');
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

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar pedido</h2>
          <p className="text-gray-700 mb-6">{error || 'No se encontró información del pedido.'}</p>
          <button
            onClick={() => navigate('/mis-pedidos')}
            className="btn-primary"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabecera y resumen */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.numeroPedido}</h1>
            <p className="text-gray-500">Realizado el {formatDate(order.fechaCreacion)}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            {/* Botones de acción según estado */}
            {['pendiente', 'confirmado', 'preparando'].includes(order.estado) && (
              <button
                onClick={handleCancelOrder}
                className="btn-secondary"
              >
                Cancelar pedido
              </button>
            )}
            
            {order.estado === 'listo' && (
              <button
                onClick={() => setShowVerificationModal(true)}
                className="btn-primary"
              >
                Verificar recogida
              </button>
            )}
            
            <button
              onClick={() => navigate('/mis-pedidos')}
              className="btn-outline"
            >
              Ver todos mis pedidos
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estado del pedido y seguimiento */}
          <div className="lg:col-span-2 space-y-8">
            {/* Estado actual */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  ['completado', 'listo', 'en_camino', 'preparando'].includes(order.estado)
                    ? 'bg-green-100 text-green-600'
                    : order.estado === 'cancelado'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {order.estado === 'completado' && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {order.estado === 'cancelado' && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {['pendiente', 'confirmado'].includes(order.estado) && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {order.estado === 'preparando' && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 8l-7 7-7-7" />
                    </svg>
                  )}
                  {order.estado === 'listo' && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {order.estado === 'en_camino' && (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  )}
                </div>
                
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {order.estado === 'pendiente' && 'Pendiente de confirmación'}
                    {order.estado === 'confirmado' && 'Pedido confirmado'}
                    {order.estado === 'preparando' && 'En preparación'}
                    {order.estado === 'listo' && 'Listo para recoger'}
                    {order.estado === 'en_camino' && 'En camino'}
                    {order.estado === 'completado' && 'Pedido completado'}
                    {order.estado === 'cancelado' && 'Pedido cancelado'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {order.estado === 'pendiente' && 'Tu pedido está siendo revisado por el restaurante.'}
                    {order.estado === 'confirmado' && 'El restaurante ha confirmado tu pedido y pronto comenzará a prepararlo.'}
                    {order.estado === 'preparando' && 'El restaurante está preparando tu pedido.'}
                    {order.estado === 'listo' && 'Tu pedido está listo para ser recogido. Acércate al restaurante y muestra tu código de verificación.'}
                    {order.estado === 'en_camino' && 'Tu pedido está en camino hacia ti.'}
                    {order.estado === 'completado' && '¡Tu pedido ha sido entregado exitosamente!'}
                    {order.estado === 'cancelado' && 'Este pedido ha sido cancelado.'}
                  </p>
                </div>
              </div>
              
              {/* Información de recogida para pedidos listos */}
              {order.estado === 'listo' && (
                <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Instrucciones para recoger</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Acércate al restaurante y muestra el siguiente código al personal:</p>
                        <div className="mt-2 p-3 bg-white rounded-md text-center">
                          <span className="text-xl font-bold tracking-wider">{order.codigoVerificacion}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Seguimiento del pedido */}
            <OrderTracking historialEstados={order.estadoHistorial} estadoActual={order.estado} />
            
            {/* Mapa de proximidad (solo mostrar si está en ciertos estados) */}
            {['preparando', 'listo', 'en_camino'].includes(order.estado) && order.restaurante.direccion.ubicacion && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Seguimiento de ubicación</h2>
                <div className="h-80 lg:h-96 rounded-md overflow-hidden">
                  <ProximityMap 
                    restauranteLat={order.restaurante.direccion.ubicacion.lat}
                    restauranteLng={order.restaurante.direccion.ubicacion.lng}
                    usuarioLat={ubicacionActual?.lat || 0}
                    usuarioLng={ubicacionActual?.lng || 0}
                    nombreRestaurante={order.restaurante.nombre}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Detalles del pedido */}
          <div className="space-y-8">
            {/* Información del restaurante */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Información del restaurante</h2>
              <div className="flex items-center mb-4">
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
                  <p className="text-sm text-gray-500">{order.restaurante.telefono}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Dirección</h3>
                <p className="text-gray-900">{order.restaurante.direccion.calle}</p>
                <p className="text-gray-900">{order.restaurante.direccion.ciudad}, {order.restaurante.direccion.codigoPostal}</p>
              </div>
            </div>
            
            {/* Resumen del pedido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h2>
              
              <ul className="divide-y divide-gray-200">
                {order.productos.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between">
                    <div>
                      <span className="font-medium">{item.cantidad}x </span>
                      {item.producto.nombre}
                      {item.opciones && item.opciones.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {item.opciones.join(', ')}
                        </p>
                      )}
                      {item.comentarios && (
                        <p className="text-xs text-gray-500 italic">
                          Nota: {item.comentarios}
                        </p>
                      )}
                    </div>
                    <div className="text-gray-900">
                      ${(item.precioUnitario * item.cantidad).toLocaleString('es-CO')}
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span>${order.subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>IVA (incluido)</span>
                  <span>${(order.subtotal * 0.19).toLocaleString('es-CO')}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${order.total.toLocaleString('es-CO')}</span>
              </div>
            </div>
            
            {/* Método de pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Método de pago</h2>
              
              <div className="flex items-center">
                {order.metodoPago.tipo === 'tarjeta' ? (
                  <>
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="ml-3">
                      Tarjeta terminada en {order.metodoPago.detalles.ultimosDigitos || '****'}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="ml-3">Pago en efectivo al recoger</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de verificación */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verificar recogida de pedido</h2>
            
            <p className="text-gray-700 mb-4">
              {order.estado === 'listo'
                ? 'Ingresa el código de verificación proporcionado por el restaurante para confirmar que has recogido tu pedido.'
                : 'Tu pedido aún no está listo para ser recogido.'}
            </p>
            
            <div className="mb-4">
              <label htmlFor="verificacion" className="block text-sm font-medium text-gray-700 mb-1">
                Código de verificación
              </label>
              <input
                type="text"
                id="verificacion"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="input-field"
                placeholder="Ingresa el código de 6 dígitos"
                disabled={order.estado !== 'listo'}
              />
            </div>
            
            {verificationError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {verificationError}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="btn-outline"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleVerifyOrder}
                disabled={!verificationCode || order.estado !== 'listo'}
                className={`btn-primary ${(!verificationCode || order.estado !== 'listo') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
