import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../services/socket';
import { fetchOrderDetails, updateOrderLocation } from '../../services/api';

interface Location {
  lat: number;
  lng: number;
}

interface OrderTrackingProps {
  apiKey?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const OrderTracking: React.FC<OrderTrackingProps> = ({ apiKey }) => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [restaurantLocation, setRestaurantLocation] = useState<Location | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

  const googleMapsApiKey = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey
  });

  // Función para cargar datos del pedido
  const loadOrderData = useCallback(async () => {
    if (!id || !isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderData = await fetchOrderDetails(id);
      setOrder(orderData);
      
      if (orderData.restaurante?.ubicacion) {
        setRestaurantLocation({
          lat: orderData.restaurante.ubicacion.lat,
          lng: orderData.restaurante.ubicacion.lng
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar los detalles del pedido');
      console.error('Error al cargar detalles del pedido:', err);
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  // Iniciar seguimiento de ubicación del usuario
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador');
      return;
    }
    
    // Opciones para el seguimiento de ubicación
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    // Función de éxito para la geolocalización
    const success = (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      setUserLocation(location);
      
      // Solo enviar actualización si el pedido está en un estado que lo permite
      if (order && ['confirmado', 'en_preparacion', 'listo'].includes(order.estado)) {
        updateOrderLocation(order._id, {
          lat: location.lat,
          lng: location.lng,
          precision: position.coords.accuracy,
          velocidad: position.coords.speed,
          altitud: position.coords.altitude,
          rumbo: position.coords.heading
        }).catch(err => {
          console.error('Error al actualizar ubicación:', err);
        });
        
        // Emitir evento de socket para actualización en tiempo real
        socket.emit('user:location_update', {
          pedidoId: order._id,
          location
        });
      }
    };
    
    // Función de error para la geolocalización
    const error = (err: GeolocationPositionError) => {
      console.error('Error en la geolocalización:', err);
      setError(`Error en la geolocalización: ${err.message}`);
    };
    
    // Iniciar el seguimiento de ubicación
    const id = navigator.geolocation.watchPosition(success, error, options);
    setWatchId(id);
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [order, watchId]);

  // Calcular la ruta desde la ubicación del usuario hasta el restaurante
  const calculateRoute = useCallback(() => {
    if (!isLoaded || !userLocation || !restaurantLocation) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route({
      origin: userLocation,
      destination: restaurantLocation,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
        
        // Calcular tiempo estimado de llegada
        if (result?.routes[0]?.legs[0]?.duration?.text) {
          setEstimatedTime(result.routes[0].legs[0].duration.text);
        }
      } else {
        console.error('Error al calcular la ruta:', status);
        setError('No se pudo calcular la ruta al restaurante');
      }
    });
  }, [isLoaded, userLocation, restaurantLocation]);

  // Efecto para cargar datos del pedido
  useEffect(() => {
    if (isAuthenticated) {
      loadOrderData();
    } else {
      navigate('/login', { state: { from: `/order/${id}` } });
    }
  }, [id, isAuthenticated, loadOrderData, navigate]);

  // Efecto para iniciar el seguimiento de ubicación
  useEffect(() => {
    if (order && isAuthenticated) {
      const cleanup = startLocationTracking();
      
      // Escuchar actualizaciones de estado del pedido
      socket.on(`pedido:${order._id}:update`, (updatedOrder) => {
        setOrder(updatedOrder);
      });
      
      return () => {
        cleanup();
        socket.off(`pedido:${order._id}:update`);
      };
    }
  }, [order, isAuthenticated, startLocationTracking]);

  // Efecto para calcular la ruta cuando cambian las ubicaciones
  useEffect(() => {
    if (userLocation && restaurantLocation) {
      calculateRoute();
    }
  }, [userLocation, restaurantLocation, calculateRoute]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar el seguimiento</h3>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={loadOrderData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Pedido no encontrado</h3>
        <p className="text-gray-600">No se pudo encontrar información para este pedido.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ver mis pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Seguimiento del pedido #{order._id.substring(0, 8)}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Estado:</span>
          <span className={`font-medium ${
            order.estado === 'completado' ? 'text-green-600' :
            order.estado === 'cancelado' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {order.estado === 'pendiente' ? 'Pendiente' :
             order.estado === 'confirmado' ? 'Confirmado' :
             order.estado === 'en_preparacion' ? 'En preparación' :
             order.estado === 'listo' ? 'Listo para recoger' :
             order.estado === 'completado' ? 'Completado' :
             order.estado === 'cancelado' ? 'Cancelado' : 
             order.estado}
          </span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Restaurante:</span>
          <span className="font-medium text-gray-800">{order.restaurante?.nombre || 'No disponible'}</span>
        </div>
        
        {estimatedTime && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tiempo estimado:</span>
            <span className="font-medium text-gray-800">{estimatedTime}</span>
          </div>
        )}
      </div>
      
      <div className="mb-4 h-[400px] w-full rounded-lg overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || restaurantLocation || { lat: 4.6097, lng: -74.0817 }} // Default to Bogotá if no locations
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: '/images/user-marker.png',
                  scaledSize: new window.google.maps.Size(32, 32)
                }}
              />
            )}
            
            {restaurantLocation && (
              <Marker
                position={restaurantLocation}
                icon={{
                  url: '/images/restaurant-marker.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }}
              />
            )}
            
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: '#4f46e5',
                    strokeWeight: 5
                  }
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-800 mb-2">Instrucciones</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Dirígete al restaurante usando la ruta mostrada en el mapa.</li>
          <li>Cuando llegues, muestra el código del pedido: <span className="font-bold">{order.codigoRetiro || order._id.substring(0, 6).toUpperCase()}</span></li>
          <li>Verifica que todos los items del pedido estén completos antes de salir.</li>
        </ol>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => navigate(`/order/${order._id}`)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Ver detalles del pedido
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Actualizar ubicación
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
