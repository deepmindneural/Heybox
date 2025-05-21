import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: {
    calle: string;
    ciudad: string;
    codigoPostal: string;
  };
  rol: string;
  metodosPago?: Array<{
    tipo: string;
    detalles: {
      ultimosDigitos: string;
      fechaExpiracion: string;
      titular: string;
    };
  }>;
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Configurar interceptor de Axios para incluir el token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Cargar el usuario si hay un token
  useEffect(() => {
    const cargarUsuario = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/perfil`);
        setUsuario(res.data.usuario);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
        setIsAuthenticated(false);
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [token, API_URL]);

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: nuevoToken, usuario: nuevoUsuario } = res.data;

      // Guardar token en localStorage
      localStorage.setItem('token', nuevoToken);
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      const mensajeError = err.response?.data?.mensaje || 'Error al iniciar sesión';
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
      const res = await axios.post(`${API_URL}/auth/registro`, datosUsuario);
      const { token: nuevoToken, usuario: nuevoUsuario } = res.data;

      // Guardar token en localStorage
      localStorage.setItem('token', nuevoToken);
      setToken(nuevoToken);
      setUsuario(nuevoUsuario);
      setIsAuthenticated(true);
    } catch (err: any) {
      const mensajeError = err.response?.data?.mensaje || 'Error al registrarse';
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
      const res = await axios.put(`${API_URL}/auth/perfil`, datosActualizacion);
      setUsuario(res.data.usuario);
      return res.data;
    } catch (err: any) {
      const mensajeError = err.response?.data?.mensaje || 'Error al actualizar perfil';
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
