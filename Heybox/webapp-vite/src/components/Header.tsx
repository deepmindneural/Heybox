import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  
  // Determinar si un enlace está activo
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white text-gray-800 shadow-lg' : 'bg-gradient-to-r from-primary to-primary-dark text-white'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
              <span className="text-primary font-bold text-xl">HB</span>
            </div>
            <span className={`text-2xl font-extrabold ${isScrolled ? 'text-primary' : 'text-white'}`}>HEYBOX</span>
          </Link>
          
          {/* Menú de navegación Desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link 
                  to="/" 
                  className={`font-medium py-2 px-3 rounded-md transition-colors ${isActive('/') ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/restaurantes" 
                  className={`font-medium py-2 px-3 rounded-md transition-colors ${isActive('/restaurantes') ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                >
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link 
                  to="/promociones" 
                  className={`font-medium py-2 px-3 rounded-md transition-colors ${isActive('/promociones') ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                >
                  Promociones
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className={`font-medium py-2 px-3 rounded-md transition-colors ${isActive('/contacto') ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                >
                  Contacto
                </Link>
              </li>
              <li>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <span>Mi Cuenta</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20">
                      <div className="py-2">
                        <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                          Iniciar Sesión
                        </Link>
                        <Link to="/registro" className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                          Registrarse
                        </Link>
                        <hr className="my-1" />
                        <Link to="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                          Mi Perfil
                        </Link>
                        <Link to="/mis-pedidos" className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                          Mis Pedidos
                        </Link>
                        <Link to="/favoritos" className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition-colors">
                          Favoritos
                        </Link>
                        <hr className="my-1" />
                        <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-500 hover:text-white transition-colors">
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <Link 
                  to="/checkout" 
                  className="relative flex items-center justify-center p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Botón de menú móvil */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            aria-label="Menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/restaurantes" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link to="/promociones" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Promociones
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Contacto
                </Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <Link to="/login" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registro" className="block py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  Registrarse
                </Link>
              </li>
              <li className="border-t pt-2 mt-2">
                <Link to="/checkout" className="flex items-center justify-between py-2 px-4 text-gray-800 hover:bg-primary hover:text-white rounded-md transition-colors">
                  <span>Carrito de Compras</span>
                  <span className="bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
