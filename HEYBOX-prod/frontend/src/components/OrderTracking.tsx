import React from 'react';

interface OrderTrackingProps {
  estadoActual: string;
  numeroPedido?: string;
  codigoVerificacion?: string;
  restauranteNombre?: string;
  fechaCreacion?: string;
  fechaEstimadaRecogida?: string;
  historialEstados: {
    estado: string;
    fecha: string;
    comentario?: string;
  }[];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  estadoActual,
  numeroPedido = '',
  codigoVerificacion = '',
  restauranteNombre = '',
  fechaCreacion = '',
  fechaEstimadaRecogida = '',
  historialEstados
}) => {
  // Función para formatear fechas
  const formatearFecha = (fechaString: string): string => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determinar progreso basado en el estado
  const getProgresoEstado = (): number => {
    const estados = ['pendiente', 'confirmado', 'preparando', 'listo', 'completado'];
    const indice = estados.indexOf(estadoActual);
    if (indice === -1 || estadoActual === 'cancelado') return 0;
    return (indice + 1) * 25;
  };

  // Traducir estado a español para mostrar
  const traducirEstado = (estadoKey: string): string => {
    const traducciones: { [key: string]: string } = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      preparando: 'En preparación',
      listo: 'Listo para recoger',
      en_camino: 'En camino',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return traducciones[estadoKey] || estadoKey;
  };

  // Obtener el color basado en el estado
  const getColorEstado = (estadoParam?: string): string => {
    const estadoKey = estadoParam || estadoActual;
    const colores: { [key: string]: string } = {
      pendiente: 'bg-yellow-500',
      confirmado: 'bg-blue-500',
      preparando: 'bg-orange-500',
      listo: 'bg-green-500',
      en_camino: 'bg-indigo-500',
      completado: 'bg-purple-500',
      cancelado: 'bg-red-500',
    };
    return colores[estadoKey] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pedido #{numeroPedido}</h2>
          <p className="text-sm text-gray-600">
            {formatearFecha(fechaCreacion)}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getColorEstado()}`}>
          {traducirEstado(estadoActual)}
        </div>
      </div>

      {/* Barra de progreso */}
      {estadoActual !== 'cancelado' && (
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-primary">
                  Progreso del pedido
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-primary">
                  {getProgresoEstado()}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${getProgresoEstado()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-600">
            <span>Pendiente</span>
            <span>Confirmado</span>
            <span>En preparación</span>
            <span>Listo</span>
            <span>Completado</span>
          </div>
        </div>
      )}

      {/* Información del pedido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Información del pedido</h3>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Restaurante:</span> {restauranteNombre}
            </p>
            <p className="text-sm">
              <span className="font-medium">Fecha estimada de recogida:</span>
              <br />
              {formatearFecha(fechaEstimadaRecogida)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Código de verificación</h3>
          <div className="flex justify-center items-center">
            <div className="bg-primary-light text-primary-dark py-2 px-4 rounded-lg text-2xl font-bold tracking-wider">
              {codigoVerificacion}
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            Muestra este código al llegar al restaurante
          </p>
        </div>
      </div>

      {/* Historial de estados */}
      {historialEstados.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Historial de estados</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-3">
              {historialEstados.map((item, index) => (
                <li key={index} className="flex items-start text-sm">
                  <div className={`mt-1 mr-3 w-3 h-3 rounded-full ${
                    item.estado === estadoActual ? getColorEstado() : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className="font-medium">{traducirEstado(item.estado)}</p>
                    <p className="text-gray-500 text-xs">{formatearFecha(item.fecha)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {estadoActual === 'listo' && (
          <button
            type="button"
            className="btn-primary flex-1"
          >
            He llegado al restaurante
          </button>
        )}
        
        {['pendiente', 'confirmado'].includes(estadoActual) && (
          <button
            type="button"
            className="btn-secondary flex-1 bg-red-50 text-red-600 border-red-500 hover:bg-red-100"
          >
            Cancelar pedido
          </button>
        )}
        
        <button
          type="button"
          className="btn-secondary flex-1"
        >
          Ver detalles del pedido
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
