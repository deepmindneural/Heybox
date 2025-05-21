import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface LocationContextProps {
  ubicacionActual: { lat: number; lng: number } | null;
  error: string | null;
  isTracking: boolean;
  pedidoActivo: string | null;
  iniciarSeguimiento: (pedidoId: string) => Promise<void>;
  detenerSeguimiento: () => void;
  distanciaEstimada: number | null;
  tiempoEstimadoLlegada: number | null;
}

interface LocationState {
  ubicacionActual: { lat: number; lng: number } | null;
  error: string | null;
  isTracking: boolean;
  pedidoActivo: string | null;
  distanciaEstimada: number | null;
  tiempoEstimadoLlegada: number | null;
  watchId: number | null;
}

const initialState: LocationState = {
  ubicacionActual: null,
  error: null,
  isTracking: false,
  pedidoActivo: null,
  distanciaEstimada: null,
  tiempoEstimadoLlegada: null,
  watchId: null,
};

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation debe ser usado dentro de un LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocationState>(initialState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated, token } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

  // Inicializar el socket
  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, token, SOCKET_URL]);

  // Función para enviar ubicación al servidor
  const enviarUbicacion = useCallback(
    async (lat: number, lng: number, pedidoId: string) => {
      if (!isAuthenticated || !pedidoId) return;

      try {
        const response = await axios.post(`${API_URL}/location/update`, {
          lat,
          lng,
          pedidoId,
          precision: 10, // Valor estimado
          velocidad: 0, // Valor estimado
        });

        const { distanciaEstimada, tiempoEstimadoLlegada } = response.data.pedido;

        setState(prevState => ({
          ...prevState,
          distanciaEstimada,
          tiempoEstimadoLlegada
        }));

        // Emitir la ubicación por socket.io
        if (socket) {
          socket.emit('updateLocation', {
            pedidoId,
            lat,
            lng,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error al enviar ubicación:', error);
      }
    },
    [isAuthenticated, API_URL, socket]
  );

  // Función para manejar cambios en la ubicación
  const handlePositionChange = useCallback(
    (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      setState(prevState => ({
        ...prevState,
        ubicacionActual: { lat: latitude, lng: longitude },
        error: null
      }));

      if (state.pedidoActivo) {
        enviarUbicacion(latitude, longitude, state.pedidoActivo);
      }
    },
    [state.pedidoActivo, enviarUbicacion]
  );

  // Función para manejar errores de geolocalización
  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    let errorMsg: string;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMsg = "Usuario denegó la solicitud de geolocalización.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMsg = "Información de ubicación no disponible.";
        break;
      case error.TIMEOUT:
        errorMsg = "Tiempo de espera agotado para obtener la ubicación.";
        break;
      default:
        errorMsg = "Error desconocido al obtener la ubicación.";
        break;
    }

    setState(prevState => ({
      ...prevState,
      error: errorMsg,
      isTracking: false,
      watchId: null
    }));
  }, []);

  // Iniciar seguimiento de ubicación
  const iniciarSeguimiento = async (pedidoId: string) => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        error: "Geolocalización no soportada en este navegador.",
        isTracking: false
      }));
      return;
    }

    try {
      // Obtener ubicación inicial
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Iniciar el seguimiento continuo
          const watchId = navigator.geolocation.watchPosition(
            handlePositionChange,
            handleLocationError,
            {
              enableHighAccuracy: true,
              maximumAge: 10000,
              timeout: 5000
            }
          );

          setState(prevState => ({
            ...prevState,
            ubicacionActual: { lat: latitude, lng: longitude },
            isTracking: true,
            pedidoActivo: pedidoId,
            watchId
          }));

          // Enviar ubicación inicial
          enviarUbicacion(latitude, longitude, pedidoId);
        },
        handleLocationError,
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.error('Error al iniciar seguimiento:', error);
      setState(prevState => ({
        ...prevState,
        error: "Error al iniciar el seguimiento de ubicación",
        isTracking: false
      }));
    }
  };

  // Detener seguimiento de ubicación
  const detenerSeguimiento = () => {
    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
    }

    setState(prevState => ({
      ...prevState,
      isTracking: false,
      pedidoActivo: null,
      watchId: null
    }));
  };

  // Detener seguimiento cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
      }
    };
  }, [state.watchId]);

  return (
    <LocationContext.Provider
      value={{
        ubicacionActual: state.ubicacionActual,
        error: state.error,
        isTracking: state.isTracking,
        pedidoActivo: state.pedidoActivo,
        iniciarSeguimiento,
        detenerSeguimiento,
        distanciaEstimada: state.distanciaEstimada,
        tiempoEstimadoLlegada: state.tiempoEstimadoLlegada
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
