import React from 'react';
import { useCreditos } from '../../context/CreditosContext';

const ResumenCreditos: React.FC = () => {
  const { saldo, cargando, error } = useCreditos();

  if (cargando) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-medium text-gray-900">Error al cargar créditos</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tus Créditos</h3>
          <p className="text-gray-500 text-sm">Disponibles para usar en pedidos</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-cyan-600">{saldo}</span>
          <p className="text-xs text-gray-500 mt-1">
            <button className="text-cyan-600 hover:underline">
              Ver historial
            </button>
          </p>
        </div>
      </div>
      
      {saldo === 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            No tienes créditos disponibles. ¡Compra algunos para disfrutar de beneficios exclusivos!
          </p>
          <button className="mt-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md transition">
            Comprar Créditos
          </button>
        </div>
      )}
      
      {saldo > 0 && saldo < 20 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-md border-l-2 border-amber-400">
          <p className="text-sm text-amber-700">
            Tus créditos están por agotarse. Recarga para seguir disfrutando.
          </p>
          <button className="mt-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md transition">
            Recargar Créditos
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumenCreditos;
