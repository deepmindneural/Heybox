import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

interface Restaurant {
  _id: string;
  nombre: string;
  direccion: string;
  imagen: string;
  calificacion: number;
  tiempoEntrega: number;
  costoEnvio: number;
  categorias?: string[];
  destacado?: boolean;
}

interface Category {
  _id: string;
  nombre: string;
}

interface RestaurantsListProps {
  restaurants: Restaurant[];
  categories?: Category[];
  loading?: boolean;
  onSearch?: (query: string) => void;
  onFilterByCategory?: (categoryId: string) => void;
  onSort?: (sortBy: string) => void;
}

const RestaurantsList: React.FC<RestaurantsListProps> = ({
  restaurants,
  categories = [],
  loading = false,
  onSearch,
  onFilterByCategory,
  onSort
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (onFilterByCategory) {
      onFilterByCategory(categoryId);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    if (onSort) {
      onSort(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar restaurantes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600"
          >
            <FaFilter className="mr-1" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>

          <div className="flex items-center">
            <FaSortAmountDown className="mr-2 text-gray-500" />
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">Por calificación</option>
              <option value="deliveryTime">Por tiempo de entrega</option>
              <option value="deliveryCost">Por costo de envío</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleCategoryChange('')}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  {category.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listado de restaurantes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="h-24 w-24 mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron restaurantes</h3>
          <p className="text-gray-500 mb-4">
            No hay restaurantes que coincidan con tu búsqueda. Intenta con otros criterios o categorías.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              if (onSearch) onSearch('');
              if (onFilterByCategory) onFilterByCategory('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
