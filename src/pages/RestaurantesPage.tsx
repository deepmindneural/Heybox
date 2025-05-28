import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiFilter, FiSearch, FiX, FiStar, FiClock } from 'react-icons/fi';
import type { Restaurante } from '../types';

const CATEGORIAS = [
  'comida ru00e1pida', 'gourmet', 'vegetariano', 'vegano', 'cafeteru00eda', 'postres', 'otro'
];

const RestaurantesPage: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [filteredRestaurantes, setFilteredRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [maxDistancia, setMaxDistancia] = useState<number>(3000); // metros
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  
  // Ubicaciu00f3n
  const [ubicacionUsuario, setUbicacionUsuario] = useState<{lat: number, lng: number} | null>(null);
  
  // Cargar restaurantes
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Aquu00ed iru00eda la llamada a la API para obtener los restaurantes
        // Por ahora usamos datos de ejemplo
        const restaurantesEjemplo = [
          {
            _id: '1',
            nombre: 'El Buen Sabor',
            descripcion: 'Restaurante de comida casera con los mejores platos tradicionales.',
            direccion: {
              calle: 'Calle Principal 123',
              ciudad: 'Ciudad Ejemplo',
              codigoPostal: '12345',
              coordenadas: { lat: 4.6682, lng: -74.0521 }
            },
            telefono: '123-456-7890',
            horario: {
              lunes: { apertura: '08:00', cierre: '20:00' },
              martes: { apertura: '08:00', cierre: '20:00' },
              miercoles: { apertura: '08:00', cierre: '20:00' },
              jueves: { apertura: '08:00', cierre: '20:00' },
              viernes: { apertura: '08:00', cierre: '22:00' },
              sabado: { apertura: '09:00', cierre: '22:00' },
              domingo: { apertura: '09:00', cierre: '18:00' }
            },
            logo: 'https://via.placeholder.com/150',
            categoria: 'comida ru00e1pida',
            calificacion: 4.5,
            numeroCalificaciones: 120,
            activo: true,
            usuario: '123',
            anillosProximidad: [
              { distancia: 300, color: '#FF0000' },
              { distancia: 1000, color: '#FFA500' },
              { distancia: 3000, color: '#FFFF00' }
            ]
          },
          {
            _id: '2',
            nombre: 'Cafu00e9 del Parque',
            descripcion: 'El mejor cafu00e9 de especialidad y postres artesanales.',
            direccion: {
              calle: 'Avenida Parque 456',
              ciudad: 'Ciudad Ejemplo',
              codigoPostal: '12345',
              coordenadas: { lat: 4.6700, lng: -74.0530 }
            },
            telefono: '123-456-7891',
            horario: {
              lunes: { apertura: '07:00', cierre: '19:00' },
              martes: { apertura: '07:00', cierre: '19:00' },
              miercoles: { apertura: '07:00', cierre: '19:00' },
              jueves: { apertura: '07:00', cierre: '19:00' },
              viernes: { apertura: '07:00', cierre: '21:00' },
              sabado: { apertura: '08:00', cierre: '21:00' },
              domingo: { apertura: '08:00', cierre: '18:00' }
            },
            logo: 'https://via.placeholder.com/150',
            categoria: 'cafeteru00eda',
            calificacion: 4.8,
            numeroCalificaciones: 85,
            activo: true,
            usuario: '124',
            anillosProximidad: [
              { distancia: 300, color: '#FF0000' },
              { distancia: 1000, color: '#FFA500' },
              { distancia: 3000, color: '#FFFF00' }
            ]
          },
          {
            _id: '3',
            nombre: 'Veggie Fresh',
            descripcion: 'Comida vegetariana y vegana fresca y saludable.',
            direccion: {
              calle: 'Calle Saludable 789',
              ciudad: 'Ciudad Ejemplo',
              codigoPostal: '12345',
              coordenadas: { lat: 4.6720, lng: -74.0500 }
            },
            telefono: '123-456-7892',
            horario: {
              lunes: { apertura: '10:00', cierre: '20:00' },
              martes: { apertura: '10:00', cierre: '20:00' },
              miercoles: { apertura: '10:00', cierre: '20:00' },
              jueves: { apertura: '10:00', cierre: '20:00' },
              viernes: { apertura: '10:00', cierre: '21:00' },
              sabado: { apertura: '10:00', cierre: '21:00' },
              domingo: { apertura: '11:00', cierre: '19:00' }
            },
            logo: 'https://via.placeholder.com/150',
            categoria: 'vegetariano',
            calificacion: 4.6,
            numeroCalificaciones: 65,
            activo: true,
            usuario: '125',
            anillosProximidad: [
              { distancia: 300, color: '#FF0000' },
              { distancia: 1000, color: '#FFA500' },
              { distancia: 3000, color: '#FFFF00' }
            ]
          }
        ];
        
        setRestaurantes(restaurantesEjemplo as Restaurante[]);
        setFilteredRestaurantes(restaurantesEjemplo as Restaurante[]);
      } catch (err: any) {
        setError(err.message || 'Error al cargar restaurantes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantes();
  }, []);
  
  // Obtener ubicaciu00f3n del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionUsuario({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error obteniendo ubicaciu00f3n:', error);
          // Ubicaciu00f3n por defecto (Bogotu00e1)
          setUbicacionUsuario({ lat: 4.6097, lng: -74.0817 });
        }
      );
    } else {
      console.error('Geolocalizaciu00f3n no soportada en este navegador');
      // Ubicaciu00f3n por defecto (Bogotu00e1)
      setUbicacionUsuario({ lat: 4.6097, lng: -74.0817 });
    }
  }, []);
  
  // Aplicar filtros
  useEffect(() => {
    if (!restaurantes.length) return;
    
    let filtered = [...restaurantes];
    
    // Filtrar por bu00fasqueda
    if (busqueda) {
      const searchTerm = busqueda.toLowerCase();
      filtered = filtered.filter(rest => 
        rest.nombre.toLowerCase().includes(searchTerm) || 
        rest.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoru00eda
    if (categoriaSeleccionada) {
      filtered = filtered.filter(rest => rest.categoria === categoriaSeleccionada);
    }
    
    // Filtrar por distancia (si tenemos la ubicaciu00f3n del usuario)
    if (ubicacionUsuario) {
      filtered = filtered.filter(rest => {
        if (!rest.direccion.coordenadas) return true;
        
        const distancia = calcularDistancia(
          ubicacionUsuario.lat,
          ubicacionUsuario.lng,
          rest.direccion.coordenadas.lat,
          rest.direccion.coordenadas.lng
        );
        
        return distancia <= maxDistancia;
      });
      
      // Ordenar por distancia
      filtered.sort((a, b) => {
        if (!a.direccion.coordenadas || !b.direccion.coordenadas) return 0;
        
        const distanciaA = calcularDistancia(
          ubicacionUsuario.lat,
          ubicacionUsuario.lng,
          a.direccion.coordenadas.lat,
          a.direccion.coordenadas.lng
        );
        
        const distanciaB = calcularDistancia(
          ubicacionUsuario.lat,
          ubicacionUsuario.lng,
          b.direccion.coordenadas.lat,
          b.direccion.coordenadas.lng
        );
        
        return distanciaA - distanciaB;
      });
    }
    
    setFilteredRestaurantes(filtered);
  }, [restaurantes, busqueda, categoriaSeleccionada, maxDistancia, ubicacionUsuario]);
  
  // Calcular distancia entre dos puntos en metros (fu00f3rmula de Haversine)
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // en metros
  };
  
  // Formatear distancia
  const formatearDistancia = (distancia: number): string => {
    if (distancia < 1000) {
      return `${Math.round(distancia)} m`;
    } else {
      return `${(distancia / 1000).toFixed(1)} km`;
    }
  };
  
  // Verificar si el restaurante estu00e1 abierto
  const estaAbierto = (restaurante: Restaurante): boolean => {
    const ahora = new Date();
    const dia = ahora.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
    const hora = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    let diaHorario: keyof typeof restaurante.horario;
    
    switch (dia) {
      case 'lunes': diaHorario = 'lunes'; break;
      case 'martes': diaHorario = 'martes'; break;
      case 'miércoles': diaHorario = 'miercoles'; break;
      case 'jueves': diaHorario = 'jueves'; break;
      case 'viernes': diaHorario = 'viernes'; break;
      case 'sábado': diaHorario = 'sabado'; break;
      case 'domingo': diaHorario = 'domingo'; break;
      default: return false;
    }
    
    const horarioHoy = restaurante.horario[diaHorario];
    
    return hora >= horarioHoy.apertura && hora <= horarioHoy.cierre;
  };
  
  // Determinar color del anillo basado en la distancia
  const obtenerColorAnillo = (restaurante: Restaurante, distancia: number): string => {
    if (!restaurante.anillosProximidad || !restaurante.anillosProximidad.length) {
      return '#CCCCCC'; // Color por defecto
    }
    
    for (const anillo of restaurante.anillosProximidad) {
      if (distancia <= anillo.distancia) {
        return anillo.color;
      }
    }
    
    return '#CCCCCC'; // Color por defecto si está fuera de todos los anillos
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabecera y bu00fasqueda */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Restaurantes Cercanos</h1>
            <p className="text-gray-600 mt-1">
              {filteredRestaurantes.length} restaurantes encontrados
            </p>
          </div>
          
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar restaurantes..."
                className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
              className="flex items-center text-gray-700 hover:text-cyan-600 transition-colors"
            >
              <FiFilter className="mr-2" />
              <span className="font-medium">Filtros</span>
            </button>
            
            {(categoriaSeleccionada || maxDistancia !== 3000) && (
              <button 
                onClick={() => {
                  setCategoriaSeleccionada('');
                  setMaxDistancia(3000);
                }}
                className="text-sm text-cyan-600 hover:text-cyan-800"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          {filtrosAbiertos && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtro por categoru00eda */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categoru00eda</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIAS.map(categoria => (
                    <button
                      key={categoria}
                      onClick={() => setCategoriaSeleccionada(cat => cat === categoria ? '' : categoria)}
                      className={`px-3 py-1 rounded-full text-sm ${categoriaSeleccionada === categoria 
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtro por distancia */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Distancia mu00e1xima: {formatearDistancia(maxDistancia)}
                </h3>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="500"
                  value={maxDistancia}
                  onChange={(e) => setMaxDistancia(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>500m</span>
                  <span>5km</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Lista de restaurantes */}
        {filteredRestaurantes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <img 
              src="https://img.icons8.com/color/96/000000/sad.png" 
              alt="No hay resultados" 
              className="mx-auto mb-4 w-16 h-16 opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron restaurantes</h3>
            <p className="text-gray-500">
              Intenta cambiar tus filtros o buscar con otros tu00e9rminos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurantes.map(restaurante => {
              // Calcular distancia si tenemos la ubicaciu00f3n del usuario
              let distancia = 0;
              let colorAnillo = '#CCCCCC';
              
              if (ubicacionUsuario && restaurante.direccion.coordenadas) {
                distancia = calcularDistancia(
                  ubicacionUsuario.lat,
                  ubicacionUsuario.lng,
                  restaurante.direccion.coordenadas.lat,
                  restaurante.direccion.coordenadas.lng
                );
                
                colorAnillo = obtenerColorAnillo(restaurante, distancia);
              }
              
              const abierto = estaAbierto(restaurante);
              
              return (
                <Link 
                  key={restaurante._id} 
                  to={`/restaurante/${restaurante._id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative">
                    <img 
                      src={restaurante.logo || 'https://via.placeholder.com/300x150?text=HEYBOX'} 
                      alt={restaurante.nombre}
                      className="w-full h-40 object-cover"
                    />
                    <div 
                      className="absolute top-0 left-0 w-full h-1" 
                      style={{ backgroundColor: colorAnillo }}
                    ></div>
                    
                    {/* Indicador de distancia */}
                    {ubicacionUsuario && restaurante.direccion.coordenadas && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <FiMapPin className="mr-1" size={12} />
                        {formatearDistancia(distancia)}
                      </div>
                    )}
                    
                    {/* Indicador de abierto/cerrado */}
                    <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs flex items-center ${abierto ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      <FiClock className="mr-1" size={12} />
                      {abierto ? 'Abierto' : 'Cerrado'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold text-gray-800 leading-tight">{restaurante.nombre}</h2>
                      {restaurante.calificacion && (
                        <div className="flex items-center text-yellow-500">
                          <FiStar className="mr-1" />
                          <span className="text-sm font-medium">{restaurante.calificacion.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{restaurante.categoria.charAt(0).toUpperCase() + restaurante.categoria.slice(1)}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{restaurante.descripcion}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantesPage;
