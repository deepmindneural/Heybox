import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiClock, FiStar, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import type { Restaurante, Producto } from '../types';

const RestauranteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todos');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar datos del restaurante y sus productos
  useEffect(() => {
    const fetchRestauranteYProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Aquí iría la llamada a la API para obtener el restaurante por ID
        // Por ahora usamos datos de ejemplo
        const restauranteEjemplo = {
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
          categoria: 'comida rápida',
          calificacion: 4.5,
          numeroCalificaciones: 120,
          activo: true,
          usuario: '123',
          anillosProximidad: [
            { distancia: 300, color: '#FF0000' },
            { distancia: 1000, color: '#FFA500' },
            { distancia: 3000, color: '#FFFF00' }
          ]
        };
        
        // Productos de ejemplo
        const productosEjemplo = [
          {
            _id: '101',
            nombre: 'Hamburguesa Clásica',
            descripcion: 'Deliciosa hamburguesa con carne 100% de res, queso, lechuga, tomate y cebolla.',
            precio: 12000,
            imagen: 'https://via.placeholder.com/200',
            categoria: 'Hamburguesas',
            disponible: true,
            opciones: [
              {
                nombre: 'Tipo de queso',
                selecciones: [
                  { nombre: 'Cheddar', precio: 0 },
                  { nombre: 'Suizo', precio: 1000 },
                  { nombre: 'Azul', precio: 1500 }
                ]
              },
              {
                nombre: 'Extras',
                selecciones: [
                  { nombre: 'Bacon', precio: 2000 },
                  { nombre: 'Huevo frito', precio: 1500 },
                  { nombre: 'Guacamole', precio: 2000 }
                ]
              }
            ],
            restaurante: '1'
          },
          {
            _id: '102',
            nombre: 'Papas Fritas',
            descripcion: 'Crujientes papas fritas con sal marina.',
            precio: 5000,
            imagen: 'https://via.placeholder.com/200',
            categoria: 'Acompañamientos',
            disponible: true,
            opciones: [
              {
                nombre: 'Tamaño',
                selecciones: [
                  { nombre: 'Pequeño', precio: 0 },
                  { nombre: 'Mediano', precio: 2000 },
                  { nombre: 'Grande', precio: 3500 }
                ]
              },
              {
                nombre: 'Salsa',
                selecciones: [
                  { nombre: 'Ketchup', precio: 0 },
                  { nombre: 'Mayonesa', precio: 0 },
                  { nombre: 'BBQ', precio: 500 },
                  { nombre: 'Queso cheddar', precio: 1500 }
                ]
              }
            ],
            restaurante: '1'
          },
          {
            _id: '103',
            nombre: 'Ensalada César',
            descripcion: 'Fresca ensalada con lechuga romana, crutones, queso parmesano y pollo a la parrilla.',
            precio: 14000,
            imagen: 'https://via.placeholder.com/200',
            categoria: 'Ensaladas',
            disponible: true,
            opciones: [
              {
                nombre: 'Proteína',
                selecciones: [
                  { nombre: 'Sin proteína', precio: -3000 },
                  { nombre: 'Pollo', precio: 0 },
                  { nombre: 'Camarones', precio: 4000 }
                ]
              }
            ],
            restaurante: '1'
          },
          {
            _id: '104',
            nombre: 'Refresco',
            descripcion: 'Refrescante bebida con hielo.',
            precio: 3500,
            imagen: 'https://via.placeholder.com/200',
            categoria: 'Bebidas',
            disponible: true,
            opciones: [
              {
                nombre: 'Tipo',
                selecciones: [
                  { nombre: 'Cola', precio: 0 },
                  { nombre: 'Lima-Limón', precio: 0 },
                  { nombre: 'Naranja', precio: 0 },
                  { nombre: 'Agua mineral', precio: -500 }
                ]
              },
              {
                nombre: 'Tamaño',
                selecciones: [
                  { nombre: 'Pequeño', precio: 0 },
                  { nombre: 'Mediano', precio: 1000 },
                  { nombre: 'Grande', precio: 2000 }
                ]
              }
            ],
            restaurante: '1'
          }
        ];
        
        setRestaurante(restauranteEjemplo as Restaurante);
        setProductos(productosEjemplo as Producto[]);
        
        // Extraer categorías únicas
        const categoriasList = ['todos', ...new Set(productosEjemplo.map(p => p.categoria))];
        setCategorias(categoriasList);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el restaurante');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRestauranteYProductos();
    }
  }, [id]);
  
  // Verificar si el restaurante está abierto
  const estaAbierto = (): boolean => {
    if (!restaurante) return false;
    
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
  
  // Formatear precio
  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };
  
  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (error || !restaurante) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>Error: {error || 'No se encontró el restaurante'}</p>
          <Link 
            to="/restaurantes" 
            className="mt-2 inline-block px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            Volver a restaurantes
          </Link>
        </div>
      </div>
    );
  }
  
  const abierto = estaAbierto();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabecera del restaurante */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:mr-8 mb-6 md:mb-0">
              <div className="w-24 h-24 bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={restaurante.logo || 'https://via.placeholder.com/150'} 
                  alt={restaurante.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurante.nombre}</h1>
              <p className="mb-4">{restaurante.descripcion}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{restaurante.direccion.calle}, {restaurante.direccion.ciudad}</span>
                </div>
                
                <div className="flex items-center">
                  <FiPhone className="mr-1" />
                  <span>{restaurante.telefono}</span>
                </div>
                
                <div className="flex items-center">
                  <FiStar className="mr-1" />
                  <span>{restaurante.calificacion?.toFixed(1)} ({restaurante.numeroCalificaciones} reseñas)</span>
                </div>
                
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${abierto ? 'bg-green-500' : 'bg-red-500'}`}>
                  <FiClock className="mr-1" />
                  <span>{abierto ? 'Abierto' : 'Cerrado'}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0">
              <Link 
                to="/carrito" 
                className="flex items-center justify-center py-2 px-4 bg-white text-cyan-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
              >
                <FiShoppingCart className="mr-2" size={18} />
                Ver carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Horarios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiClock className="mr-2 text-cyan-500" /> Horarios
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(restaurante.horario).map(([dia, horario]) => (
              <div key={dia} className="text-sm">
                <p className="font-medium">{dia.charAt(0).toUpperCase() + dia.slice(1)}</p>
                <p className="text-gray-600">{horario.apertura} - {horario.cierre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Menú */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold mb-6">Menú</h2>
        
        {/* Filtro de categorías */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  categoriaSeleccionada === categoria 
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors shadow-sm`}
              >
                {categoria === 'todos' ? 'Todos' : categoria}
              </button>
            ))}
          </div>
        </div>
        
        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productosFiltrados.map(producto => (
            <div 
              key={producto._id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex h-full">
                <div className="w-1/3 h-full">
                  <img 
                    src={producto.imagen || 'https://via.placeholder.com/150'} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="w-2/3 p-4 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                    
                    {producto.opciones && producto.opciones.length > 0 && (
                      <div className="mt-1 mb-2">
                        <p className="text-xs text-cyan-600">Personalizable</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-900">{formatearPrecio(producto.precio)}</span>
                    
                    <button 
                      className="flex items-center justify-center p-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-white rounded-full hover:from-cyan-600 hover:to-teal-500 transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {productosFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No hay productos disponibles en esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestauranteDetallePage;
