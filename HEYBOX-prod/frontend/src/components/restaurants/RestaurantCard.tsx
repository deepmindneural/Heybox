import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaTruck } from 'react-icons/fa';

interface RestaurantCardProps {
  restaurant: {
    _id: string;
    nombre: string;
    direccion: string;
    imagen: string;
    calificacion: number;
    tiempoEntrega: number;
    costoEnvio: number;
    categorias?: string[];
    destacado?: boolean;
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="relative h-48">
        <img 
          src={restaurant.imagen || 'https://via.placeholder.com/400x300?text=Restaurante'}
          alt={restaurant.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
          }}
        />
        
        {restaurant.destacado && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-bold">
            DESTACADO
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-xl">{restaurant.nombre}</h3>
          <p className="text-white/90 text-sm">{restaurant.direccion}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-medium">{restaurant.calificacion.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-1" />
            <span>{restaurant.tiempoEntrega} min</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaTruck className="mr-1" />
            <span>
              {restaurant.costoEnvio === 0 
                ? 'Gratis' 
                : `$${restaurant.costoEnvio.toFixed(2)}`
              }
            </span>
          </div>
        </div>
        
        {restaurant.categorias && restaurant.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {restaurant.categorias.slice(0, 3).map((categoria, index) => (
              <span 
                key={index} 
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {categoria}
              </span>
            ))}
            {restaurant.categorias.length > 3 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                +{restaurant.categorias.length - 3} más
              </span>
            )}
          </div>
        )}
        
        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors">
          Ver menú
        </button>
      </div>
    </Link>
  );
};

export default RestaurantCard;
