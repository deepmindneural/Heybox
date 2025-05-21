import React, { useState, useEffect } from 'react';
import { useCreditos } from '../../context/CreditosContext';

const HistorialTransacciones: React.FC = () => {
  const { transacciones, cargarTransacciones, cargando, error } = useCreditos();
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    cargarTransacciones();
  }, [paginaActual]);

  // Función para formatear la fecha
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color según el tipo de transacción
  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'compra':
        return 'bg-green-100 text-green-800';
      case 'gasto':
        return 'bg-red-100 text-red-800';
      case 'recarga':
        return 'bg-blue-100 text-blue-800';
      case 'reembolso':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (cargando) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Transacciones</h3>
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-b border-gray-200 py-3">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Transacciones</h3>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error al cargar el historial: {error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => cargarTransacciones()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (transacciones.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Transacciones</h3>
        <p className="text-gray-500">No tienes transacciones registradas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Transacciones</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transacciones.map((transaccion) => (
              <tr key={transaccion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatearFecha(transaccion.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${obtenerColorTipo(transaccion.tipo)}`}>
                    {transaccion.tipo === 'compra' ? 'Compra' :
                     transaccion.tipo === 'gasto' ? 'Consumo' :
                     transaccion.tipo === 'recarga' ? 'Recarga' :
                     transaccion.tipo === 'reembolso' ? 'Reembolso' : 
                     transaccion.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="line-clamp-2">
                    {transaccion.concepto}
                    {transaccion.restauranteNombre && (
                      <span className="block text-xs text-gray-500 mt-1">
                        {transaccion.restauranteNombre}
                      </span>
                    )}
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                  transaccion.tipo === 'gasto' ? 'text-red-600' : 
                  transaccion.tipo === 'compra' || transaccion.tipo === 'recarga' ? 'text-green-600' : 
                  'text-gray-900'
                }`}>
                  {transaccion.tipo === 'gasto' ? '-' : '+'}
                  {transaccion.monto.toLocaleString('es-CO')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{transacciones.length}</span> de{' '}
                <span className="font-medium">{transacciones.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    paginaActual === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {paginaActual}
                </span>
                <button
                  onClick={() => setPaginaActual(prev => prev + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialTransacciones;
