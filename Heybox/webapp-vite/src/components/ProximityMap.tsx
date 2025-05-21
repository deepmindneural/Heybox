import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

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
  zonaProximidad: {
    distancia: number;
    color: string;
  };
}

interface ProximityMapProps {
  // Propiedades para el modo completo (dashboard de restaurante)
  restauranteLat: number;
  restauranteLng: number;
  anillosProximidad?: Array<{
    distancia: number;
    color: string;
  }>;
  clientes?: Cliente[];
  onClienteClick?: (cliente: Cliente) => void;
  
  // Propiedades para el modo simplificado (página de detalle de pedido)
  usuarioLat?: number;
  usuarioLng?: number;
  nombreRestaurante?: string;
  
  // Común
  apiKey?: string;
}

const ProximityMap: React.FC<ProximityMapProps> = ({
  restauranteLat,
  restauranteLng,
  anillosProximidad = [],
  clientes = [],
  onClienteClick = () => {},
  usuarioLat,
  usuarioLng,
  nombreRestaurante,
  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: restauranteLat, lng: restauranteLng });
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  // Determinar si estamos en modo simple (rastreo de un solo usuario)
  const modoSimple = usuarioLat !== undefined && usuarioLng !== undefined;

  // Ajustar zoom para mostrar todos los puntos relevantes
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      
      // Agregar la ubicación del restaurante
      bounds.extend({ lat: restauranteLat, lng: restauranteLng });
      
      if (modoSimple && usuarioLat && usuarioLng) {
        // Modo simple: agregar ubicación del usuario
        bounds.extend({ lat: usuarioLat, lng: usuarioLng });
      } else if (clientes.length > 0) {
        // Modo completo: agregar ubicaciones de clientes
        clientes.forEach((cliente) => {
          if (cliente.ubicacionActual) {
            bounds.extend({
              lat: cliente.ubicacionActual.lat,
              lng: cliente.ubicacionActual.lng,
            });
          }
        });
      }
      
      mapRef.current.fitBounds(bounds);
      
      // Si solo hay un punto, aplicar zoom adecuado
      if (modoSimple && !usuarioLat && !usuarioLng) {
        mapRef.current.setZoom(15);
      }
    }
  }, [isLoaded, clientes, restauranteLat, restauranteLng, usuarioLat, usuarioLng, modoSimple]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleMarkerClick = (clienteId: string) => {
    setSelectedCliente(clienteId);
    const cliente = clientes.find((c) => c._id === clienteId);
    if (cliente) {
      onClienteClick(cliente);
    }
  };

  if (loadError) {
    return <div className="text-red-500 p-4">Error al cargar el mapa</div>;
  }

  if (!isLoaded) {
    return <div className="text-center p-4">Cargando mapa...</div>;
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={14}
        options={options}
        onLoad={onMapLoad}
      >
        {/* Anillos de proximidad */}
        {modoSimple ? (
          // En modo simple, mostrar un solo anillo de proximidad
          <Circle
            center={{ lat: restauranteLat, lng: restauranteLng }}
            radius={500} // 500 metros
            options={{
              strokeColor: '#4CAF50',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#4CAF50',
              fillOpacity: 0.15,
              zIndex: 10,
            }}
          />
        ) : (
          // En modo completo, mostrar todos los anillos configurados
          anillosProximidad.map((anillo, index) => (
            <Circle
              key={`circle-${index}`}
              center={{ lat: restauranteLat, lng: restauranteLng }}
              radius={anillo.distancia}
              options={{
                strokeColor: anillo.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: anillo.color,
                fillOpacity: 0.15,
                zIndex: anillosProximidad.length - index,
              }}
            />
          ))
        )}

        {/* Marcador del restaurante */}
        <Marker
          position={{ lat: restauranteLat, lng: restauranteLng }}
          icon={{
            url: '/restaurant-marker.svg',
            scaledSize: new window.google.maps.Size(40, 40),
            // Si no existe la imagen, usar un marcador predeterminado
            anchor: new window.google.maps.Point(20, 40),
          }}
          zIndex={1000}
          title={nombreRestaurante || 'Restaurante'}
        />

        {/* Marcadores de clientes o usuario */}
        {modoSimple && usuarioLat && usuarioLng ? (
          // Modo simple: mostrar marcador del usuario
          <Marker
            position={{ lat: usuarioLat, lng: usuarioLng }}
            animation={window.google.maps.Animation.BOUNCE}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#1E88E5',
              fillOpacity: 0.9,
              strokeWeight: 2,
              strokeColor: 'white',
            }}
            title="Tu ubicación actual"
          />
        ) : (
          // Modo completo: mostrar marcadores de todos los clientes
          clientes.map((cliente) => {
            if (!cliente.ubicacionActual) return null;
            
            return (
              <Marker
                key={cliente._id}
                position={{
                  lat: cliente.ubicacionActual.lat,
                  lng: cliente.ubicacionActual.lng,
                }}
                onClick={() => handleMarkerClick(cliente._id)}
                animation={
                  selectedCliente === cliente._id
                    ? window.google.maps.Animation.BOUNCE
                    : undefined
                }
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: cliente.zonaProximidad?.color || '#1E88E5',
                  fillOpacity: 0.9,
                  strokeWeight: 2,
                  strokeColor: 'white',
                }}
                label={{
                  text: cliente.numeroPedido,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              />
            );
          })
        )}
      </GoogleMap>

      {/* Leyenda - solo mostrar en modo completo o si hay anillos definidos */}
      {!modoSimple && anillosProximidad.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-bold mb-2">Zonas de proximidad</h4>
          <ul className="space-y-1">
            {anillosProximidad.map((anillo, index) => (
              <li key={`legend-${index}`} className="flex items-center">
                <span
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: anillo.color }}
                ></span>
                <span className="text-xs">
                  {anillo.distancia < 1000
                    ? `${anillo.distancia} m`
                    : `${(anillo.distancia / 1000).toFixed(1)} km`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Distancia en modo simple */}
      {modoSimple && usuarioLat && usuarioLng && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-bold mb-2">Información</h4>
          <div className="text-xs">
            <p>Distancia aproximada: 0.5 km</p>
            <p>Tiempo estimado: 5-10 min</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProximityMap;
