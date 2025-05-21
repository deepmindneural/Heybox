import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface CartSummaryProps {
  isDrawer?: boolean;
  onClose?: () => void;
  showHeader?: boolean;
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  isDrawer = false,
  onClose,
  showHeader = true,
  showCheckoutButton = true
}) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [groupedItems, setGroupedItems] = useState<any>({});
  const [restaurant, setRestaurant] = useState<any>(null);

  // Agrupar los productos por restaurante
  useEffect(() => {
    const grouped: any = {};
    let currentRestaurant = null;

    cartItems.forEach(item => {
      if (!grouped[item.restauranteId]) {
        grouped[item.restauranteId] = {
          restauranteNombre: item.restauranteNombre,
          items: []
        };
      }

      grouped[item.restauranteId].items.push(item);
      
      // Obtener información del restaurante (asumiendo que solo hay uno)
      if (!currentRestaurant) {
        currentRestaurant = {
          _id: item.restauranteId,
          nombre: item.restauranteNombre
        };
      }
    });

    setGroupedItems(grouped);
    setRestaurant(currentRestaurant);
  }, [cartItems]);

  // Manejar la actualización de cantidad
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menos, eliminar el producto
      removeFromCart(itemId);
    } else {
      // Actualizar la cantidad del producto
      updateQuantity(itemId, newQuantity);
    }
  };

  // Navegar al checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
    
    if (onClose) {
      onClose();
    }
  };

  // Navegar al restaurante
  const handleViewRestaurant = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
    
    if (onClose) {
      onClose();
    }
  };

  // Limpiar el carrito
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro que deseas vaciar el carrito?')) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={`bg-white ${isDrawer ? 'h-full flex flex-col' : 'rounded-lg shadow-md p-6'}`}>
        {showHeader && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tu Carrito</h3>
            {isDrawer && onClose && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500 text-center">Tu carrito está vacío</p>
          <button 
            onClick={() => navigate('/restaurants')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Explorar restaurantes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${isDrawer ? 'h-full flex flex-col' : 'rounded-lg shadow-md p-6'}`}>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Tu Carrito</h3>
          {isDrawer && onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedItems).map(restaurantId => (
          <div key={restaurantId} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700">
                {groupedItems[restaurantId].restauranteNombre}
              </h4>
              <button 
                onClick={() => handleViewRestaurant(restaurantId)}
                className="text-sm text-blue-600 hover:underline"
              >
                Ver restaurante
              </button>
            </div>
            
            <div className="space-y-4">
              {groupedItems[restaurantId].items.map((item: any) => (
                <div key={item.productoId} className="flex border-b border-gray-200 pb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0">
                    {item.imagen ? (
                      <img 
                        src={item.imagen} 
                        alt={item.nombre}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-gray-900">{item.nombre}</h5>
                      <button 
                        onClick={() => removeFromCart(item.productoId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      ${item.precio.toLocaleString('es-CO')}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleQuantityChange(item.productoId, item.cantidad - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-2 py-1 text-gray-900 min-w-[30px] text-center">
                          {item.cantidad}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.productoId, item.cantidad + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      
                      <span className="font-medium text-gray-900">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${cartTotal.toLocaleString('es-CO')}</span>
        </div>
        
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Impuestos (19%)</span>
          <span className="font-medium">${(cartTotal * 0.19).toLocaleString('es-CO')}</span>
        </div>
        
        <div className="flex justify-between mb-6 text-lg font-bold">
          <span>Total</span>
          <span>${(cartTotal * 1.19).toLocaleString('es-CO')}</span>
        </div>
        
        <div className="flex flex-col space-y-2">
          {showCheckoutButton && (
            <button 
              onClick={handleCheckout}
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Proceder al Pago
            </button>
          )}
          
          <button 
            onClick={handleClearCart}
            className="w-full py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
