import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

interface Transaccion {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    email: string;
  };
  tipo: 'compra' | 'gasto' | 'recarga' | 'reembolso';
  monto: number;
  fecha: string;
  concepto: string;
  restaurante?: {
    _id: string;
    nombre: string;
  };
  referencia?: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'fallida';
}

interface PlanCredito {
  _id: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  precio: number;
  popular: boolean;
  color: string;
  activo: boolean;
  orden: number;
}

const AdminCreditosPage: React.FC = () => {
  const { isAuthenticated, usuario, token } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('transacciones');
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [planes, setPlanes] = useState<PlanCredito[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros y paginación
  const [filtro, setFiltro] = useState({
    tipo: '',
    usuario: '',
    fechaDesde: '',
    fechaHasta: '',
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (isAuthenticated && usuario) {
      if (usuario.rol !== 'admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login', { state: { from: '/admin/creditos' } });
    }
  }, [isAuthenticated, usuario, navigate]);

  // Configurar axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Cargar transacciones
  const cargarTransacciones = async () => {
    setCargando(true);
    setError(null);
    
    try {
      let url = `${API_URL}/api/creditos/admin/todas-transacciones?pagina=${paginaActual}`;
      
      // Añadir filtros si están presentes
      if (filtro.tipo) url += `&tipo=${filtro.tipo}`;
      if (filtro.usuario) url += `&usuario=${filtro.usuario}`;
      if (filtro.fechaDesde) url += `&fechaDesde=${filtro.fechaDesde}`;
      if (filtro.fechaHasta) url += `&fechaHasta=${filtro.fechaHasta}`;
      
      const res = await axios.get(url);
      
      setTransacciones(res.data.transacciones);
      setTotalPaginas(res.data.paginacion.totalPaginas);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar transacciones');
      console.error('Error al cargar transacciones:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cargar planes
  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const res = await axios.get(`${API_URL}/api/creditos/planes`);
      setPlanes(res.data.planes);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al cargar planes');
      console.error('Error al cargar planes:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cargar datos según la sección activa
  useEffect(() => {
    if (seccionActiva === 'transacciones') {
      cargarTransacciones();
    } else if (seccionActiva === 'planes') {
      cargarPlanes();
    }
  }, [seccionActiva, paginaActual, filtro]);

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener color según el tipo de transacción
  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'compra':
        return 'bg-green-100 text-green-800';
      case 'gasto':
        return 'bg-red-100 text-red-800';
      case 'recarga':
        return 'bg-blue-100 text-blue-800';
      case 'reembolso':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Manejar cambio de filtros
  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
    setPaginaActual(1); // Resetear a primera página al filtrar
  };

  // Componente de gestión de transacciones
  const TransaccionesAdmin = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Transacciones</h3>
      
      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              name="tipo"
              value={filtro.tipo}
              onChange={handleFiltroChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Todos</option>
              <option value="compra">Compra</option>
              <option value="gasto">Gasto</option>
              <option value="recarga">Recarga</option>
              <option value="reembolso">Reembolso</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              value={filtro.usuario}
              onChange={handleFiltroChange}
              placeholder="ID o email"
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              name="fechaDesde"
              value={filtro.fechaDesde}
              onChange={handleFiltroChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              name="fechaHasta"
              value={filtro.fechaHasta}
              onChange={handleFiltroChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              setFiltro({
                tipo: '',
                usuario: '',
                fechaDesde: '',
                fechaHasta: '',
              });
              setPaginaActual(1);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
          >
            Limpiar
          </button>
          <button
            onClick={cargarTransacciones}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md"
          >
            Filtrar
          </button>
        </div>
      </div>
      
      {/* Tabla de transacciones */}
      {cargando ? (
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-b border-gray-200 py-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={cargarTransacciones}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transacciones.length > 0 ? (
                  transacciones.map((transaccion) => (
                    <tr key={transaccion._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(transaccion.fecha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{transaccion.usuario.nombre}</div>
                        <div className="text-xs text-gray-500">{transaccion.usuario.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${obtenerColorTipo(transaccion.tipo)}`}>
                          {transaccion.tipo === 'compra' ? 'Compra' :
                           transaccion.tipo === 'gasto' ? 'Consumo' :
                           transaccion.tipo === 'recarga' ? 'Recarga' :
                           transaccion.tipo === 'reembolso' ? 'Reembolso' : 
                           transaccion.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="line-clamp-2">
                          {transaccion.concepto}
                          {transaccion.restaurante && (
                            <span className="block text-xs text-gray-500 mt-1">
                              {transaccion.restaurante.nombre}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                        transaccion.tipo === 'gasto' ? 'text-red-600' : 
                        transaccion.tipo === 'compra' || transaccion.tipo === 'recarga' ? 'text-green-600' : 
                        'text-gray-900'
                      }`}>
                        {transaccion.tipo === 'gasto' ? '-' : '+'}
                        {transaccion.monto.toLocaleString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button className="text-cyan-600 hover:text-cyan-900 mx-1">
                          Ver
                        </button>
                        {transaccion.estado === 'pendiente' && (
                          <>
                            <button className="text-green-600 hover:text-green-900 mx-1">
                              Aprobar
                            </button>
                            <button className="text-red-600 hover:text-red-900 mx-1">
                              Rechazar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron transacciones con los filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
              <div className="flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Página <span className="font-medium">{paginaActual}</span> de{' '}
                      <span className="font-medium">{totalPaginas}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                        disabled={paginaActual === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          paginaActual === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Anterior
                      </button>
                      {[...Array(totalPaginas)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPaginaActual(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            paginaActual === i + 1 ? 'bg-cyan-50 text-cyan-600 border-cyan-500' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          paginaActual === totalPaginas ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Administración de Créditos</h2>
          <p className="text-gray-600">Gestiona las transacciones y planes de crédito del sistema</p>
        </div>
        
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSeccionActiva('transacciones')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  seccionActiva === 'transacciones'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transacciones
              </button>
              <button
                onClick={() => setSeccionActiva('planes')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  seccionActiva === 'planes'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Planes de Crédito
              </button>
            </nav>
          </div>
        </div>
        
        {seccionActiva === 'transacciones' && <TransaccionesAdmin />}
      </div>
    </div>
  );
};

export default AdminCreditosPage;
