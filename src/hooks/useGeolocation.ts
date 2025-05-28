import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  error: string | null;
  isTracking: boolean;
}

interface UseGeolocationProps {
  pedidoId?: string;
  enableHighAccuracy?: boolean;
  trackingInterval?: number;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
}

/**
 * Hook personalizado para manejar la geolocalización en tiempo real
 */
const useGeolocation = ({
  pedidoId,
  enableHighAccuracy = true,
  trackingInterval = 10000, // 10 segundos por defecto
  onLocationUpdate
}: UseGeolocationProps = {}) => {
  const [state, setState] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    accuracy: null,
    speed: null,
    heading: null,
    altitude: null,
    error: null,
    isTracking: false
  });
  
  const [watchId, setWatchId] = useState<number | null>(null);
  
  // Función para obtener la ubicación actual
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'La geolocalización no está soportada por tu navegador' 
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
        
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          altitude,
          error: null
        }));
        
        if (onLocationUpdate) {
          onLocationUpdate({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        setState(prev => ({ 
          ...prev, 
          error: obtenerMensajeError(error.code) 
        }));
      },
      { enableHighAccuracy }
    );
  }, [enableHighAccuracy, onLocationUpdate]);
  
  // Función para iniciar el seguimiento en tiempo real
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'La geolocalización no está soportada por tu navegador' 
      }));
      return;
    }
    
    // Si ya hay un seguimiento activo, detenerlo primero
    if (watchId !== null) {
      stopTracking();
    }
    
    // Iniciar el nuevo seguimiento
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
        
        setState(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          altitude,
          error: null,
          isTracking: true
        }));
        
        // Si tenemos ID de pedido, enviar actualización al servidor
        if (pedidoId) {
          try {
            await axios.post('/api/location/update', {
              pedidoId,
              lat: latitude,
              lng: longitude,
              precision: accuracy || 0,
              velocidad: speed || 0,
              altitud: altitude || 0,
              rumbo: heading || 0
            });
          } catch (error) {
            console.error('Error al actualizar ubicación:', error);
          }
        }
        
        if (onLocationUpdate) {
          onLocationUpdate({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        setState(prev => ({ 
          ...prev, 
          error: obtenerMensajeError(error.code),
          isTracking: false
        }));
      },
      { 
        enableHighAccuracy, 
        maximumAge: trackingInterval / 2,
        timeout: trackingInterval * 2
      }
    );
    
    setWatchId(id);
    
    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [enableHighAccuracy, trackingInterval, watchId, pedidoId, onLocationUpdate]);
  
  // Función para detener el seguimiento
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setState(prev => ({
        ...prev,
        isTracking: false
      }));
    }
  }, [watchId]);
  
  // Obtener la ubicación inicial al montar el componente
  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);
  
  // Limpiar el seguimiento al desmontar el componente
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);
  
  // Función auxiliar para traducir códigos de error
  const obtenerMensajeError = (errorCode: number): string => {
    switch (errorCode) {
      case 1:
        return 'No has dado permiso para acceder a tu ubicación';
      case 2:
        return 'No se pudo determinar tu ubicación';
      case 3:
        return 'Se agotó el tiempo de espera al obtener tu ubicación';
      default:
        return 'Error desconocido al obtener tu ubicación';
    }
  };
  
  return {
    ...state,
    getCurrentPosition,
    startTracking,
    stopTracking
  };
};

export default useGeolocation;
