import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import OrderTracking from '../../components/tracking/OrderTracking';
import { fetchOrderDetails } from '../../services/api';
import { socket } from '../../services/socket';

const TrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { iniciarSeguimiento, detenerSeguimiento, isTracking } = useLocation();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar detalles del pedido
  useEffect(() => {
    const loadOrderData = async () => {
      if (!id || !isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchOrderDetails(id);
        setOrder(data);
        
        // Verificar si el pedido está en un estado que permite seguimiento
        const estadosSeguimiento = ['confirmado', 'en_preparacion', 'listo'];
        if (estadosSeguimiento.includes(data.estado)) {
          // Iniciar seguimiento de ubicación
          await iniciarSeguimiento(id);
        }
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los detalles del pedido');
        console.error('Error al cargar detalles del pedido:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderData();
    
    // Limpiar seguimiento al desmontar
    return () => {
      detenerSeguimiento();
    };
  }, [id, isAuthenticated, iniciarSeguimiento, detenerSeguimiento]);
  
  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (id) {
      // Unirse a la sala del pedido
      socket.emit('join', `order:${id}`);
      
      // Escuchar actualizaciones del pedido
      socket.on(`order:${id}:update`, (updatedOrder: any) => {
        setOrder(updatedOrder);
        
        // Si el pedido cambia a completado o cancelado, detener el seguimiento
        if (['completado', 'cancelado'].includes(updatedOrder.estado)) {
          detenerSeguimiento();
        }
      });
      
      return () => {
        // Abandonar la sala del pedido
        socket.emit('leave', `order:${id}`);
        socket.off(`order:${id}:update`);
      };
    }
  }, [id, detenerSeguimiento]);
  
  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: `/track/${id}` } });
    }
  }, [authLoading, isAuthenticated, navigate, id]);
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Seguimiento de Pedido</h1>
          <p className="text-gray-600">
            Sigue en tiempo real el estado de tu pedido
          </p>
        </div>
        
        {error ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar el seguimiento</h3>
            <p className="text-gray-600">{error}</p>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Reintentar
              </button>
              <button 
                onClick={() => navigate(`/order/${id}`)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Ver detalles del pedido
              </button>
            </div>
          </div>
        ) : (
          <>
            <OrderTracking orderId={id || ''} />
            
            {!isTracking && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      No se está rastreando tu ubicación
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Tu ubicación es necesaria para ofrecer un seguimiento preciso. Por favor, permite el acceso a tu ubicación.
                      </p>
                      <button 
                        onClick={() => iniciarSeguimiento(id || '')}
                        className="mt-2 px-4 py-1.5 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 hover:bg-yellow-200"
                      >
                        Habilitar seguimiento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
