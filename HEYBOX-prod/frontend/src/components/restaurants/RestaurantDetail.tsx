import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { fetchRestaurantDetails } from '../../services/api';

interface MenuItem {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categorias: string[];
  disponible: boolean;
  destacado: boolean;
}

interface Category {
  id: string;
  nombre: string;
}

interface RestaurantDetailProps {
  onAddToCart?: (item: MenuItem) => void;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems, getRestaurantFromCart } = useCart();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [itemsInCart, setItemsInCart] = useState<{[key: string]: number}>({});
  const [restaurantInCart, setRestaurantInCart] = useState<any>(null);
  const [showCartWarning, setShowCartWarning] = useState<boolean>(false);
  
  // Función para cargar los detalles del restaurante
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchRestaurantDetails(id);
        setRestaurant(data);
        
        // Extraer categorías únicas del menú
        if (data.menu && data.menu.length > 0) {
          const uniqueCategories = Array.from(
            new Set(
              data.menu.flatMap((item: MenuItem) => item.categorias)
            )
          ).map(cat => ({
            id: cat,
            nombre: cat
          }));
          
          setCategories(uniqueCategories);
          setActiveCategory(uniqueCategories[0]?.id || null);
        }
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los detalles del restaurante');
        console.error('Error al cargar detalles del restaurante:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadRestaurantData();
  }, [id]);
  
  // Revisar si hay items de este restaurante en el carrito
  useEffect(() => {
    const currentItemsInCart: {[key: string]: number} = {};
    
    cartItems.forEach(item => {
      if (item.restauranteId === id) {
        currentItemsInCart[item.productoId] = (currentItemsInCart[item.productoId] || 0) + item.cantidad;
      }
    });
    
    setItemsInCart(currentItemsInCart);
    
    // Verificar si hay un restaurante diferente en el carrito
    const restaurantInCart = getRestaurantFromCart();
    if (restaurantInCart && restaurantInCart._id !== id) {
      setRestaurantInCart(restaurantInCart);
    } else {
      setRestaurantInCart(null);
    }
  }, [cartItems, id, getRestaurantFromCart]);
  
  // Filtrar menú por categoría activa y término de búsqueda
  const filteredMenu = restaurant?.menu?.filter((item: MenuItem) => {
    const matchesCategory = !activeCategory || item.categorias.includes(activeCategory);
    const matchesSearch = !searchTerm || 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && item.disponible;
  }) || [];
  
  // Función para agregar un producto al carrito
  const handleAddToCart = (item: MenuItem) => {
    if (restaurantInCart && restaurantInCart._id !== id) {
      setShowCartWarning(true);
      return;
    }
    
    // Usar la función proporcionada por props si existe
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      // Usar el contexto del carrito
      addToCart({
        productoId: item._id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: 1,
        restauranteId: id || '',
        restauranteNombre: restaurant?.nombre || ''
      });
    }
  };
  
  // Función para limpiar el carrito actual
  const handleClearCart = () => {
    // Esta función debería definirse en el contexto del carrito
    // Aquí solo cerramos el modal de advertencia
    setShowCartWarning(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar el restaurante</h3>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Volver a restaurantes
        </button>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Restaurante no encontrado</h3>
        <p className="text-gray-600">No se pudo encontrar información para este restaurante.</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Volver a restaurantes
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Banner del restaurante */}
      <div className="relative h-64 w-full">
        <img 
          src={restaurant.imagenPortada || '/images/default-restaurant-banner.jpg'} 
          alt={restaurant.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold">{restaurant.nombre}</h2>
            <p className="mt-2 text-sm md:text-base opacity-90">{restaurant.descripcion}</p>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center bg-yellow-400 bg-opacity-90 text-gray-900 text-sm px-2 py-1 rounded">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="font-medium">{restaurant.calificacion || 4.5}</span>
              </div>
              
              <div className="ml-4 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  {restaurant.tiempoEntrega ? `${restaurant.tiempoEntrega} min` : '30-45 min'}
                </span>
              </div>
              
              <div className="ml-4 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{restaurant.direccion || 'Dirección no disponible'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de navegación de categorías */}
      <div className="px-4 py-3 border-b overflow-auto sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Nuestro Menú</h3>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en el menú"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1 px-3 border border-gray-300 rounded-full text-sm w-44 md:w-56 pl-8"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
              activeCategory === null 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.nombre}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menú */}
      <div className="p-4">
        {filteredMenu.length === 0 ? (
          <div className="text-center py-10">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14.5h.01M12 21a9 9 0 110-18 9 9 0 010 18z"></path>
            </svg>
            <h4 className="mt-2 text-lg font-medium text-gray-600">No se encontraron productos</h4>
            <p className="text-gray-500">
              {searchTerm ? 'Intenta con otra búsqueda' : 'No hay productos disponibles en esta categoría'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenu.map((item: MenuItem) => (
              <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="relative h-40 bg-gray-200">
                  {item.imagen ? (
                    <img 
                      src={item.imagen} 
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {item.destacado && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Destacado
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.descripcion}</p>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.precio.toLocaleString('es-CO')}
                    </span>
                    
                    <div className="flex items-center">
                      {itemsInCart[item._id] ? (
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-2">
                            {itemsInCart[item._id]} en carrito
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Información adicional */}
      <div className="border-t mt-6">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Información del restaurante</h3>
          
          <div className="space-y-4">
            <div className="flex">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Dirección</h4>
                <p className="text-gray-600 mt-1">{restaurant.direccion || 'No disponible'}</p>
              </div>
            </div>
            
            <div className="flex">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Horario</h4>
                <p className="text-gray-600 mt-1">
                  {restaurant.horario ? (
                    <span>{restaurant.horario}</span>
                  ) : (
                    <span>Lunes a Domingo: 10:00 AM - 10:00 PM</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Contacto</h4>
                <p className="text-gray-600 mt-1">
                  {restaurant.telefono ? (
                    <span>{restaurant.telefono}</span>
                  ) : (
                    <span>Teléfono no disponible</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de advertencia de carrito */}
      {showCartWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">¿Cambiar de restaurante?</h3>
            <p className="text-gray-600">
              Ya tienes productos de <strong>{restaurantInCart?.nombre}</strong> en tu carrito. 
              Si continúas, se eliminará tu carrito actual.
            </p>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowCartWarning(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Limpiar carrito y continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
