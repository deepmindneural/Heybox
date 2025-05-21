import React from 'react';
import { FaCheckCircle, FaClock, FaStore, FaMotorcycle, FaRegSmile } from 'react-icons/fa';

interface OrderStatusTrackerProps {
  currentStatus: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'en_camino' | 'entregado' | 'cancelado';
  estimatedTime?: number; // en minutos
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ currentStatus, estimatedTime }) => {
  const statuses = [
    {
      id: 'confirmado',
      title: 'Confirmado',
      description: 'Tu pedido ha sido confirmado',
      icon: FaCheckCircle,
    },
    {
      id: 'en_preparacion',
      title: 'En preparación',
      description: 'El restaurante está preparando tu pedido',
      icon: FaStore,
    },
    {
      id: 'listo',
      title: 'Listo para entrega',
      description: 'Tu pedido está listo para ser recogido',
      icon: FaClock,
    },
    {
      id: 'en_camino',
      title: 'En camino',
      description: 'Tu pedido está en camino',
      icon: FaMotorcycle,
    },
    {
      id: 'entregado',
      title: 'Entregado',
      description: '¡Tu pedido ha sido entregado!',
      icon: FaRegSmile,
    },
  ];

  // Determinar el paso actual y porcentaje de progreso
  let currentStep = 0;
  let progress = 0;

  if (currentStatus === 'cancelado') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 text-3xl mb-2">
          <FaCheckCircle className="mx-auto" />
        </div>
        <h3 className="text-red-800 text-lg font-medium mb-1">Pedido Cancelado</h3>
        <p className="text-red-600">Este pedido ha sido cancelado.</p>
      </div>
    );
  }

  if (currentStatus === 'pendiente') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <div className="text-yellow-500 text-3xl mb-2">
          <FaClock className="mx-auto" />
        </div>
        <h3 className="text-yellow-800 text-lg font-medium mb-1">Pedido Pendiente</h3>
        <p className="text-yellow-600">Estamos a la espera de confirmación del restaurante.</p>
      </div>
    );
  }

  // Calcular el paso actual y progreso
  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i].id === currentStatus) {
      currentStep = i;
      progress = (i / (statuses.length - 1)) * 100;
      break;
    } else if (currentStatus === 'entregado') {
      currentStep = statuses.length - 1;
      progress = 100;
      break;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Estado de tu pedido</h2>
        {currentStatus !== 'entregado' && estimatedTime && (
          <p className="text-green-600 font-medium">
            Tiempo estimado de entrega: {estimatedTime} minutos
          </p>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="relative mb-6">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          ></div>
        </div>
      </div>

      {/* Pasos del estado */}
      <div className="space-y-4">
        {statuses.map((status, index) => {
          const isPast = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div
              key={status.id}
              className={`flex items-start ${isCurrent ? 'opacity-100' : isPast ? 'opacity-90' : 'opacity-40'}`}
            >
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                  isPast
                    ? 'bg-green-100 text-green-600'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-400'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <status.icon className={`h-5 w-5 ${isPast ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3
                  className={`text-lg font-medium ${
                    isPast ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {status.title}
                </h3>
                <p className={`${isPast ? 'text-gray-600' : isCurrent ? 'text-gray-700' : 'text-gray-400'}`}>
                  {status.description}
                </p>
                {isCurrent && (
                  <div className="mt-1 flex items-center text-blue-500 text-sm">
                    <FaClock className="mr-1" /> En progreso
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {currentStatus === 'entregado' && (
        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          <p className="text-green-600 font-medium">
            ¡Tu pedido ha sido entregado con éxito!
          </p>
          <button className="mt-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-200">
            Calificar pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderStatusTracker;
