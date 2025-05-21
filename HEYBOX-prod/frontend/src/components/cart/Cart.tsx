import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTimes, FaArrowRight } from 'react-icons/fa';
import CartItem from './CartItem';
import { useAuth } from '../../context/AuthContext';

interface CartProps {
  items: Array<{
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    opciones: Array<{
      nombre: string;
      valor: string;
      precio: number;
    }>;
    comentarios?: string;
    imagen?: string;
  }>;
  restaurante: {
    id: string;
    nombre: string;
  } | null;
  onUpdateQuantity: (id: string, cantidad: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  restaurante,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => {
      const precioOpciones = item.opciones.reduce((sum, opcion) => sum + opcion.precio, 0);
      return sum + (item.precio + precioOpciones) * item.cantidad;
    }, 0);
  };

  const costoEnvio = 3.99;
  const subtotal = calcularSubtotal();
  const total = subtotal + costoEnvio;
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      <div 
        className={`fixed bottom-6 right-6 z-50 ${items.length === 0 ? 'hidden' : ''}`}
        onClick={toggleCart}
      >
        <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer relative hover:bg-blue-700 transition-colors">
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {totalItems}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal del carrito */}
      <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
        {/* Capa de oscurecimiento */}
        <div 
          className="absolute inset-0 bg-black opacity-50"
          onClick={toggleCart}
        ></div>
        
        {/* Contenido del carrito */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-xl flex flex-col">
          {/* Encabezado del carrito */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold flex items-center">
              <FaShoppingCart className="mr-2" /> 
              Tu Carrito ({totalItems})
            </h2>
            <button 
              onClick={toggleCart}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Restaurante */}
          {restaurante && (
            <div className="px-4 py-3 bg-gray-100">
              <div className="text-sm text-gray-600">Pedido de:</div>
              <div className="font-medium">{restaurante.nombre}</div>
            </div>
          )}
          
          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full">
                <FaShoppingCart size={40} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                <p className="text-gray-500 mb-4">Agrega productos para comenzar a realizar tu pedido</p>
                <button
                  onClick={toggleCart}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Explorar restaurantes
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Footer con el total y botones */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo de envío</span>
                  <span>${costoEnvio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Proceder al checkout <FaArrowRight className="ml-2" />
                </button>
                
                <button
                  onClick={onClearCart}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
