import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSummary from '../../components/cart/CartSummary';
import { useAuth } from '../../context/AuthContext';

const CartPage: React.FC = () => {
  const { items, isCartEmpty, restaurante } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Tu Carrito</h1>
          <p className="text-gray-600">
            Revisa y modifica los productos en tu carrito
          </p>
        </div>
        
        {isCartEmpty ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-4">
              No hay productos en tu carrito. Agrega algunos productos para comenzar a realizar tu pedido.
            </p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Explorar restaurantes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CartSummary showHeader={false} showCheckoutButton={false} />
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
                
                {restaurante && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Restaurante:</h4>
                    <p className="text-gray-800">{restaurante.nombre}</p>
                  </div>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">
                      ${items.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo de envío</span>
                    <span className="text-gray-800 font-medium">$3.99</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      ${(items.reduce((sum, item) => sum + item.precio * item.cantidad, 0) + 3.99).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Proceder al checkout
                  </button>
                  
                  <button 
                    onClick={() => restaurante && navigate(`/restaurant/${restaurante.id}`)}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Agregar más productos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
