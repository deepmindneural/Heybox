import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RestaurantsPage from '../pages/RestaurantsPage';
import RestaurantDetailPage from '../pages/RestaurantDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

// Páginas protegidas (requieren autenticación)
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import CheckoutPage from '../pages/CheckoutPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';

// Rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/order/:id" 
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } 
      />

      {/* Ruta 404 - No encontrado */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
