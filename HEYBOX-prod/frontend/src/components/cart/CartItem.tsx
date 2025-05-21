import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

interface CartItemProps {
  item: {
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
  };
  onUpdateQuantity: (id: string, cantidad: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const totalPrecioOpciones = item.opciones.reduce((sum, opcion) => sum + opcion.precio, 0);
  const precioUnitario = item.precio + totalPrecioOpciones;
  const precioTotal = precioUnitario * item.cantidad;

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex">
        {item.imagen && (
          <div className="w-16 h-16 mr-3 flex-shrink-0">
            <img 
              src={item.imagen} 
              alt={item.nombre} 
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/80?text=Producto';
              }}
            />
          </div>
        )}
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{item.nombre}</h3>
              <div className="text-gray-500 text-sm mt-1">
                ${precioUnitario.toFixed(2)} x {item.cantidad}
              </div>
            </div>
            <div className="font-bold text-blue-600">${precioTotal.toFixed(2)}</div>
          </div>
          
          {item.opciones.length > 0 && (
            <div className="mt-1 text-xs text-gray-600">
              {item.opciones.map((opcion, index) => (
                <div key={index} className="flex justify-between">
                  <span>{opcion.nombre}: {opcion.valor}</span>
                  {opcion.precio > 0 && <span>+${opcion.precio.toFixed(2)}</span>}
                </div>
              ))}
            </div>
          )}
          
          {item.comentarios && (
            <div className="mt-1 text-xs text-gray-500 italic">
              {item.comentarios}
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                disabled={item.cantidad <= 1}
                className={`p-1 rounded ${
                  item.cantidad <= 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaMinus size={12} />
              </button>
              <span className="mx-2">{item.cantidad}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                className="p-1 rounded text-gray-700 hover:bg-gray-200"
              >
                <FaPlus size={12} />
              </button>
            </div>
            
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-1 rounded text-red-600 hover:bg-red-100"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
