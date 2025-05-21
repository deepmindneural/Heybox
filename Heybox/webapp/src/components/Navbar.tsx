import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img className="h-8 w-auto" src={logo} alt="HEYBOX" />
              </Link>
            </div>
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
            {isUserAuthenticated ? (
              <div className="flex items-center">
                <Link to="/perfil" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Abrir menú</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
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
