import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaStore, FaMotorcycle } from 'react-icons/fa';

interface OrderTrackingMapProps {
  userLocation: { lat: number; lng: number } | null;
  restaurantLocation: { lat: number; lng: number } | null;
  driverLocation: { lat: number; lng: number } | null;
  googleMapsApiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({
  userLocation,
  restaurantLocation,
  driverLocation,
  googleMapsApiKey
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey
  });

  // Establecer el centro del mapa basado en las ubicaciones disponibles
  useEffect(() => {
    if (driverLocation) {
      setMapCenter(driverLocation);
    } else if (restaurantLocation) {
      setMapCenter(restaurantLocation);
    } else if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [driverLocation, restaurantLocation, userLocation]);

  // Calcular la ruta cuando cambian las ubicaciones
  useEffect(() => {
    if (isLoaded && window.google && driverLocation && userLocation) {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: new google.maps.LatLng(driverLocation.lat, driverLocation.lng),
          destination: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error al calcular la ruta: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, driverLocation, userLocation]);

  if (loadError) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
        Error al cargar Google Maps. Por favor, intenta de nuevo más tarde.
      </div>
    );
  }

  if (!isLoaded || !mapCenter) {
    return (
      <div className="bg-gray-100 animate-pulse h-[400px] rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* Marcador del restaurante */}
        {restaurantLocation && (
          <Marker
            position={restaurantLocation}
            icon={{
              url: `data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4B5563" width="36px" height="36px">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Marcador del cliente */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: `data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1D4ED8" width="36px" height="36px">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40)
            }}
          />
        )}

        {/* Marcador del repartidor */}
        {driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              url: `data:image/svg+xml;utf8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#DC2626" width="36px" height="36px">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z"/>
                  <path d="M5 6h5v2H5zm14 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }}
          />
        )}

        {/* Mostrar ruta */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#1E40AF',
                strokeWeight: 5,
                strokeOpacity: 0.7
              }
            }}
          />
        )}
      </GoogleMap>

      {/* Leyenda del mapa */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-2 flex justify-center space-x-6 text-xs font-medium">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-blue-700 rounded-full mr-1"></div>
          <span>Tu ubicación</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-gray-600 rounded-full mr-1"></div>
          <span>Restaurante</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-red-600 rounded-full mr-1"></div>
          <span>Repartidor</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingMap;
