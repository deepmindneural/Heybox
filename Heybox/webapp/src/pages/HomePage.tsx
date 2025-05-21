import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const HomePage: React.FC = () => {
  const [restaurantesFeatured, setRestaurantesFeatured] = useState<Restaurante[]>([]);
  const [restaurantesNew, setRestaurantesNew] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const response = await axios.get(`${API_URL}/restaurantes`);
        
        // En una situación real, el API devolvería listas diferentes
        // Aquí simulamos restaurantes destacados y nuevos
        const allRestaurantes = response.data.restaurantes || [];
        
        // Tomamos los 4 primeros para los destacados (ordenados por calificación)
        const featured = [...allRestaurantes]
          .sort((a, b) => b.calificacion - a.calificacion)
          .slice(0, 4);
        
        // Tomamos los 4 primeros para los nuevos (ordenados por fecha de creación)
        const newOnes = [...allRestaurantes]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        
        setRestaurantesFeatured(featured);
        setRestaurantesNew(newOnes);
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
          }
        ];
        
        setRestaurantesFeatured(mockData);
        setRestaurantesNew(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, [API_URL]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-20">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Ordena y recoge tu comida sin esperar</h1>
            <p className="text-lg md:text-xl mb-8">
              HEYBOX te permite hacer tu pedido online, pagar y recogerlo justo cuando llegas al restaurante. ¡Sin filas ni esperas!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/restaurantes" className="btn-primary bg-white text-primary hover:bg-gray-100 py-3 px-6 text-center">
                Ver Restaurantes
              </Link>
              <Link to="/como-funciona" className="btn-secondary bg-transparent border-white text-white hover:bg-white/10 py-3 px-6 text-center">
                ¿Cómo funciona?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurantes Destacados */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Restaurantes Destacados</h2>
            <Link to="/restaurantes" className="text-primary hover:text-primary-dark font-medium">
              Ver todos
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-2 text-gray-600">Cargando restaurantes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurantesFeatured.map(restaurante => (
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
      </section>

      {/* Cómo funciona */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Cómo funciona HEYBOX</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Haz tu pedido</h3>
              <p className="text-gray-600">
                Explora restaurantes cercanos, elige tus comidas favoritas y realiza tu pedido online.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Paga online</h3>
              <p className="text-gray-600">
                Realiza el pago de forma segura con tarjeta, efectivo o tu método de pago preferido.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Recógelo al llegar</h3>
              <p className="text-gray-600">
                El restaurante sigue tu ubicación y tendrá tu pedido listo justo cuando llegues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurantes Nuevos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Restaurantes Nuevos</h2>
            <Link to="/restaurantes" className="text-primary hover:text-primary-dark font-medium">
              Ver todos
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-2 text-gray-600">Cargando restaurantes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurantesNew.map(restaurante => (
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
      </section>

      {/* Banner de descarga de App */}
      <section className="bg-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Descarga nuestra app móvil</h2>
              <p className="text-lg mb-6">
                Obtén una experiencia aún mejor en tu dispositivo móvil. Realiza pedidos, paga y recoge sin esperas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="block">
                  <img src="https://via.placeholder.com/150x50?text=App+Store" alt="App Store" className="h-12" />
                </a>
                <a href="#" className="block">
                  <img src="https://via.placeholder.com/150x50?text=Google+Play" alt="Google Play" className="h-12" />
                </a>
              </div>
            </div>
            <div className="md:w-1/3">
              <img src="https://via.placeholder.com/300x600?text=App+Preview" alt="App Preview" className="max-h-80 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
