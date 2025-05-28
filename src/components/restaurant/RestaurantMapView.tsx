import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProximityMap from '../ProximityMap';

interface Cliente {
  _id: string;
  numeroPedido: string;
  usuario: {
    nombre: string;
    telefono: string;
  };
  ubicacionActual: {
    lat: number;
    lng: number;
  };
  distanciaEstimada: number;
  tiempoEstimadoLlegada: number;
  zonaProximidad?: {
    distancia: number;
    color: string;
  };
}

interface RestaurantMapViewProps {
  restauranteId: string;
  restauranteLat: number;
  restauranteLng: number;
  nombreRestaurante: string;
}

const RestaurantMapView: React.FC<RestaurantMapViewProps> = ({
  restauranteId,
  restauranteLat,
  restauranteLng,
  nombreRestaurante
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Anillos de proximidad predeterminados si el restaurante no tiene configurados
  const defaultAnillos = [
    { distancia: 200, color: '#F44336' },   // Rojo - Muy cerca
    { distancia: 500, color: '#FF9800' },   // Naranja - Cerca
    { distancia: 1000, color: '#4CAF50' },  // Verde - Aproximándose
    { distancia: 2000, color: '#2196F3' }   // Azul - En camino
  ];
  
  const [anillosProximidad, setAnillosProximidad] = useState(defaultAnillos);
  
  // Cargar datos de clientes activos con ubicación
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/location/restaurante/activos');
      
      if (response.data.exito) {
        setClientes(response.data.pedidos);
        
        // Actualizar anillos si vienen del servidor
        if (response.data.restaurante.anillosProximidad && 
            response.data.restaurante.anillosProximidad.length > 0) {
          setAnillosProximidad(response.data.restaurante.anillosProximidad);
        }
      }
    } catch (err: any) {
      console.error('Error al cargar clientes:', err);
      setError('No se pudieron cargar los clientes. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar clientes al montar el componente y configurar actualización periódica
  useEffect(() => {
    cargarClientes();
    
    // Actualizar cada 30 segundos
    intervalRef.current = window.setInterval(() => {
      cargarClientes();
    }, 30000);
    
    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [restauranteId]);
  
  // Manejar clic en un cliente en el mapa
  const handleClienteClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Pedidos en tránsito
      </h2>
      
      {loading && <p className="text-gray-500">Cargando mapa de clientes...</p>}
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 mb-4">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={cargarClientes}
          >
            Reintentar
          </button>
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Mapa con anillos de proximidad */}
          <div className="lg:col-span-2">
            <ProximityMap
              restauranteLat={restauranteLat}
              restauranteLng={restauranteLng}
              anillosProximidad={anillosProximidad}
              clientes={clientes}
              onClienteClick={handleClienteClick}
              nombreRestaurante={nombreRestaurante}
            />
          </div>
          
          {/* Lista de clientes en camino */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">
              Clientes en camino ({clientes.length})
            </h3>
            
            {clientes.length === 0 ? (
              <p className="text-gray-500">No hay clientes en camino en este momento</p>
            ) : (
              <div className="overflow-y-auto max-h-[400px]">
                {clientes.map(cliente => (
                  <div 
                    key={cliente._id}
                    className={`p-3 mb-2 rounded-lg border-l-4 cursor-pointer transition-colors ${
                      selectedCliente?._id === cliente._id 
                        ? 'bg-cyan-50 border-cyan-500' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    style={{ 
                      borderLeftColor: cliente.zonaProximidad?.color || '#9e9e9e'
                    }}
                    onClick={() => handleClienteClick(cliente)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded">
                          #{cliente.numeroPedido}
                        </span>
                        <h4 className="font-medium mt-1">
                          {cliente.usuario.nombre}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          {cliente.distanciaEstimada < 1000 
                            ? `${cliente.distanciaEstimada}m` 
                            : `${(cliente.distanciaEstimada / 1000).toFixed(1)}km`}
                        </span>
                        <p className="text-xs text-gray-500">
                          {cliente.tiempoEstimadoLlegada < 60 
                            ? `${cliente.tiempoEstimadoLlegada} min` 
                            : `${Math.floor(cliente.tiempoEstimadoLlegada / 60)}h ${cliente.tiempoEstimadoLlegada % 60}min`}
                        </p>
                      </div>
                    </div>
                    
                    {selectedCliente?._id === cliente._id && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-sm">
                          <span className="font-medium">Teléfono:</span> {cliente.usuario.telefono}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <button className="bg-cyan-600 text-white px-2 py-1 text-xs rounded hover:bg-cyan-700">
                            Contactar
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded hover:bg-gray-300">
                            Ver pedido
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMapView;
