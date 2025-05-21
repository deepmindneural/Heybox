import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CartSummary from '../../components/cart/CartSummary';

const CheckoutPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, totalItems } = useCart();
  const navigate = useNavigate();

  // Redireccionar si no está autenticado o si el carrito está vacío
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/checkout' } });
      } else if (totalItems === 0) {
        navigate('/restaurants');
      }
    }
  }, [authLoading, isAuthenticated, totalItems, navigate]);

  // Manejar finalización exitosa del checkout
  const handleCheckoutSuccess = (orderId: string) => {
    navigate(`/order/${orderId}`, {
      state: { fromCheckout: true }
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-gray-600">
            Completa tu información para finalizar el pedido
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-4">
              No hay productos en tu carrito. Agrega algunos productos antes de proceder al checkout.
            </p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Explorar restaurantes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CheckoutForm onSuccess={handleCheckoutSuccess} />
            </div>
            <div>
              <CartSummary showHeader={true} showCheckoutButton={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
