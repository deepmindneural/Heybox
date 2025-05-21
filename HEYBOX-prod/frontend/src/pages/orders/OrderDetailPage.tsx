import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderDetail from '../../components/orders/OrderDetail';
import { socket } from '../../services/socket';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useRouterLocation();
  
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  
  // Mostrar mensaje de éxito si viene de checkout
  useEffect(() => {
    if (location.state && (location.state as any).fromCheckout) {
      setShowSuccessMessage(true);
      
      // Limpiar estado después de mostrar
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  
  // Conectar al socket para recibir actualizaciones en tiempo real
  useEffect(() => {
    if (id && isAuthenticated) {
      // Unirse a la sala del pedido
      socket.emit('join', `order:${id}`);
      
      return () => {
        // Abandonar la sala del pedido
        socket.emit('leave', `order:${id}`);
      };
    }
  }, [id, isAuthenticated]);
  
  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: `/order/${id}` } });
    }
  }, [authLoading, isAuthenticated, navigate, id]);
  
  if (authLoading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Detalle del Pedido</h1>
          <p className="text-gray-600">
            Información detallada de tu pedido
          </p>
        </div>
        
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ¡Pedido realizado con éxito!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Tu pedido ha sido registrado correctamente. A continuación puedes ver todos los detalles.
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="absolute top-4 right-4 text-green-400 hover:text-green-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {id ? (
          <OrderDetail orderId={id} showHeader={true} showActions={true} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Pedido no encontrado</h3>
            <p className="text-gray-600 mb-4">
              No se pudo encontrar el pedido solicitado. Puede que el enlace sea incorrecto o que el pedido haya sido eliminado.
            </p>
            <button 
              onClick={() => navigate('/orders')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ver mis pedidos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
