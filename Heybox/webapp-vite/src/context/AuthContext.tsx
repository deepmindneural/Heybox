import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { dbService } from '../services/dbService';

// Determinar si estamos en modo de desarrollo local
const isLocalDevelopment = true; // Cambiar a false para usar la API remota

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

  const API_URL = 'http://localhost:5001/api';

  // Configurar interceptor de Axios para incluir el token
  useEffect(() => {
    if (!isLocalDevelopment && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else if (!isLocalDevelopment) {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Cargar el usuario si hay un token
  const cargarUsuario = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (isLocalDevelopment) {
        // Usar SQLite para desarrollo local
        const session = dbService.validateSession(token);
        if (session) {
          const usuario = dbService.getUserProfile(session.user_id);
          if (usuario) {
            setUsuario({
              id: usuario.id,
              nombre: usuario.name,
              email: usuario.email,
              rol: usuario.role,
              profile_image: usuario.profile_image
            });
            setIsAuthenticated(true);
          } else {
            throw new Error('Usuario no encontrado');
          }
        } else {
          throw new Error('Sesión inválida o expirada');
        }
      } else {
        // Usar API remota
        const res = await axios.get(`${API_URL}/auth/perfil`);
        setUsuario(res.data.usuario);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setToken(null);
      setUsuario(null);
      setIsAuthenticated(false);
      setError('Sesión expirada. Por favor inicia sesión nuevamente.');
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
      if (isLocalDevelopment) {
        // Usar SQLite para desarrollo local
        const user = dbService.findUserByEmail(email);
        
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        
        const isValidPassword = dbService.validatePassword(email, password);
        
        if (!isValidPassword) {
          throw new Error('Contraseña incorrecta');
        }
        
        // Crear sesión
        const session = dbService.createSession(user.id as number);
        
        // Almacenar token según preferencia de usuario
        if (rememberMe) {
          localStorage.setItem('token', session.token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', session.token);
          localStorage.removeItem('token');
        }
        
        // Convertir el modelo de datos
        const userFormatted: Usuario = {
          id: user.id as number,
          nombre: user.name,
          email: user.email,
          rol: user.role
        };
        
        setToken(session.token);
        setUsuario(userFormatted);
        setIsAuthenticated(true);
      } else {
        // Usar API remota
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
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
      }
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
      if (isLocalDevelopment) {
        // Usar SQLite para desarrollo local
        // Validar datos básicos
        if (!datosUsuario.email || !datosUsuario.password || !datosUsuario.nombre) {
          throw new Error('Todos los campos son obligatorios');
        }
        
        // Verificar si el usuario ya existe
        const existingUser = dbService.findUserByEmail(datosUsuario.email);
        if (existingUser) {
          throw new Error('El correo electrónico ya está registrado');
        }
        
        // Crear nuevo usuario
        const newUser = dbService.createUser({
          email: datosUsuario.email,
          password: datosUsuario.password,
          name: datosUsuario.nombre,
          role: datosUsuario.rol || 'customer'
        });
        
        // Crear sesión
        const session = dbService.createSession(newUser.id as number);
        
        // Convertir el modelo de datos
        const userFormatted: Usuario = {
          id: newUser.id as number,
          nombre: newUser.name,
          email: newUser.email,
          rol: newUser.role
        };
        
        // Guardar token en localStorage
        localStorage.setItem('token', session.token);
        
        setToken(session.token);
        setUsuario(userFormatted);
        setIsAuthenticated(true);
      } else {
        // Usar API remota
        const res = await axios.post(`${API_URL}/auth/registro`, datosUsuario);
        const { token: nuevoToken, usuario: nuevoUsuario } = res.data;

        // Guardar token en localStorage
        localStorage.setItem('token', nuevoToken);
        setToken(nuevoToken);
        setUsuario(nuevoUsuario);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      const mensajeError = err.message || 'Error al registrarse';
      setError(mensajeError);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (isLocalDevelopment && token) {
      // Eliminar la sesión de SQLite
      dbService.deleteSession(token);
    }
    
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
      if (isLocalDevelopment) {
        // Usar SQLite para desarrollo local
        if (!usuario?.id) {
          throw new Error('No hay un usuario autenticado');
        }
        
        // Actualizar perfil
        const result = dbService.updateUserProfile(usuario.id, {
          name: datosActualizacion.nombre,
          profile_image: datosActualizacion.profile_image
        });
        
        if (result.changes > 0) {
          // Obtener el perfil actualizado
          const updatedProfile = dbService.getUserProfile(usuario.id);
          
          // Actualizar el estado
          setUsuario({
            ...usuario,
            nombre: updatedProfile.name,
            profile_image: updatedProfile.profile_image
          });
          
          return { success: true, usuario: updatedProfile };
        } else {
          throw new Error('No se pudo actualizar el perfil');
        }
      } else {
        // Usar API remota
        const res = await axios.put(`${API_URL}/auth/perfil`, datosActualizacion);
        setUsuario(res.data.usuario);
        return res.data;
      }
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
