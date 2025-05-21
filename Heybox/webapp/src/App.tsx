import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Páginas
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

// Protección de rutas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Esta función se podría completar con lógica real para verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LocationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              
              <main className="flex-grow">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurantes" element={<RestaurantsPage />} />
                  <Route path="/restaurante/:id" element={<RestaurantDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/registro" element={<RegisterPage />} />
                  
                  {/* Rutas que requieren autenticación */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/pedidos/:orderId" element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/mis-pedidos" element={
                    <ProtectedRoute>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Ruta 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
        </LocationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
