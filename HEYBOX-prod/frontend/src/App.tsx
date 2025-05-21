import React from 'react';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Páginas principales
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';

// Páginas de restaurantes
import RestaurantsListPage from './pages/restaurants/RestaurantsListPage';
import RestaurantDetailPage from './pages/restaurants/RestaurantDetailPage';

// Páginas de pedidos
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import TrackingPage from './pages/tracking/TrackingPage';

// Páginas de créditos
import CreditosPage from './pages/creditos/CreditosPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // O un componente de carga
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  // Simular tiempo de carga inicial
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null; // El spinner de carga ya está en el index.html
  }

  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Rutas principales */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="restaurants" element={<RestaurantsListPage />} />
        <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Proteger estas rutas si el usuario no está autenticado */}
        <Route path="checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="order/:id" element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } />
        <Route path="track/:id" element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        } />

        {/* Rutas de créditos */}
        <Route path="creditos" element={
          <ProtectedRoute>
            <CreditosPage />
          </ProtectedRoute>
        } />
        <Route path="creditos/comprar" element={
          <ProtectedRoute>
            <CreditosPage section="comprar" />
          </ProtectedRoute>
        } />
        <Route path="creditos/historial" element={
          <ProtectedRoute>
            <CreditosPage section="historial" />
          </ProtectedRoute>
        } />

        {/* Ruta por defecto para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
