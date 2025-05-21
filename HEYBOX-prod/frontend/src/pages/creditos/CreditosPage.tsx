import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCreditos } from '../../context/CreditosContext';
import ResumenCreditos from '../../components/creditos/ResumenCreditos';
import HistorialTransacciones from '../../components/creditos/HistorialTransacciones';
import PlanesCredito from '../../components/creditos/PlanesCredito';

// Componente para mostrar las estadísticas con gráficos
const EstadisticasCredito: React.FC = () => {
  const { estadisticas, cargando, error, cargarEstadisticas } = useCreditos();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  if (cargando) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Uso</h3>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error al cargar estadísticas: {error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => cargarEstadisticas()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Uso</h3>
        <p className="text-gray-500">No hay datos suficientes para mostrar estadísticas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Uso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-gray-700 mb-2">Resumen de Gastos</h4>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-cyan-700">
              ${estadisticas.totalGastado.toLocaleString('es-CO')}
            </span>
            <span className="text-sm text-gray-500">total gastado</span>
          </div>
          <div className="text-sm text-gray-600">
            Promedio mensual: ${estadisticas.promedioMensual.toLocaleString('es-CO')}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-base font-medium text-gray-700 mb-2">Restaurantes Favoritos</h4>
          {estadisticas.transaccionesPorCategoria.length > 0 ? (
            <div className="space-y-2">
              {estadisticas.transaccionesPorCategoria.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>{cat.categoria}</span>
                    <span className="font-medium">${cat.monto.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full" 
                      style={{ width: `${cat.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hay datos disponibles</p>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-cyan-50 border border-cyan-100 rounded-lg">
        <h4 className="text-base font-medium text-cyan-800 mb-2">Recomendaciones</h4>
        <ul className="text-sm text-cyan-700 space-y-1 list-disc list-inside">
          <li>
            {estadisticas.promedioMensual > 50 ? 
              'Considera comprar un plan de créditos grande para ahorrar dinero.' :
              'Un pequeño plan de créditos cubre tus necesidades actuales.'}
          </li>
          <li>
            {estadisticas.transaccionesPorCategoria.length > 2 ?
              'Explora nuevas opciones de restaurantes para variar tu experiencia.' :
              'Prueba otros restaurantes disponibles para diversificar tus opciones.'}
          </li>
          <li>
            Completa tu perfil para recibir descuentos y promociones personalizadas.
          </li>
        </ul>
      </div>
    </div>
  );
};

// Interfaz para las props del componente CreditosPage
interface CreditosPageProps {
  section?: string; // Sección a mostrar: 'historial', 'comprar', etc.
}

// Página principal de créditos
const CreditosPage: React.FC<CreditosPageProps> = ({ section }) => {
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState(section || 'historial');

  useEffect(() => {
    // Redirigir si el usuario no está autenticado
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/creditos' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Actualizar sección activa cuando cambia la prop section
  useEffect(() => {
    if (section) {
      setSeccionActiva(section);
    }
  }, [section]);

  if (!isAuthenticated || !usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 bg-white rounded-lg shadow text-center">
          <p className="text-lg">Debes iniciar sesión para acceder a esta página</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-cyan-600 text-white py-2 px-6 rounded-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Columna lateral */}
          <div className="w-full md:w-1/3 space-y-6">
            <ResumenCreditos />
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Créditos</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setSeccionActiva('historial')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    seccionActiva === 'historial' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Historial de Transacciones
                </button>
                <button 
                  onClick={() => setSeccionActiva('planes')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    seccionActiva === 'planes' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Planes de Créditos
                </button>
                <button 
                  onClick={() => setSeccionActiva('estadisticas')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md ${
                    seccionActiva === 'estadisticas' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Estadísticas y Análisis
                </button>
              </nav>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="w-full md:w-2/3">
            {seccionActiva === 'historial' && <HistorialTransacciones />}
            {seccionActiva === 'planes' && <PlanesCredito />}
            {seccionActiva === 'estadisticas' && <EstadisticasCredito />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditosPage;
