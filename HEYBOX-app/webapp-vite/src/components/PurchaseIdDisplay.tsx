import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface PurchaseIdDisplayProps {
  orderId: string;
  purchaseId: string;
  restaurantName: string;
  status?: 'ready' | 'preparing' | 'completed';
  estimatedTime?: number; // en minutos
}

const PurchaseIdDisplay: React.FC<PurchaseIdDisplayProps> = ({ 
  orderId, 
  purchaseId, 
  restaurantName,
  status = 'preparing',
  estimatedTime = 10
}) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);
  const [blinkEffect, setBlinkEffect] = useState(false);
  
  // Efecto para crear parpadeo cuando el pedido está listo
  useEffect(() => {
    if (status === 'ready') {
      const blinkInterval = setInterval(() => {
        setBlinkEffect(prev => !prev);
      }, 800);
      
      return () => clearInterval(blinkInterval);
    }
  }, [status]);
  
  // Efecto para la cuenta regresiva
  useEffect(() => {
    if (status === 'preparing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 60000); // Actualizar cada minuto
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, status]);
  
  // Función para alternar la vista de pantalla completa
  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };
  
  // Asegurar que el QR se actualice cuando cambie el purchaseId
  useEffect(() => {
    return () => setShowFullscreen(false);
  }, [purchaseId]);
  
  // Determinar colores y mensajes según el estado
  const getStatusConfig = () => {
    switch(status) {
      case 'ready':
        return {
          bgColor: blinkEffect ? 'bg-green-600' : 'bg-green-500',
          textColor: 'text-white',
          message: '¡Tu pedido está listo para recoger!',
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'preparing':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          message: `Preparando tu pedido... (${timeRemaining} min restantes)`,
          icon: (
            <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'completed':
        return {
          bgColor: 'bg-gray-600',
          textColor: 'text-white',
          message: 'Pedido entregado. ¡Gracias!',
          icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-cyan-600',
          textColor: 'text-white',
          message: 'Muestra este código al llegar',
          icon: null
        };
    }
  };
  
  const statusConfig = getStatusConfig();

  // Contenido del componente
  const content = (
    <div className={`flex flex-col items-center justify-center p-6 ${
      showFullscreen ? 'fixed inset-0 z-50 bg-gradient-to-b from-white to-gray-100' : 'bg-white rounded-xl shadow-xl'
    }`}>
      {/* Encabezado */}
      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} w-full py-4 px-6 rounded-t-xl -mt-6 mb-6 text-center transition-colors duration-300`}>
        <div className="flex items-center justify-center gap-3">
          {statusConfig.icon}
          <h2 className="text-xl font-bold">{statusConfig.message}</h2>
        </div>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* Información del restaurante */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-800">{restaurantName}</h3>
            <p className="text-gray-500 text-sm">Pedido #{orderId.slice(-6)}</p>
          </div>
          
          {/* Código QR */}
          <div className="bg-white p-3 border-2 border-gray-200 rounded-lg shadow-md">
            <QRCode
              value={`HEYBOX:${orderId}:${purchaseId}`}
              size={showFullscreen ? 200 : 120}
              level="H"
            />
          </div>
        </div>
        
        {/* ID de compra en formato numérico grande */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-center py-6 px-6 rounded-xl font-mono mb-6 w-full overflow-hidden shadow-lg">
          {/* Efecto de onda animada */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
            <div className="absolute h-40 w-40 rounded-full bg-white/30 -top-20 -left-20 animate-pulse"></div>
            <div className="absolute h-32 w-32 rounded-full bg-white/20 top-20 right-10 animate-pulse delay-700"></div>
          </div>
          
          <div className="relative z-10">
            <p className="text-sm font-medium mb-1 tracking-wider">CÓDIGO DE RETIRO</p>
            <p className="text-5xl font-bold tracking-widest">{purchaseId}</p>
          </div>
        </div>
        
        {/* Instrucciones */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instrucciones
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded-full text-xs mr-2 mt-0.5">1</span>
              <span>Dirígete al mostrador de "Pedidos HEYBOX" en {restaurantName}</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded-full text-xs mr-2 mt-0.5">2</span>
              <span>Muestra este código o di el número de retiro</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-600 text-white rounded-full text-xs mr-2 mt-0.5">3</span>
              <span>Recibe tu pedido y ¡disfruta!</span>
            </li>
          </ul>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleFullscreen}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg transition-colors"
          >
            {showFullscreen ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Salir de pantalla completa</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Pantalla completa</span>
              </>
            )}
          </button>
          
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition-colors"
            onClick={() => window.print()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Imprimir código</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Si está en pantalla completa, mostrar el contenido en un portal
  if (showFullscreen) {
    return (
      <div className="relative">
        {content}
      </div>
    );
  }

  // Vista normal
  return content;
};

export default PurchaseIdDisplay;
