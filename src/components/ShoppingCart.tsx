import React from 'react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  opciones: string[];
  comentarios: string;
  imagen?: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  restauranteId: string;
  restauranteNombre: string;
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, cantidad: number) => void;
  onClearCart: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  restauranteId,
  restauranteNombre,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  // Calcular total del carrito
  const calcularTotal = () => {
    return items.reduce((total, item) => {
      return total + item.precio * item.cantidad;
    }, 0);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Carrito vacío</h3>
        <p className="mt-1 text-sm text-gray-500">
          No tienes productos en tu carrito de compras.
        </p>
        <div className="mt-6">
          <Link
            to={`/restaurantes/${restauranteId}`}
            className="btn-primary inline-flex items-center"
          >
            <svg
              className="mr-2 -ml-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-medium text-gray-900">
          Tu pedido en <span className="text-primary">{restauranteNombre}</span>
        </h2>
        <button
          type="button"
          onClick={onClearCart}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Vaciar carrito
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`} className="py-4 flex">
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="h-16 w-16 object-cover rounded"
              />
            )}
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{item.nombre}</h3>
                <p className="text-sm font-medium text-gray-900">
                  ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                </p>
              </div>
              {item.opciones.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Opciones: {item.opciones.join(', ')}
                </p>
              )}
              {item.comentarios && (
                <p className="text-xs text-gray-500 mt-1">
                  Nota: {item.comentarios}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(index, Math.max(1, item.cantidad - 1))}
                    className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="mx-2 text-gray-700 text-sm">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(index, item.cantidad + 1)}
                    className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${calcularTotal().toLocaleString('es-CO')}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Impuestos calculados en el proceso de pago.
        </p>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="btn-primary w-full py-3 text-center"
          >
            Proceder al pago
          </Link>
          <div className="mt-3 flex justify-center text-sm text-gray-500">
            <p>
              o{' '}
              <Link
                to={`/restaurantes/${restauranteId}`}
                className="text-primary hover:text-primary-dark"
              >
                Continuar comprando
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
