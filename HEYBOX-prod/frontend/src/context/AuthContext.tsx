import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface Usuario {
  id?: number; // Para SQLite
  _id?: string; // Para MongoDB/API remota
  nombre: string;
  email: string;
  telefono?: string;
  rol: string;
  profile_image?: string;
  // Otros campos como se necesiten
}

interface AuthContextProps {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (datosUsuario: any) => Promise<void>;
  logout: () => void;
  actualizarPerfil: (datosActualizacion: any) => Promise<void>;
  clearError: () => void;
  registro?: (datosUsuario: any) => Promise<void>; // Para compatibilidad con código existente
  initialize: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || sessionStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!(localStorage.getItem('token') || sessionStorage.getItem('token')));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  // Cargar el usuario si hay un token
  const cargarUsuario = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/perfil');
      setUsuario(res.data.usuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Error al cargar usuario:', err);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setToken(null);
      setUsuario(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.mensaje || 'Sesión expirada. Por favor inicia sesión nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para inicializar y cargar el usuario
  const initialize = async () => {
    setLoading(true);
    try {
      await cargarUsuario();
    } catch (error) {
      console.error('Error en inicialización:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: nuevoToken, usuario: nuevoUsuario } = res.data;

      // Almacenar token según preferencia de usuario
      if (rememberMe) {
        localStorage.setItem('token', nuevoToken);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', nuevoToken);
        localStorage.removeItem('token');
      }
      
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al iniciar sesión';
      setError(mensajeError);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (datosUsuario: any) => {
    setLoading(true);
    setError(null);

    try {
      // Validar datos básicos
      if (!datosUsuario.email || !datosUsuario.password || !datosUsuario.nombre) {
        throw new Error('Todos los campos son obligatorios');
      }

      const res = await api.post('/auth/registro', datosUsuario);
      const { token: nuevoToken, usuario: nuevoUsuario } = res.data;

      // Guardar token en localStorage
      localStorage.setItem('token', nuevoToken);
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al registrarse';
      setError(mensajeError);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const actualizarPerfil = async (datosActualizacion: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.put('/auth/perfil', datosActualizacion);
      setUsuario(res.data.usuario);
      return res.data;
    } catch (err: any) {
      const mensajeError = err.message || 'Error al actualizar perfil';
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        registro: register, // Mantener para compatibilidad
        logout,
        actualizarPerfil,
        clearError,
        initialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
