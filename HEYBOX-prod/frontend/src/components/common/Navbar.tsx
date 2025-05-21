import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars, FaTimes, FaSignOutAlt, FaMapMarkerAlt, FaCreditCard, FaHistory, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, usuario, logout } = useAuth();
  const { items: cartItems = [] } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Cerrar los menús al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [location.pathname]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };
  
  const categories = [
    { id: 'italiana', name: 'Italiana', icon: '🍝' },
    { id: 'japonesa', name: 'Japonesa', icon: '🍣' },
    { id: 'mexicana', name: 'Mexicana', icon: '🌮' },
    { id: 'china', name: 'China', icon: '🥡' },
    { id: 'americana', name: 'Americana', icon: '🍔' },
    { id: 'peruana', name: 'Peruana', icon: '🐟' },
    { id: 'vegetariana', name: 'Vegetariana', icon: '🥗' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
    { id: 'cafeteria', name: 'Cafetería', icon: '☕' },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-gradient-to-r from-cyan-500 to-teal-400 py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="HEYBOX Logo" 
              className="h-10 w-auto mr-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/40x40?text=HB';
              }} 
            />
            <span className={`font-bold text-xl ${isScrolled ? 'text-cyan-600' : 'text-white'}`}>
              HEYBOX
            </span>
          </Link>
          
          {/* Búsqueda - Versión Desktop */}
          <div className="hidden md:flex mx-4 flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Buscar restaurantes, comidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-600"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* Navegación - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center ${isScrolled ? 'text-gray-800 hover:text-cyan-600' : 'text-white hover:text-cyan-100'}`}
              >
                <span>Categorías</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full -left-4 mt-1 w-64 bg-white rounded-md shadow-lg z-20 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map(category => (
                      <Link 
                        key={category.id}
                        to={`/restaurants?category=${category.id}`}
                        className="flex items-center p-2 hover:bg-gray-100 rounded transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <span className="text-xl mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to="/restaurants" 
              className={`${isScrolled ? 'text-gray-800 hover:text-cyan-600' : 'text-white hover:text-cyan-100'}`}
            >
              Restaurantes
            </Link>
            
            <Link 
              to="/orders" 
              className={`${isScrolled ? 'text-gray-800 hover:text-cyan-600' : 'text-white hover:text-cyan-100'}`}
            >
              Mis Pedidos
            </Link>
            
            <Link 
              to="/cart" 
              className={`${isScrolled ? 'text-gray-800 hover:text-cyan-600' : 'text-white hover:text-cyan-100'} relative`}
            >
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {/* Perfil de usuario */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {usuario?.imagen ? (
                      <img src={usuario.imagen} alt={usuario.nombre || 'Usuario'} className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-sm" />
                    )}
                  </div>
                </button>
                
                {/* Dropdown del usuario */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800">
                        {usuario?.nombre || 'Usuario'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {usuario?.email}
                      </p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="mr-2 text-gray-500" />
                      Mi Perfil
                    </Link>
                    
                    <Link 
                      to="/creditos" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCreditCard className="mr-2 text-gray-500" />
                      Mis Créditos
                    </Link>
                    
                    <Link 
                      to="/addresses" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      Mis Direcciones
                    </Link>
                    
                    <Link 
                      to="/favorites" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaHeart className="mr-2 text-gray-500" />
                      Favoritos
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2 text-gray-500" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/auth/login"
                  className={`${isScrolled ? 'text-gray-800 hover:text-cyan-600 border-gray-300' : 'text-white hover:text-white border-white border-opacity-30'} border rounded-md px-3 py-1`}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/auth/register"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md px-3 py-1"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
          
          {/* Menú móvil - Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              to="/cart" 
              className={`${isScrolled ? 'text-gray-800' : 'text-white'} relative`}
            >
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil - Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30">
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar restaurantes, comidas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          <nav className="flex flex-col">
            <Link 
              to="/restaurants" 
              className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
            >
              Restaurantes
            </Link>
            
            <button 
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 w-full text-left"
            >
              <span>Categorías</span>
              <svg className={`w-4 h-4 transform ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isCategoriesOpen && (
              <div className="bg-gray-50 px-4 py-2">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <Link 
                      key={category.id}
                      to={`/restaurants?category=${category.id}`}
                      className="flex items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <span className="text-xl mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <Link 
              to="/orders" 
              className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
            >
              Mis Pedidos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/creditos" 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  Mis Créditos
                </Link>
                
                <Link 
                  to="/profile" 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  Mi Perfil
                </Link>
                
                <Link 
                  to="/addresses" 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  Mis Direcciones
                </Link>
                
                <Link 
                  to="/favorites" 
                  className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  Favoritos
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="px-4 py-3 text-left w-full text-red-600 hover:bg-gray-50 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col p-4 space-y-3">
                <Link 
                  to="/auth/login" 
                  className="w-full py-2 text-center border border-cyan-500 text-cyan-600 rounded-md hover:bg-cyan-50"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/auth/register" 
                  className="w-full py-2 text-center bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
