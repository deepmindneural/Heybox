import React from 'react';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  calificacion: number;
  direccion: {
    calle: string;
    ciudad: string;
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  nombre,
  categoria,
  descripcion,
  imagen,
  calificacion,
  direccion,
}) => {
  // Renderizar estrellas basadas en la calificación
  const renderEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <svg
          key={i}
          className={`h-5 w-5 ${
            i <= calificacion
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }
    return estrellas;
  };

  return (
    <div className="card flex flex-col h-full">
      <div className="relative pb-2/3 w-full">
        <img
          src={imagen || 'https://via.placeholder.com/300x200?text=HEYBOX'}
          alt={nombre}
          className="absolute h-48 w-full object-cover rounded-t-lg"
        />
      </div>
      <div className="flex-grow p-4">
        <div className="uppercase tracking-wide text-xs text-primary font-semibold">
          {categoria}
        </div>
        <Link to={`/restaurantes/${id}`}>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-gray-900 hover:text-primary transition-colors">
            {nombre}
          </h3>
        </Link>
        <div className="mt-2 flex items-center">
          <div className="flex">{renderEstrellas()}</div>
          <span className="ml-1 text-sm text-gray-600">
            ({calificacion.toFixed(1)})
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{descripcion}</p>
        <p className="mt-2 text-sm text-gray-500">
          {direccion.calle}, {direccion.ciudad}
        </p>
      </div>
      <div className="px-4 pb-4">
        <Link
          to={`/restaurantes/${id}`}
          className="btn-primary text-center block w-full"
        >
          Ver Menú
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
