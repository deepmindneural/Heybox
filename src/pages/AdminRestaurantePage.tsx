import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiShoppingBag, FiCalendar, FiSettings, FiLogOut, 
         FiPieChart, FiUsers, FiAlertCircle, FiCheck, FiClock, FiPackage } from 'react-icons/fi';

const AdminRestaurantePage: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState<string>('pedidos');
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);
  
  // Verificar si el usuario es administrador de restaurante
  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    } else if (usuario.rol !== 'restaurante') {
      navigate('/');
    }
  }, [usuario, navigate]);
  
  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };
  
  // Opciones del menú lateral
  const opcionesMenu = [
    { id: 'pedidos', nombre: 'Pedidos Activos', icono: <FiShoppingBag /> },
    { id: 'historial', nombre: 'Historial', icono: <FiCalendar /> },
    { id: 'menu', nombre: 'Menú', icono: <FiMenu /> },
    { id: 'estadisticas', nombre: 'Estadísticas', icono: <FiPieChart /> },
    { id: 'clientes', nombre: 'Clientes', icono: <FiUsers /> },
    { id: 'configuracion', nombre: 'Configuración', icono: <FiSettings /> },
  ];
  
  // Alternar menú móvil
  const toggleMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menú lateral (escritorio) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-cyan-600 to-teal-500 text-white">
          <div className="flex items-center justify-center h-16 px-4 border-b border-cyan-700">
            <h2 className="text-xl font-bold">HEYBOX Admin</h2>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4">
              {opcionesMenu.map(opcion => (
                <button
                  key={opcion.id}
                  onClick={() => setSeccionActiva(opcion.id)}
                  className={`flex items-center px-4 py-3 mt-2 text-sm transition-colors rounded-lg 
                    ${seccionActiva === opcion.id 
                      ? 'bg-white text-cyan-600' 
                      : 'text-white hover:bg-cyan-700'}`}
                >
                  <span className="mr-3">{opcion.icono}</span>
                  {opcion.nombre}
                </button>
              ))}
              
              <button
                onClick={cerrarSesion}
                className="flex items-center px-4 py-3 mt-8 text-sm text-white hover:bg-cyan-700 transition-colors rounded-lg"
              >
                <FiLogOut className="mr-3" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barra superior */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 md:py-4 md:px-6">
          {/* Botón de menú (móvil) */}
          <button onClick={toggleMenuMovil} className="md:hidden text-gray-500 focus:outline-none">
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-xl">
              {opcionesMenu.find(o => o.id === seccionActiva)?.nombre || 'Dashboard'}
            </h1>
          </div>
          
          {/* Perfil del usuario */}
          <div className="flex items-center">
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                  {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium">{usuario?.nombre || 'Usuario'}</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Menú móvil */}
        {menuMovilAbierto && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black opacity-25" onClick={toggleMenuMovil}></div>
            
            <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-gradient-to-b from-cyan-600 to-teal-500 text-white">
              <div className="flex items-center justify-between h-16 px-4 border-b border-cyan-700">
                <h2 className="text-xl font-bold">HEYBOX Admin</h2>
                <button onClick={toggleMenuMovil} className="text-white">
                  <FiAlertCircle className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex-1 px-2 py-4 overflow-y-auto">
                {opcionesMenu.map(opcion => (
                  <button
                    key={opcion.id}
                    onClick={() => {
                      setSeccionActiva(opcion.id);
                      setMenuMovilAbierto(false);
                    }}
                    className={`flex items-center px-4 py-3 mt-2 text-sm transition-colors rounded-lg 
                      ${seccionActiva === opcion.id 
                        ? 'bg-white text-cyan-600' 
                        : 'text-white hover:bg-cyan-700'}`}
                  >
                    <span className="mr-3">{opcion.icono}</span>
                    {opcion.nombre}
                  </button>
                ))}
                
                <button
                  onClick={cerrarSesion}
                  className="flex items-center px-4 py-3 mt-8 text-sm text-white hover:bg-cyan-700 transition-colors rounded-lg"
                >
                  <FiLogOut className="mr-3" />
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {seccionActiva === 'pedidos' && <SeccionPedidosActivos />}
          {seccionActiva === 'historial' && <SeccionHistorial />}
          {seccionActiva === 'menu' && <SeccionMenu />}
          {seccionActiva === 'estadisticas' && <SeccionEstadisticas />}
          {seccionActiva === 'clientes' && <SeccionClientes />}
          {seccionActiva === 'configuracion' && <SeccionConfiguracion />}
        </main>
      </div>
    </div>
  );
};

// Componente para mostrar los pedidos activos
const SeccionPedidosActivos: React.FC = () => {
  // Datos de ejemplo de pedidos activos
  const pedidosActivos = [
    {
      id: 'HB123-456789',
      cliente: 'Carlos Rodríguez',
      estado: 'pendiente',
      hora: '11:30 AM',
      items: [
        { nombre: 'Hamburguesa Clásica', cantidad: 2 },
        { nombre: 'Papas Fritas Grandes', cantidad: 1 },
        { nombre: 'Refresco Cola', cantidad: 2 }
      ],
      total: 32000,
      metodoPago: 'tarjeta'
    },
    {
      id: 'HB456-789012',
      cliente: 'María López',
      estado: 'preparando',
      hora: '11:45 AM',
      items: [
        { nombre: 'Ensalada César', cantidad: 1 },
        { nombre: 'Agua Mineral', cantidad: 1 }
      ],
      total: 18500,
      metodoPago: 'efectivo'
    },
    {
      id: 'HB789-012345',
      cliente: 'Juan Pérez',
      estado: 'listo',
      hora: '12:15 PM',
      items: [
        { nombre: 'Pizza Familiar', cantidad: 1 },
        { nombre: 'Alitas BBQ', cantidad: 1 },
        { nombre: 'Refresco Lima-Limón', cantidad: 3 }
      ],
      total: 45000,
      metodoPago: 'tarjeta'
    }
  ];
  
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };
  
  const getColorEstado = (estado: string): string => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'preparando': return 'bg-blue-100 text-blue-800';
      case 'listo': return 'bg-green-100 text-green-800';
      case 'entregado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <FiAlertCircle className="mr-1" />;
      case 'preparando': return <FiClock className="mr-1" />;
      case 'listo': return <FiCheck className="mr-1" />;
      case 'entregado': return <FiPackage className="mr-1" />;
      case 'cancelado': return <FiAlertCircle className="mr-1" />;
      default: return <FiAlertCircle className="mr-1" />;
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Pedidos Activos</h2>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50">
            <option>Todos los estados</option>
            <option>Pendientes</option>
            <option>En preparación</option>
            <option>Listos para entrega</option>
          </select>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors">
            Actualizar
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidosActivos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pedido.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pedido.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorEstado(pedido.estado)}`}>
                      {getIconoEstado(pedido.estado)}
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pedido.hora}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatearPrecio(pedido.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-cyan-600 hover:text-cyan-900">Ver detalles</button>
                      <button className="text-green-600 hover:text-green-900">Actualizar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Componentes para las otras secciones (implementaciones mínimas por ahora)
const SeccionHistorial: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Historial de Pedidos</h2>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">Aquí podrás ver el historial completo de pedidos procesados.</p>
    </div>
  </div>
);

const SeccionMenu: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Gestión de Menú</h2>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">Aquí podrás gestionar los productos de tu menú.</p>
    </div>
  </div>
);

const SeccionEstadisticas: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Estadísticas</h2>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">Aquí podrás ver estadísticas de ventas y productos populares.</p>
    </div>
  </div>
);

const SeccionClientes: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Clientes</h2>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">Aquí podrás ver información sobre tus clientes habituales.</p>
    </div>
  </div>
);

const SeccionConfiguracion: React.FC = () => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Configuración</h2>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600">Aquí podrás configurar los detalles de tu restaurante.</p>
    </div>
  </div>
);

export default AdminRestaurantePage;
