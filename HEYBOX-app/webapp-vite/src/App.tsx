import React, { useState } from 'react';

function App() {
  // Estado para el botón de localización
  const [ubicacionActivada, setUbicacionActivada] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [pedidoActivo, setPedidoActivo] = useState(false);
  
  // Categorías de comida
  const categorias = [
    { id: 'hamburguesas', nombre: 'Hamburguesas', icono: '🍔', color: 'from-cyan-500 to-blue-500' },
    { id: 'pizza', nombre: 'Pizza', icono: '🍕', color: 'from-pink-500 to-red-500' },
    { id: 'sushi', nombre: 'Sushi', icono: '🍣', color: 'from-green-400 to-teal-500' },
    { id: 'tacos', nombre: 'Tacos', icono: '🌮', color: 'from-yellow-400 to-amber-500' },
    { id: 'ensaladas', nombre: 'Ensaladas', icono: '🥗', color: 'from-lime-400 to-green-500' },
    { id: 'postres', nombre: 'Postres', icono: '🍰', color: 'from-purple-400 to-pink-500' }
  ];
  
  // Restaurantes destacados
  const restaurantesDestacados = [
    { id: 1, nombre: 'Burger Gourmet', categoria: 'Hamburguesas', imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', calificacion: 4.8, tiempo: '20-30 min' },
    { id: 2, nombre: 'La Pizzería', categoria: 'Pizza', imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', calificacion: 4.6, tiempo: '25-35 min' },
    { id: 3, nombre: 'Sushi Master', categoria: 'Sushi', imagen: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', calificacion: 4.9, tiempo: '30-40 min' },
    { id: 4, nombre: 'Taquería Mexicana', categoria: 'Tacos', imagen: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', calificacion: 4.7, tiempo: '15-25 min' }
  ];
  
  // Método para activar la ubicación
  const activarUbicacion = () => {
    setUbicacionActivada(true);
    // Simular retraso para mostrar efecto de carga
    setTimeout(() => {
      setMostrarMapa(true);
    }, 1000);
  };
  
  // Método para iniciar un pedido
  const iniciarPedido = () => {
    setPedidoActivo(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">HB</span>
            </div>
            <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-400 bg-clip-text text-transparent">HEYBOX</h1>
          </div>
          
          {/* Información servidor */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              Frontend (5173)
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
              Backend (5001)
            </span>
          </div>
          
          {/* Botones de acción */}
          <div className="flex items-center space-x-2">
            <button className="text-white bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 rounded-lg shadow-md hover:from-cyan-600 hover:to-teal-500 transition duration-300 ease-in-out flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Carrito
            </button>
            <button className="text-cyan-600 border border-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-50 transition duration-300 ease-in-out">
              Ingresar
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-12 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-400 opacity-90 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40"></div>
          
          <div className="relative z-20 py-16 px-8 md:px-16 text-white max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ordena y recoge sin esperar</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Elige entre los mejores restaurantes, ordena online y recibe tu comida apenas llegues al local.
            </p>
            
            {!ubicacionActivada ? (
              <button 
                onClick={activarUbicacion}
                className="bg-white text-cyan-600 py-3 px-6 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Activar mi ubicación
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/30">
                {!mostrarMapa ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Obteniendo tu ubicación...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">¡Ubicación detectada!</span>
                    </div>
                    <p className="text-sm mb-2">Bogotá, Colombia</p>
                    <button 
                      onClick={iniciarPedido}
                      className="w-full bg-white text-cyan-600 py-2 px-4 rounded-lg font-medium shadow-md hover:bg-gray-100 transition duration-300"
                    >
                      Buscar restaurantes cercanos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Categorías */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Explora por categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map(categoria => (
              <div key={categoria.id} className="relative group cursor-pointer">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${categoria.color} opacity-80 group-hover:opacity-90 transition duration-300`}></div>
                <div className="relative p-6 text-center text-white">
                  <div className="text-4xl mb-2">{categoria.icono}</div>
                  <h3 className="font-medium group-hover:font-semibold transition-all duration-300">{categoria.nombre}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Restaurantes destacados */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Restaurantes Destacados</h2>
            <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center">
              Ver todos
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurantesDestacados.map(restaurante => (
              <div key={restaurante.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={restaurante.imagen || `https://via.placeholder.com/500x300?text=${encodeURIComponent(restaurante.nombre)}`} 
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/500x300?text=${encodeURIComponent(restaurante.nombre)}`;
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-white rounded-bl-lg py-1 px-2 shadow-md">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-800 ml-1">{restaurante.calificacion}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{restaurante.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">{restaurante.categoria}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {restaurante.tiempo}
                    </span>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium py-1 px-3 rounded-lg transition duration-300">
                      Ordenar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Banner de código de retiro */}
        <section className="mb-12 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-xl overflow-hidden shadow-lg">
          <div className="md:flex items-center">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">¡Tu código de retiro digital!</h2>
              <p className="text-white/90 mb-6 text-lg">
                Con HEYBOX, olvídate de las filas. Ordena, paga y muestra tu código QR o ID al llegar al restaurante para retirar tu pedido sin esperas.
              </p>
              <button className="bg-white text-cyan-600 font-medium py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
                Conocer más
              </button>
            </div>
            <div className="md:w-1/2 p-6 flex justify-center">
              <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Burger Gourmet</h3>
                    <p className="text-sm text-gray-500">Pedido #45678</p>
                  </div>
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    LISTO
                  </div>
                </div>
                <div className="bg-cyan-500 text-white rounded-lg p-4 text-center mb-4">
                  <p className="text-sm font-medium">CÓDIGO DE RETIRO</p>
                  <p className="text-3xl font-bold tracking-widest">3829</p>
                </div>
                <div className="flex justify-center mb-4">
                  {/* Simulación de código QR */}
                  <div className="w-32 h-32 border-2 border-gray-200 rounded-lg grid grid-cols-4 grid-rows-4 p-2 bg-white">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'} rounded-sm`}></div>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-medium transition duration-300">
                  Mostrar Código
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">HB</span>
                </div>
                <h2 className="ml-2 text-xl font-bold">HEYBOX</h2>
              </div>
              <p className="mt-2 text-gray-400 text-sm text-center md:text-left">Sistema de pedidos y retiro para restaurantes</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">&copy; 2025 HEYBOX Restaurant App</p>
              <p className="mt-1 text-xs text-gray-500">Versión 0.1.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
