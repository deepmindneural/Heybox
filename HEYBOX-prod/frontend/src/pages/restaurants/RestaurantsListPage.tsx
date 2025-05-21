import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRestaurants, fetchCategories } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Restaurant {
  _id: string;
  nombre: string;
  direccion: string;
  imagen: string;
  calificacion: number;
  tiempoEntrega: number;
  costoEnvio: number;
  categorias: string[];
}

interface Category {
  _id: string;
  nombre: string;
}

const RestaurantsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categoria') || '');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('ordenar') || 'calificacion');
  
  // Cargar restaurantes y categorías
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Cargar categorías
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Cargar restaurantes con filtros aplicados
        const params: Record<string, string> = {};
        if (selectedCategory) params.categoria = selectedCategory;
        if (searchTerm) params.q = searchTerm;
        if (sortBy) params.ordenar = sortBy;
        
        const restaurantsData = await fetchRestaurants(params);
        setRestaurants(restaurantsData);
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los restaurantes');
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedCategory, searchTerm, sortBy]);
  
  // Actualizar URL con los filtros
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.categoria = selectedCategory;
    if (searchTerm) params.q = searchTerm;
    if (sortBy) params.ordenar = sortBy;
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, sortBy, setSearchParams]);
  
  // Aplicar filtro de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };
  
  // Búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda ya se aplica en el useEffect por el cambio de searchTerm
  };
  
  // Ordenamiento
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Restaurantes</h1>
          <p className="text-gray-600">
            Descubre los mejores restaurantes cerca de ti
          </p>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="calificacion">Ordenar por: Calificación</option>
                <option value="tiempoEntrega">Ordenar por: Tiempo de entrega</option>
                <option value="costoEnvio">Ordenar por: Costo de envío</option>
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
        
        {/* Categorías */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex space-x-2 pb-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              Todos
            </button>
            
            {categories.map(category => (
              <button
                key={category._id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.nombre}
              </button>
            ))}
          </div>
        </div>
        
        {/* Lista de restaurantes */}
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar restaurantes
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron restaurantes</h3>
            <p className="text-gray-600 mb-4">
              No hay restaurantes que coincidan con los filtros aplicados. Intenta con otros criterios de búsqueda.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
                setSortBy('calificacion');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <div 
                key={restaurant._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              >
                <div className="h-48 relative">
                  <img 
                    src={restaurant.imagen} 
                    alt={restaurant.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Imagen+no+disponible';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-medium text-white">{restaurant.nombre}</h3>
                    <div className="mt-1 flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-white">{restaurant.calificacion.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-2">{restaurant.direccion}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{restaurant.tiempoEntrega} min</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>
                        {restaurant.costoEnvio === 0
                          ? 'Envío gratis'
                          : `$${restaurant.costoEnvio.toFixed(2)}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {restaurant.categorias.slice(0, 3).map((catId, index) => {
                      const category = categories.find(c => c._id === catId);
                      return category ? (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-700"
                        >
                          {category.nombre}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded">
                    Ver restaurante
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsListPage;
