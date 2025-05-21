import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUtensils, FaMotorcycle, FaStar, FaMapMarkerAlt, FaWallet } from 'react-icons/fa';
import { fetchRestaurants, fetchCategories, fetchPromos } from '../../services/api';
import PromoCarousel from '../../components/common/PromoCarousel';
import { useAuth } from '../../context/AuthContext';
import { useCreditos } from '../../context/CreditosContext';

// Tipos de datos
interface Restaurant {
  _id: string;
  nombre: string;
  direccion: string;
  imagen: string;
  calificacion: number;
  tiempoEntrega: number;
  costoEnvio: number;
  categorias: string[];
  precioPromedio: number;
  etiquetas?: string[];
}

interface Category {
  _id: string;
  nombre: string;
  imagen?: string;
  icono?: string;
}

interface Promo {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  tipoPromo: 'descuento' | 'oferta' | 'envio_gratis' | 'creditos';
  valorDescuento?: number;
  codigoPromo?: string;
  restauranteId?: string;
  fechaInicio: string;
  fechaFin: string;
  enlace?: string;
}

const HomePage: React.FC = () => {
  const { isAuthenticated, usuario } = useAuth();
  const { creditosDisponibles, cargarCreditosUsuario } = useCreditos();
  
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar promociones
        const promosData = await fetchPromos();
        setPromos(promosData);
        
        // Cargar restaurantes destacados
        const restaurantsData = await fetchRestaurants({ destacado: true, limit: 4 });
        setFeaturedRestaurants(restaurantsData);
        
        // Cargar restaurantes nuevos
        const newRestaurantsData = await fetchRestaurants({ nuevos: true, limit: 4 });
        setNewRestaurants(newRestaurantsData);
        
        // Cargar categorías populares
        const categoriesData = await fetchCategories();
        setPopularCategories(categoriesData.slice(0, 8)); // Primeras 8 categorías
        
        // Cargar créditos del usuario si está autenticado
        if (isAuthenticated) {
          cargarCreditosUsuario();
        }
      } catch (error) {
        console.error('Error al cargar datos para la página de inicio:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, cargarCreditosUsuario]);
  
  // Calcular estrellas para calificación
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={`inline-block ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  // Formatear precio a pesos colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Sección Hero con buscador */}
      <div className="relative bg-gradient-to-r from-cyan-500 to-teal-400">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Tu plataforma gastronómica favorita
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Descubre los mejores restaurantes cerca de ti y recibe tu comida en minutos.
            </p>
            
            {/* Buscador principal */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="mt-1 relative rounded-full shadow-sm">
                <input
                  type="text"
                  className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-6 pr-16 py-4 sm:text-lg rounded-full border-gray-300"
                  placeholder="Buscar restaurantes o comida..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Link 
                    to="/restaurants"
                    className="h-12 w-12 bg-cyan-600 rounded-full flex items-center justify-center text-white hover:bg-cyan-700 transition-colors"
                  >
                    <FaArrowRight className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Botones de acción principales */}
            <div className="mt-10 flex justify-center space-x-6">
              <Link
                to="/restaurants"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
              >
                <FaUtensils className="mr-2" /> Ver restaurantes
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-cyan-600 bg-white hover:bg-cyan-50"
              >
                <FaMotorcycle className="mr-2" /> Mis pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de créditos (solo para usuarios autenticados) */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 py-8 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-cyan-100">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <FaWallet className="text-cyan-600 mr-2" /> 
                    Tus Créditos HEYBOX
                  </h2>
                  <p className="mt-1 text-gray-500">
                    Usa tus créditos para obtener descuentos en tus pedidos
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 text-center">
                  <div className="text-3xl font-bold text-cyan-600">
                    {formatPrice(creditosDisponibles || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Créditos disponibles</div>
                  
                  <div className="mt-2">
                    <Link 
                      to="/creditos/comprar"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                    >
                      Comprar más
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección de promociones */}
      {promos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Promociones Especiales</h2>
          <PromoCarousel promos={promos} />
        </div>
      )}
      
      {/* Sección de categorías */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Explora por categorías</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {popularCategories.map((category) => (
            <Link 
              key={category._id}
              to={`/restaurants?category=${category._id}`}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-3 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                {category.icono ? (
                  <span className="text-2xl">{category.icono}</span>
                ) : (
                  <FaUtensils className="text-xl" />
                )}
              </div>
              <div className="font-medium text-gray-900 group-hover:text-cyan-600 transition-colors">
                {category.nombre}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Sección de restaurantes destacados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Restaurantes destacados</h2>
          <Link to="/restaurants" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center">
            Ver todos <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Link 
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={restaurant.imagen} 
                  alt={restaurant.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=Restaurante';
                  }}
                />
                {restaurant.costoEnvio === 0 && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1">
                    ENVÍO GRATIS
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {restaurant.nombre}
                </h3>
                
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                  {restaurant.direccion}
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className="flex mr-2">
                    {renderStars(restaurant.calificacion)}
                  </div>
                  <span className="text-sm text-gray-700">
                    {restaurant.calificacion.toFixed(1)}
                  </span>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.tiempoEntrega} min
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {restaurant.precioPromedio ? `${formatPrice(restaurant.precioPromedio)} aprox.` : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Sección de nuevos restaurantes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Nuevos restaurantes</h2>
          <Link to="/restaurants?sort=newest" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center">
            Ver todos <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newRestaurants.map((restaurant) => (
            <Link 
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={restaurant.imagen} 
                  alt={restaurant.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=Restaurante';
                  }}
                />
                <div className="absolute top-0 left-0 bg-cyan-600 text-white text-xs font-bold px-2 py-1">
                  NUEVO
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {restaurant.nombre}
                </h3>
                
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-gray-400" />
                  {restaurant.direccion}
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className="flex mr-2">
                    {renderStars(restaurant.calificacion)}
                  </div>
                  <span className="text-sm text-gray-700">
                    {restaurant.calificacion.toFixed(1)}
                  </span>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.tiempoEntrega} min
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {restaurant.precioPromedio ? `${formatPrice(restaurant.precioPromedio)} aprox.` : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Sección de ventajas */}
      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegir HEYBOX?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Disfruta de la mejor experiencia gastronómica con las ventajas que te ofrecemos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                <FaMotorcycle className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega rápida</h3>
              <p className="text-gray-600">
                Recibe tus pedidos en menos de 30 minutos y sigue el progreso en tiempo real
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                <FaWallet className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sistema de créditos</h3>
              <p className="text-gray-600">
                Acumula créditos con cada pedido y aprovecha descuentos exclusivos
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                <FaUtensils className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Variedad de opciones</h3>
              <p className="text-gray-600">
                Elige entre cientos de restaurantes y miles de platos para todos los gustos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
