import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars, FaTimes, FaMapMarkerAlt, FaMotorcycle, FaStore, FaHistory, FaSignOutAlt, FaUserCircle, FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Importando de forma condicional para manejar casos donde el logo no exista
let logo: any;
try {
  logo = require('../assets/logo.png');
} catch (e) {
  // Fallback a un string vacío si no encuentra el logo
  logo = '';
}

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, userRole, onLogout = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout: authLogout } = useAuth();

  // Para cerrar el menú cuando se cambia de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Usar la autenticación del contexto si no se proporciona explícitamente
  const isUserAuthenticated = isAuthenticated || (usuario !== null);
  const currentUserRole = userRole || (usuario?.rol);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Usar la función de logout proporcionada como prop o la del contexto
    if (onLogout) {
      onLogout();
    } else if (authLogout) {
      authLogout();
    }
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 relative">
        <div className="flex">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center bg-gradient-to-r from-cyan-500 to-teal-400 w-10 h-10 rounded-lg shadow-md">
              <span className="text-white font-bold text-lg">HB</span>
            </div>
            <span className="ml-2 font-bold text-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-transparent bg-clip-text">HEYBOX</span>
          </Link>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          {/* Navegación */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link to="/" className="text-primary-dark border-transparent hover:border-primary hover:text-primary border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Inicio
            </Link>
            <Link to="/restaurantes" className="text-gray-500 border-transparent hover:border-primary hover:text-primary border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Restaurantes
            </Link>
            {isUserAuthenticated && (
              <Link to="/pedidos" className="text-gray-500 border-transparent hover:border-primary hover:text-primary border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Mis Pedidos
              </Link>
            )}
            {isUserAuthenticated && currentUserRole === 'restaurante' && (
              <Link to="/admin/dashboard" className="text-gray-500 border-transparent hover:border-primary hover:text-primary border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:items-center">
          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/carrito" className="relative">
              <FaShoppingCart className="text-xl text-gray-600" />
              <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-cyan-600 focus:outline-none p-1"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
          {/* Búsqueda */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Buscar restaurantes o comidas..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
            />
            <div className="absolute left-3 top-2.5 text-gray-400 group-hover:text-cyan-500 transition-colors duration-300">
              <FaSearch />
            </div>
            {/* Sugerencias de búsqueda (aparecen al hacer clic) */}
            <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
              <div className="text-xs font-semibold text-gray-500 mb-1 px-2">Populares:</div>
              <div className="space-y-1">
                <Link to="/buscar/hamburguesas" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center">
                  <span className="mr-2">🍔</span> Hamburguesas
                </Link>
                <Link to="/buscar/pizza" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center">
                  <span className="mr-2">🍕</span> Pizza
                </Link>
                <Link to="/buscar/sushi" className="block px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center">
                  <span className="mr-2">🍣</span> Sushi
                </Link>
              </div>
            </div>
          </div>
          {/* Carrito */}
          <Link to="/carrito" className="text-gray-600 hover:text-cyan-600 relative p-2 group">
            <div className="relative">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110">3</span>
            </div>
            {/* Mini-carrito flotante */}
            <div className="hidden group-hover:block absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-700">Tu Carrito (3)</h3>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <img src="https://via.placeholder.com/50" alt="Producto" className="w-12 h-12 object-cover rounded" />
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium">Hamburguesa Clásica</p>
                    <p className="text-xs text-gray-500">Cantidad: 1</p>
                  </div>
                  <p className="text-sm font-semibold">$8.99</p>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <img src="https://via.placeholder.com/50" alt="Producto" className="w-12 h-12 object-cover rounded" />
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium">Papas Fritas</p>
                    <p className="text-xs text-gray-500">Cantidad: 1</p>
                  </div>
                  <p className="text-sm font-semibold">$3.50</p>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <img src="https://via.placeholder.com/50" alt="Producto" className="w-12 h-12 object-cover rounded" />
                  <div className="ml-2 flex-1">
                    <p className="text-sm font-medium">Refresco Cola</p>
                    <p className="text-xs text-gray-500">Cantidad: 1</p>
                  </div>
                  <p className="text-sm font-semibold">$1.99</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">$14.48</span>
                </div>
                <Link to="/carrito" className="block w-full py-2 text-center bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium">
                  Ver Carrito
                </Link>
              </div>
            </div>
          </Link>
          {/* Ubicación actual */}
          <button className="text-gray-600 hover:text-cyan-600 flex items-center gap-1 p-2">
            <FaMapMarkerAlt />
            <span className="text-sm font-medium">Bogotá</span>
          </button>
          {/* Perfil de Usuario */}
          <div className="relative group">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-cyan-600 p-2">
              <FaUserCircle className="text-xl" />
              <span className="text-sm font-medium">Mi Cuenta</span>
            </button>
            {/* Menú desplegable */}
            <div className="hidden group-hover:block absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">Juan Pérez</p>
                <p className="text-sm text-gray-500">juan@ejemplo.com</p>
              </div>
              <Link to="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <FaUser className="mr-2 text-gray-500" />
                Mi Perfil
              </Link>
              <Link to="/mis-pedidos" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <FaHistory className="mr-2 text-gray-500" />
                Mis Pedidos
              </Link>
              <Link to="/favoritos" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <FaHeart className="mr-2 text-gray-500" />
                Favoritos
              </Link>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                  <FaSignOutAlt className="mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="bg-primary-light text-primary-dark block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium">
              Inicio
            </Link>
            <Link to="/restaurantes" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              Restaurantes
            </Link>
            {isUserAuthenticated && (
              <Link to="/pedidos" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Mis Pedidos
              </Link>
            )}
            {isUserAuthenticated && currentUserRole === 'restaurante' && (
              <Link to="/admin/dashboard" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isUserAuthenticated ? (
              <div>
                <Link to="/perfil" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
