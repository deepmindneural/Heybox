import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface Transaccion {
  id: string;
  tipo: 'compra' | 'gasto' | 'recarga' | 'reembolso';
  monto: number;
  fecha: Date;
  concepto: string;
  restauranteId?: string;
  restauranteNombre?: string;
  referencia?: string;
}

interface PlanCredito {
  id: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  precio: number;
  popular?: boolean;
  color?: string;
}

interface EstadisticasCredito {
  totalGastado: number;
  promedioMensual: number;
  transaccionesPorCategoria: {
    categoria: string;
    porcentaje: number;
    monto: number;
  }[];
}

interface CreditosContextProps {
  saldo: number;
  creditosDisponibles: number;
  transacciones: Transaccion[];
  planes: PlanCredito[];
  estadisticas: EstadisticasCredito | null;
  cargando: boolean;
  error: string | null;
  cargarCreditos: () => Promise<void>;
  cargarCreditosUsuario: () => Promise<void>;
  cargarTransacciones: () => Promise<void>;
  cargarPlanes: () => Promise<void>;
  cargarEstadisticas: () => Promise<void>;
  comprarCreditos: (planId: string, metodoPago: string) => Promise<boolean>;
  utilizarCreditos: (monto: number, concepto: string, restauranteId?: string) => Promise<boolean>;
}

const CreditosContext = createContext<CreditosContextProps | undefined>(undefined);

export const useCreditos = () => {
  const context = useContext(CreditosContext);
  if (!context) {
    throw new Error('useCreditos debe ser usado dentro de un CreditosProvider');
  }
  return context;
};

export const CreditosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, token, isAuthenticated } = useAuth();
  const [saldo, setSaldo] = useState<number>(0);
  const [creditosDisponibles, setCreditosDisponibles] = useState<number>(0);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [planes, setPlanes] = useState<PlanCredito[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasCredito | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  // Cargar el saldo de créditos del usuario
  const cargarCreditos = async () => {
    if (!isAuthenticated || !usuario) return;
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.get('/creditos/saldo');
      setSaldo(res.data.saldo);
      setCreditosDisponibles(res.data.saldo);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar saldo de créditos');
      console.error('Error al cargar saldo:', err);
    } finally {
      setCargando(false);
    }
  };

  // Alias para cargarCreditos para compatibilidad con la página de inicio
  const cargarCreditosUsuario = cargarCreditos;

  // Cargar historial de transacciones
  const cargarTransacciones = async () => {
    if (!isAuthenticated || !usuario) return;
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.get('/creditos/transacciones');
      setTransacciones(res.data.transacciones.map((t: any) => ({
        ...t,
        fecha: new Date(t.fecha)
      })));
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar transacciones');
      console.error('Error al cargar transacciones:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cargar planes disponibles
  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.get('/creditos/planes');
      setPlanes(res.data.planes);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar planes');
      console.error('Error al cargar planes:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cargar estadísticas de uso de créditos
  const cargarEstadisticas = async () => {
    if (!isAuthenticated || !usuario) return;
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.get('/creditos/estadisticas');
      setEstadisticas(res.data.estadisticas);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar estadísticas');
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setCargando(false);
    }
  };

  // Comprar créditos según un plan seleccionado
  const comprarCreditos = async (planId: string, metodoPago: string): Promise<boolean> => {
    if (!isAuthenticated || !usuario) return false;
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.post('/creditos/comprar', {
        planId,
        metodoPago
      });
      
      setSaldo(prev => prev + res.data.creditosAgregados);
      
      // Refrescar transacciones para mostrar la compra reciente
      await cargarTransacciones();
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al comprar créditos');
      console.error('Error al comprar créditos:', err);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Utilizar créditos (para hacer un pedido por ejemplo)
  const utilizarCreditos = async (monto: number, concepto: string, restauranteId?: string): Promise<boolean> => {
    if (!isAuthenticated || !usuario) return false;
    
    if (saldo < monto) {
      setError('Saldo insuficiente para completar esta operación');
      return false;
    }
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await api.post('/creditos/utilizar', {
        monto,
        concepto,
        restauranteId
      });
      
      setSaldo(prev => prev - monto);
      
      // Refrescar transacciones para mostrar el gasto reciente
      await cargarTransacciones();
      
      return true;
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al utilizar créditos');
      console.error('Error al utilizar créditos:', err);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Inicializar datos cuando cambia el usuario autenticado
  useEffect(() => {
    if (isAuthenticated && usuario) {
      cargarCreditos();
      cargarTransacciones();
      cargarEstadisticas();
    } else {
      // Reiniciar estado cuando el usuario cierra sesión
      setSaldo(0);
      setTransacciones([]);
      setEstadisticas(null);
    }
  }, [isAuthenticated, usuario]);

  // Cargar planes al iniciar, no depende de autenticación
  useEffect(() => {
    cargarPlanes();
  }, []);

  return (
    <CreditosContext.Provider
      value={{
        saldo,
        creditosDisponibles,
        transacciones,
        planes,
        estadisticas,
        cargando,
        error,
        cargarCreditos,
        cargarCreditosUsuario,
        cargarTransacciones,
        cargarPlanes,
        cargarEstadisticas,
        comprarCreditos,
        utilizarCreditos
      }}
    >
      {children}
    </CreditosContext.Provider>
  );
};

export default CreditosContext;
