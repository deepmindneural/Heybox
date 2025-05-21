import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ShoppingCart from '../components/ShoppingCart';
import { useCart } from '../context/CartContext';

interface Restaurante {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  direccion: {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  telefono: string;
  horario?: {
    [key: string]: { apertura: string; cierre: string };
  };
  calificacion: number;
  numeroCalificaciones: number;
  logo: string;
  imagenes?: string[];
}

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  disponible: boolean;
  tiempo_preparacion: number;
  opciones: Array<{
    nombre: string;
    precio_adicional: number;
  }>;
  destacado: boolean;
}

interface ProductosPorCategoria {
  [categoria: string]: Producto[];
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [productos, setProductos] = useState<ProductosPorCategoria>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { items, restaurante: cartRestaurante, addItem, removeItem, updateQuantity, clearCart } = useCart();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Obtener días de la semana en español
  const diasSemana = [
    'domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'
  ];

  // Día actual
  const diaActual = diasSemana[new Date().getDay()];

  // Verificar si el restaurante está abierto
  const estaAbierto = (): boolean => {
    if (!restaurante?.horario || !restaurante.horario[diaActual]) return false;

    const ahora = new Date();
    const hora = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');
    const { apertura, cierre } = restaurante.horario[diaActual];

    return hora >= apertura && hora <= cierre;
  };

  // Obtener datos del restaurante
  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/restaurantes/${id}`);
        setRestaurante(response.data.restaurante);
      } catch (error) {
        console.error('Error al cargar restaurante:', error);
        setError('No se pudo cargar la información del restaurante.');
        
        // Datos de ejemplo para desarrollo
        setRestaurante({
          _id: id || '1',
          nombre: 'El Rincón del Sabor',
          descripcion: 'Los mejores platos de la gastronomía colombiana con un toque moderno. Utilizamos ingredientes frescos y locales para crear sabores auténticos que te transportarán a través de las diversas regiones del país.',
          categoria: 'Comida colombiana',
          direccion: {
            calle: 'Calle 123 #45-67',
            ciudad: 'Bogotá',
            codigoPostal: '110111',
            coordenadas: {
              lat: 4.6097100,
              lng: -74.0817500
            }
          },
          telefono: '+57 301 123 4567',
          horario: {
            lunes: { apertura: '11:00', cierre: '22:00' },
            martes: { apertura: '11:00', cierre: '22:00' },
            miercoles: { apertura: '11:00', cierre: '22:00' },
            jueves: { apertura: '11:00', cierre: '23:00' },
            viernes: { apertura: '11:00', cierre: '23:00' },
            sabado: { apertura: '11:00', cierre: '23:00' },
            domingo: { apertura: '12:00', cierre: '20:00' }
          },
          calificacion: 4.8,
          numeroCalificaciones: 156,
          logo: 'https://via.placeholder.com/300x200?text=Restaurante',
          imagenes: [
            'https://via.placeholder.com/600x400?text=Imagen1',
            'https://via.placeholder.com/600x400?text=Imagen2',
            'https://via.placeholder.com/600x400?text=Imagen3'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurante();
  }, [id, API_URL]);

  // Obtener menú del restaurante
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        const response = await axios.get(`${API_URL}/menu/${id}`);
        setProductos(response.data.productos);
        
        // Establecer la primera categoría como activa
        if (Object.keys(response.data.productos).length > 0) {
          setActiveCategory(Object.keys(response.data.productos)[0]);
        }
      } catch (error) {
        console.error('Error al cargar menú:', error);
        
        // Datos de ejemplo para desarrollo
        const mockProductos: ProductosPorCategoria = {
          'entrada': [
            {
              _id: '101',
              nombre: 'Empanadas Colombianas',
              descripcion: 'Deliciosas empanadas de carne, papa y hogao. Servidas con ají.',
              precio: 12000,
              imagen: 'https://via.placeholder.com/300x200?text=Empanadas',
              categoria: 'entrada',
              disponible: true,
              tiempo_preparacion: 10,
              opciones: [
                { nombre: 'Extra ají', precio_adicional: 2000 }
              ],
              destacado: true
            },
            {
              _id: '102',
              nombre: 'Patacones con Hogao',
              descripcion: 'Patacones crujientes con hogao casero y guacamole fresco.',
              precio: 10000,
              imagen: 'https://via.placeholder.com/300x200?text=Patacones',
              categoria: 'entrada',
              disponible: true,
              tiempo_preparacion: 15,
              opciones: [
                { nombre: 'Con chicharrón', precio_adicional: 5000 }
              ],
              destacado: false
            }
          ],
          'plato principal': [
            {
              _id: '201',
              nombre: 'Bandeja Paisa',
              descripcion: 'Plato tradicional con frijoles, arroz, carne molida, chicharrón, huevo frito, aguacate y arepa.',
              precio: 30000,
              imagen: 'https://via.placeholder.com/300x200?text=Bandeja+Paisa',
              categoria: 'plato principal',
              disponible: true,
              tiempo_preparacion: 25,
              opciones: [
                { nombre: 'Doble carne', precio_adicional: 8000 },
                { nombre: 'Extra aguacate', precio_adicional: 3000 }
              ],
              destacado: true
            },
            {
              _id: '202',
              nombre: 'Ajiaco Santafereño',
              descripcion: 'Sopa tradicional bogotana con papa, mazorca, pollo y crema de leche.',
              precio: 25000,
              imagen: 'https://via.placeholder.com/300x200?text=Ajiaco',
              categoria: 'plato principal',
              disponible: true,
              tiempo_preparacion: 20,
              opciones: [
                { nombre: 'Con arroz', precio_adicional: 3000 },
                { nombre: 'Extra pollo', precio_adicional: 7000 }
              ],
              destacado: false
            }
          ],
          'bebida': [
            {
              _id: '301',
              nombre: 'Limonada de Coco',
              descripcion: 'Refrescante limonada con crema de coco y hielo triturado.',
              precio: 8000,
              imagen: 'https://via.placeholder.com/300x200?text=Limonada+Coco',
              categoria: 'bebida',
              disponible: true,
              tiempo_preparacion: 5,
              opciones: [
                { nombre: 'Grande', precio_adicional: 3000 }
              ],
              destacado: false
            },
            {
              _id: '302',
              nombre: 'Jugo Natural',
              descripcion: 'Jugo natural de fruta de temporada. Opciones: mora, lulo, maracuyá, guanábana.',
              precio: 7000,
              imagen: 'https://via.placeholder.com/300x200?text=Jugo+Natural',
              categoria: 'bebida',
              disponible: true,
              tiempo_preparacion: 5,
              opciones: [
                { nombre: 'Con leche', precio_adicional: 2000 },
                { nombre: 'Grande', precio_adicional: 3000 }
              ],
              destacado: false
            }
          ],
          'postre': [
            {
              _id: '401',
              nombre: 'Postre de Natas',
              descripcion: 'Tradicional postre de natas con melao y canela.',
              precio: 10000,
              imagen: 'https://via.placeholder.com/300x200?text=Postre+Natas',
              categoria: 'postre',
              disponible: true,
              tiempo_preparacion: 10,
              opciones: [],
              destacado: true
            },
            {
              _id: '402',
              nombre: 'Brevas con Arequipe',
              descripcion: 'Brevas cocinadas en almíbar y rellenas con arequipe.',
              precio: 9000,
              imagen: 'https://via.placeholder.com/300x200?text=Brevas',
              categoria: 'postre',
              disponible: true,
              tiempo_preparacion: 5,
              opciones: [
                { nombre: 'Con queso', precio_adicional: 3000 }
              ],
              destacado: false
            }
          ]
        };
        
        setProductos(mockProductos);
        
        // Establecer la primera categoría como activa
        if (Object.keys(mockProductos).length > 0) {
          setActiveCategory(Object.keys(mockProductos)[0]);
        }
      } finally {
        setLoadingMenu(false);
      }
    };

    if (id) {
      fetchMenu();
    }
  }, [id, API_URL]);

  // Manejar la adición de productos al carrito
  const handleAddToCart = (product: Producto, cantidad: number, opcionesSeleccionadas: string[], comentarios: string) => {
    if (!restaurante) return;
    
    // Calcular precio total con opciones
    let precioTotal = product.precio;
    opcionesSeleccionadas.forEach(opNombre => {
      const opcion = product.opciones.find(op => op.nombre === opNombre);
      if (opcion) {
        precioTotal += opcion.precio_adicional;
      }
    });
    
    const cartItem = {
      id: product._id,
      nombre: product.nombre,
      precio: precioTotal,
      cantidad,
      opciones: opcionesSeleccionadas,
      comentarios,
      imagen: product.imagen
    };
    
    addItem(cartItem, {
      id: restaurante._id,
      nombre: restaurante.nombre
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <p className="mt-2 text-gray-600">Cargando información del restaurante...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurante) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-gray-500">{error || 'Ocurrió un error al cargar el restaurante.'}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/restaurantes')}
              className="btn-primary inline-flex items-center"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Volver a restaurantes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Portada del restaurante */}
      <div className="relative h-64 md:h-80 bg-primary-dark">
        {restaurante.imagenes && restaurante.imagenes.length > 0 ? (
          <img
            src={restaurante.imagenes[0]}
            alt={restaurante.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-2xl">
            {restaurante.nombre}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end">
              <img
                src={restaurante.logo || 'https://via.placeholder.com/150?text=Logo'}
                alt="Logo"
                className="w-20 h-20 md:w-24 md:h-24 object-cover bg-white rounded-lg mr-4 shadow-md"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{restaurante.nombre}</h1>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(restaurante.calificacion)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">
                    {restaurante.calificacion.toFixed(1)} ({restaurante.numeroCalificaciones} reseñas)
                  </span>
                </div>
                <div className="text-sm mt-1">
                  <span className="mr-2">{restaurante.categoria}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    estaAbierto() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {estaAbierto() ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del restaurante y menú */}
          <div className="lg:col-span-2">
            {/* Información del restaurante */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Sobre {restaurante.nombre}</h2>
              <p className="text-gray-700 mb-4">{restaurante.descripcion}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Ubicación</h3>
                  <p className="text-gray-700">{restaurante.direccion.calle}</p>
                  <p className="text-gray-700">{restaurante.direccion.ciudad}, {restaurante.direccion.codigoPostal}</p>
                  <p className="text-gray-700 mt-1">{restaurante.telefono}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Horario</h3>
                  {restaurante.horario ? (
                    <ul className="space-y-1">
                      {diasSemana.map((dia) => (
                        <li key={dia} className={`text-sm ${dia === diaActual ? 'font-semibold' : ''}`}>
                          {dia.charAt(0).toUpperCase() + dia.slice(1)}:{' '}
                          {restaurante.horario && restaurante.horario[dia] ? (
                            `${restaurante.horario[dia].apertura} - ${restaurante.horario[dia].cierre}`
                          ) : (
                            'Cerrado'
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">Horario no disponible</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Menú del restaurante */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold mb-4">Menú</h2>
              </div>
              
              {/* Navegación de categorías */}
              <div className="px-6 mb-4 overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {Object.keys(productos).map((categoria) => (
                    <button
                      key={categoria}
                      className={`whitespace-nowrap px-4 py-2 rounded-md font-medium ${
                        activeCategory === categoria
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(categoria)}
                    >
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Lista de productos */}
              {loadingMenu ? (
                <div className="p-6 text-center">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                  <p className="mt-2 text-gray-600">Cargando menú...</p>
                </div>
              ) : Object.keys(productos).length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No hay productos disponibles</p>
                </div>
              ) : (
                <div className="p-6 pt-0">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">
                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                  </h3>
                  <div className="space-y-6">
                    {activeCategory && productos[activeCategory]?.map((producto) => (
                      <ProductCard
                        key={producto._id}
                        id={producto._id}
                        nombre={producto.nombre}
                        descripcion={producto.descripcion}
                        precio={producto.precio}
                        imagen={producto.imagen}
                        categoria={producto.categoria}
                        opciones={producto.opciones}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Carrito de compras */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ShoppingCart
                items={items}
                restauranteId={restaurante._id}
                restauranteNombre={restaurante.nombre}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
