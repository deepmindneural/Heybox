import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

interface Restaurante {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  direccion: {
    calle: string;
    ciudad: string;
  };
  calificacion: number;
  logo: string;
}

interface Categoria {
  nombre: string;
  count: number;
}

const RestaurantsPage: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [filteredRestaurantes, setFilteredRestaurantes] = useState<Restaurante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Cargar restaurantes
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/restaurantes`);
        const data = response.data.restaurantes || [];
        setRestaurantes(data);
        setFilteredRestaurantes(data);
        
        // Extraer categorías y contar restaurantes por categoría
        const categoriasObj: { [key: string]: number } = {};
        data.forEach((restaurante: Restaurante) => {
          categoriasObj[restaurante.categoria] = (categoriasObj[restaurante.categoria] || 0) + 1;
        });
        
        const categoriasArray = Object.entries(categoriasObj).map(([nombre, count]) => ({
          nombre,
          count
        }));
        
        setCategorias(categoriasArray);
      } catch (error) {
        console.error('Error al cargar restaurantes:', error);
        
        // Datos de ejemplo para desarrollo
        const mockData = [
          {
            _id: '1',
            nombre: 'El Rincón del Sabor',
            descripcion: 'Los mejores platos de la gastronomía colombiana con un toque moderno.',
            categoria: 'Comida colombiana',
            direccion: {
              calle: 'Calle 123 #45-67',
              ciudad: 'Bogotá'
            },
            calificacion: 4.8,
            logo: 'https://via.placeholder.com/300x200?text=Restaurante'
          },
          {
            _id: '2',
            nombre: 'La Pizzería Italiana',
            descripcion: 'Auténtica pizza italiana horneada en horno de leña.',
            categoria: 'Italiana',
            direccion: {
              calle: 'Carrera 78 #23-45',
              ciudad: 'Bogotá'
            },
            calificacion: 4.5,
            logo: 'https://via.placeholder.com/300x200?text=Pizzeria'
          },
          {
            _id: '3',
            nombre: 'Sushi Express',
            descripcion: 'El mejor sushi de la ciudad con ingredientes frescos importados.',
            categoria: 'Japonesa',
            direccion: {
              calle: 'Av. 7 #90-21',
              ciudad: 'Bogotá'
            },
            calificacion: 4.7,
            logo: 'https://via.placeholder.com/300x200?text=Sushi'
          },
          {
            _id: '4',
            nombre: 'Burger Gourmet',
            descripcion: 'Hamburguesas gourmet con ingredientes orgánicos y pan artesanal.',
            categoria: 'Hamburguesas',
            direccion: {
              calle: 'Calle 53 #12-57',
              ciudad: 'Bogotá'
            },
            calificacion: 4.6,
            logo: 'https://via.placeholder.com/300x200?text=Burgers'
          },
          {
            _id: '5',
            nombre: 'Taquería Mexicana',
            descripcion: 'Auténtica comida mexicana con recetas tradicionales.',
            categoria: 'Mexicana',
            direccion: {
              calle: 'Carrera 15 #85-23',
              ciudad: 'Bogotá'
            },
            calificacion: 4.3,
            logo: 'https://via.placeholder.com/300x200?text=Tacos'
          },
          {
            _id: '6',
            nombre: 'Wok & Roll',
            descripcion: 'Comida asiática de fusión con ingredientes frescos.',
            categoria: 'Asiática',
            direccion: {
              calle: 'Calle 72 #10-34',
              ciudad: 'Bogotá'
            },
            calificacion: 4.4,
            logo: 'https://via.placeholder.com/300x200?text=AsianFood'
          },
          {
            _id: '7',
            nombre: 'Café del Parque',
            descripcion: 'Café artesanal, pastelería casera y desayunos.',
            categoria: 'Cafetería',
            direccion: {
              calle: 'Carrera 5 #15-88',
              ciudad: 'Bogotá'
            },
            calificacion: 4.2,
            logo: 'https://via.placeholder.com/300x200?text=Cafe'
          },
          {
            _id: '8',
            nombre: 'Parrilla Argentina',
            descripcion: 'Los mejores cortes de carne al estilo argentino.',
            categoria: 'Parrilla',
            direccion: {
              calle: 'Av. 19 #104-21',
              ciudad: 'Bogotá'
            },
            calificacion: 4.9,
            logo: 'https://via.placeholder.com/300x200?text=Parrilla'
          }
        ];
        
        setRestaurantes(mockData);
        setFilteredRestaurantes(mockData);
        
        // Extraer categorías y contar restaurantes por categoría
        const categoriasObj: { [key: string]: number } = {};
        mockData.forEach((restaurante: Restaurante) => {
          categoriasObj[restaurante.categoria] = (categoriasObj[restaurante.categoria] || 0) + 1;
        });
        
        const categoriasArray = Object.entries(categoriasObj).map(([nombre, count]) => ({
          nombre,
          count
        }));
        
        setCategorias(categoriasArray);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, [API_URL]);

  // Filtrar restaurantes por categoría y término de búsqueda
  useEffect(() => {
    let filtered = [...restaurantes];
    
    // Filtrar por categoría
    if (selectedCategoria) {
      filtered = filtered.filter(restaurante => restaurante.categoria === selectedCategoria);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        restaurante =>
          restaurante.nombre.toLowerCase().includes(term) ||
          restaurante.descripcion.toLowerCase().includes(term) ||
          restaurante.direccion.ciudad.toLowerCase().includes(term)
      );
    }
    
    setFilteredRestaurantes(filtered);
  }, [restaurantes, selectedCategoria, searchTerm]);

  // Ordenar restaurantes
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sorted = [...filteredRestaurantes];
    
    switch (value) {
      case 'rating-desc':
        sorted.sort((a, b) => b.calificacion - a.calificacion);
        break;
      case 'rating-asc':
        sorted.sort((a, b) => a.calificacion - b.calificacion);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        // Por defecto, ordenar por calificación descendente
        sorted.sort((a, b) => b.calificacion - a.calificacion);
    }
    
    setFilteredRestaurantes(sorted);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurantes</h1>
        
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="search" className="sr-only">Buscar restaurantes</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar por nombre, descripción o ciudad"
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:flex md:items-center">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  id="category"
                  className="input-field"
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.nombre} value={categoria.nombre}>
                      {categoria.nombre} ({categoria.count})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                <select
                  id="sort"
                  className="input-field"
                  defaultValue="rating-desc"
                  onChange={handleSortChange}
                >
                  <option value="rating-desc">Mejor calificados</option>
                  <option value="rating-asc">Peor calificados</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                  <option value="name-desc">Nombre (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Resumen de filtros */}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>
              Mostrando {filteredRestaurantes.length} de {restaurantes.length} restaurantes
              {selectedCategoria && ` en ${selectedCategoria}`}
              {searchTerm && ` que coinciden con "${searchTerm}"`}
            </span>
            {(selectedCategoria || searchTerm) && (
              <button
                type="button"
                className="ml-2 text-primary hover:text-primary-dark"
                onClick={() => {
                  setSelectedCategoria('');
                  setSearchTerm('');
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
        
        {/* Lista de restaurantes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
            <p className="mt-2 text-gray-600">Cargando restaurantes...</p>
          </div>
        ) : filteredRestaurantes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron restaurantes</h3>
            <p className="mt-1 text-gray-500">
              Intenta con otros filtros o términos de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurantes.map(restaurante => (
              <RestaurantCard
                key={restaurante._id}
                id={restaurante._id}
                nombre={restaurante.nombre}
                categoria={restaurante.categoria}
                descripcion={restaurante.descripcion}
                imagen={restaurante.logo}
                calificacion={restaurante.calificacion}
                direccion={restaurante.direccion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
