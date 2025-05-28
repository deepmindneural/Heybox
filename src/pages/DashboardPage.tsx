import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Componentes internos
const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: JSX.Element, color: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${color} hover:shadow-lg transition-shadow`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} text-${color.replace('border-', '').replace('-500', '-600')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Componente para gráficos de actividad
const ActivityChart = ({ data }: { data: { label: string, value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1">
        {data.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-primary-light rounded-t-sm w-full" 
              style={{ 
                height: `${(day.value / maxValue) * 100}px`,
                minHeight: '4px',
                opacity: day.value ? 0.7 + (day.value / maxValue) * 0.3 : 0.3
              }}
            ></div>
            <span className="text-xs text-gray-500 mt-1">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para pedidos recientes
const RecentOrders = () => {
  const orders = [
    { id: '43821', restaurant: 'Pizza Planet', status: 'Entregado', date: '20/05/2025', total: '$35.900' },
    { id: '43820', restaurant: 'Burgers & Co', status: 'En camino', date: '19/05/2025', total: '$42.300' },
    { id: '43815', restaurant: 'Sushi Express', status: 'Preparando', date: '18/05/2025', total: '$58.500' },
    { id: '43807', restaurant: 'Taco Loco', status: 'Entregado', date: '15/05/2025', total: '$27.800' },
  ];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurante</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ver</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.restaurant}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'Entregado' 
                    ? 'bg-green-100 text-green-800' 
                    : order.status === 'En camino' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/pedido/${order.id}`} className="text-primary hover:text-primary-dark">Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para restaurantes favoritos
const FavoriteRestaurants = () => {
  const favorites = [
    { id: 1, name: 'Pizza Planet', image: 'https://via.placeholder.com/50', categories: 'Italiana, Pizza', rating: 4.8 },
    { id: 2, name: 'Sushi Express', image: 'https://via.placeholder.com/50', categories: 'Japonesa, Sushi', rating: 4.7 },
    { id: 3, name: 'Burgers & Co', image: 'https://via.placeholder.com/50', categories: 'Hamburguesas, Americana', rating: 4.5 },
  ];
  
  return (
    <div className="space-y-4">
      {favorites.map((restaurant) => (
        <div key={restaurant.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <img src={restaurant.image} alt={restaurant.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{restaurant.name}</h3>
            <p className="text-xs text-gray-500">{restaurant.categories}</p>
          </div>
          <div className="flex items-center space-x-1 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
          <Link to={`/restaurante/${restaurant.id}`} className="text-sm text-primary hover:text-primary-dark">
            Ver
          </Link>
        </div>
      ))}
      <div className="text-center mt-2">
        <Link to="/restaurantes" className="text-sm text-primary hover:text-primary-dark">
          Ver todos los restaurantes
        </Link>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { usuario } = useAuth();
  const [dailyActivity, setDailyActivity] = useState<{ label: string, value: number }[]>([]);
  
  // Generar datos de actividad para la semana
  useEffect(() => {
    const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const mockData = weekdays.map(day => ({
      label: day,
      value: Math.floor(Math.random() * 100),
    }));
    setDailyActivity(mockData);
  }, []);
  
  return (
    <div className="py-6">
      {/* Encabezado de la página */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido{usuario?.nombre ? `, ${usuario.nombre.split(' ')[0]}` : ''} a tu centro de gestión personal
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tarjetas de estadísticas */}
          <StatCard 
            title="Pedidos Totales" 
            value="24" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            } 
            color="border-primary-500" 
          />
          <StatCard 
            title="Restaurantes Favoritos" 
            value="8" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            } 
            color="border-red-500" 
          />
          <StatCard 
            title="Créditos Disponibles" 
            value="$35.000" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } 
            color="border-green-500" 
          />
          <StatCard 
            title="Promociones Activas" 
            value="6" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            } 
            color="border-purple-500" 
          />
        </div>
        
        {/* Sección principal del dashboard */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gráfico de actividad */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-900">Actividad Semanal</h2>
              <div className="flex items-center space-x-2">
                <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20">
                  <option>Esta semana</option>
                  <option>Mes pasado</option>
                  <option>Este año</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Resumen de tus pedidos durante la semana</p>
            <ActivityChart data={dailyActivity} />
          </div>
          
          {/* Restaurantes favoritos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tus Restaurantes Favoritos</h2>
            <FavoriteRestaurants />
          </div>
        </div>
        
        {/* Pedidos recientes */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pedidos Recientes</h2>
            <p className="mt-1 text-sm text-gray-500">Un resumen de tus últimos pedidos realizados</p>
          </div>
          <RecentOrders />
          <div className="px-6 py-3 flex justify-end border-t border-gray-200">
            <Link 
              to="/mis-pedidos" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Ver todos mis pedidos
            </Link>
          </div>
        </div>
        
        {/* Sección de créditos y promociones */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Panel de créditos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-5 text-white">
              <h2 className="text-lg font-medium">Tus Créditos HEYBOX</h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold">$35.000</p>
                <p className="ml-2 text-sm opacity-80">disponibles</p>
              </div>
            </div>
            <div className="border-t border-primary-dark border-opacity-10 px-6 py-5">
              <h3 className="text-sm font-medium text-gray-900">Historial de Transacciones</h3>
              <ul className="mt-3 divide-y divide-gray-100">
                <li className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Recarga de créditos</p>
                    <p className="text-xs text-gray-500">20/05/2025</p>
                  </div>
                  <p className="text-sm font-medium text-green-600">+$20.000</p>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Pedido #43821</p>
                    <p className="text-xs text-gray-500">20/05/2025</p>
                  </div>
                  <p className="text-sm font-medium text-red-600">-$5.000</p>
                </li>
                <li className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Crédito de referido</p>
                    <p className="text-xs text-gray-500">18/05/2025</p>
                  </div>
                  <p className="text-sm font-medium text-green-600">+$10.000</p>
                </li>
              </ul>
              <div className="mt-4 text-center">
                <button className="text-sm text-primary hover:text-primary-dark font-medium">
                  Ver historial completo
                </button>
              </div>
            </div>
          </div>
          
          {/* Panel de promociones */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Promociones Destacadas</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      HOY
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">¡2x1 en Pizzas!</h3>
                    <p className="mt-1 text-sm text-gray-600">Pide una pizza y lleva otra gratis en Pizza Planet</p>
                  </div>
                  <span className="text-yellow-600 font-bold">50% OFF</span>
                </div>
                <div className="mt-3 text-sm">
                  <Link to="/promociones" className="font-medium text-yellow-600 hover:text-yellow-700">
                    Ver promoción
                  </Link>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      NUEVO
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">Envío Gratis</h3>
                    <p className="mt-1 text-sm text-gray-600">En tu primer pedido de Sushi Express</p>
                  </div>
                  <span className="text-blue-600 font-bold">GRATIS</span>
                </div>
                <div className="mt-3 text-sm">
                  <Link to="/promociones" className="font-medium text-blue-600 hover:text-blue-700">
                    Ver promoción
                  </Link>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/promociones" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark">
                  Ver todas las promociones
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
