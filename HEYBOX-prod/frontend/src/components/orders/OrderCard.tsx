import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaMotorcycle, FaStore, FaRegClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface OrderCardProps {
  order: {
    _id: string;
    numero: string;
    fecha: string;
    estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'en_camino' | 'entregado' | 'cancelado';
    total: number;
    restaurante: {
      nombre: string;
      imagen?: string;
    };
    items: Array<{
      nombre: string;
      cantidad: number;
    }>;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  // Formatear fecha
  const formattedDate = (() => {
    try {
      const date = new Date(order.fecha);
      return format(date, "d 'de' MMMM, HH:mm", { locale: es });
    } catch (error) {
      return order.fecha;
    }
  })();

  // Determinar color y texto según el estado
  const getStatusInfo = () => {
    switch (order.estado) {
      case 'pendiente':
        return {
          icon: FaRegClock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          text: 'Pendiente'
        };
      case 'confirmado':
        return {
          icon: FaCheckCircle,
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          text: 'Confirmado'
        };
      case 'en_preparacion':
        return {
          icon: FaStore,
          color: 'text-purple-500',
          bgColor: 'bg-purple-100',
          text: 'En preparación'
        };
      case 'listo':
        return {
          icon: FaStore,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          text: 'Listo para entrega'
        };
      case 'en_camino':
        return {
          icon: FaMotorcycle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'En camino'
        };
      case 'entregado':
        return {
          icon: FaCheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Entregado'
        };
      case 'cancelado':
        return {
          icon: FaTimesCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Cancelado'
        };
      default:
        return {
          icon: FaRegClock,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          text: order.estado
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <Link to={`/order/${order._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              Pedido #{order.numero}
            </Link>
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} flex items-center`}>
            <StatusIcon className="mr-1" />
            {statusInfo.text}
          </div>
        </div>

        <div className="flex items-center mb-3">
          {order.restaurante.imagen ? (
            <img 
              src={order.restaurante.imagen} 
              alt={order.restaurante.nombre} 
              className="w-10 h-10 rounded-full mr-3 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/40?text=R';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
              {order.restaurante.nombre.charAt(0)}
            </div>
          )}
          <div className="font-medium">{order.restaurante.nombre}</div>
        </div>

        <div className="text-gray-700 mb-4">
          <div className="font-medium mb-1">Productos:</div>
          <ul className="text-sm">
            {order.items.slice(0, 3).map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.nombre}</span>
                <span>x{item.cantidad}</span>
              </li>
            ))}
            {order.items.length > 3 && (
              <li className="text-gray-500 italic">
                ... y {order.items.length - 3} productos más
              </li>
            )}
          </ul>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
          <div className="font-bold text-blue-600">
            Total: ${order.total.toFixed(2)}
          </div>
          <div className="flex space-x-2">
            {(order.estado === 'confirmado' || order.estado === 'en_preparacion' || order.estado === 'listo' || order.estado === 'en_camino') && (
              <Link 
                to={`/track/${order._id}`}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
              >
                <FaMapMarkerAlt className="mr-1" /> Seguir
              </Link>
            )}
            <Link 
              to={`/order/${order._id}`}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
