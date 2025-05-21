import React, { useState } from 'react';
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

interface MenuItemProps {
  item: {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen?: string;
    disponible: boolean;
    opciones?: {
      nombre: string;
      items: {
        nombre: string;
        precio?: number;
      }[];
      multiple?: boolean;
      obligatorio?: boolean;
    }[];
  };
  onAddToCart: (item: any, cantidad: number, opciones: any[], comentarios: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [comentarios, setComentarios] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Inicializar opciones seleccionadas
  React.useEffect(() => {
    if (item.opciones) {
      const initialOptions: Record<string, string[]> = {};
      item.opciones.forEach(opcion => {
        initialOptions[opcion.nombre] = opcion.obligatorio && opcion.items.length > 0 && !opcion.multiple 
          ? [opcion.items[0].nombre] 
          : [];
      });
      setSelectedOptions(initialOptions);
    }
  }, [item]);

  const handleOptionChange = (opcionNombre: string, itemNombre: string, multiple: boolean) => {
    setSelectedOptions(prev => {
      const updated = { ...prev };
      
      if (multiple) {
        // Para opciones múltiples, toggle el item
        if (updated[opcionNombre].includes(itemNombre)) {
          updated[opcionNombre] = updated[opcionNombre].filter(item => item !== itemNombre);
        } else {
          updated[opcionNombre] = [...updated[opcionNombre], itemNombre];
        }
      } else {
        // Para opciones únicas, reemplazar la selección
        updated[opcionNombre] = [itemNombre];
      }
      
      return updated;
    });
  };

  const handleAddToCart = () => {
    // Convertir opciones seleccionadas a formato esperado por la función onAddToCart
    const opcionesSeleccionadas = Object.entries(selectedOptions).flatMap(([opcionNombre, itemsSeleccionados]) => {
      return itemsSeleccionados.map(itemNombre => {
        const opcion = item.opciones?.find(opt => opt.nombre === opcionNombre);
        const opcionItem = opcion?.items.find(it => it.nombre === itemNombre);
        return {
          nombre: opcionNombre,
          valor: itemNombre,
          precio: opcionItem?.precio || 0
        };
      });
    });

    onAddToCart(item, cantidad, opcionesSeleccionadas, comentarios);
    setIsModalOpen(false);
    
    // Reset form
    setCantidad(1);
    setComentarios('');
    if (item.opciones) {
      const initialOptions: Record<string, string[]> = {};
      item.opciones.forEach(opcion => {
        initialOptions[opcion.nombre] = opcion.obligatorio && opcion.items.length > 0 && !opcion.multiple 
          ? [opcion.items[0].nombre] 
          : [];
      });
      setSelectedOptions(initialOptions);
    }
  };

  const isButtonDisabled = () => {
    if (!item.disponible) return true;
    
    // Verificar si todas las opciones obligatorias están seleccionadas
    if (item.opciones) {
      for (const opcion of item.opciones) {
        if (opcion.obligatorio && selectedOptions[opcion.nombre].length === 0) {
          return true;
        }
      }
    }
    
    return false;
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.disponible ? 'opacity-60' : ''}`}
        onClick={() => item.disponible && setIsModalOpen(true)}
      >
        <div className="flex">
          {item.imagen && (
            <div className="w-24 h-24 flex-shrink-0">
              <img 
                src={item.imagen} 
                alt={item.nombre} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/100?text=Producto';
                }}
              />
            </div>
          )}
          
          <div className="p-4 flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium">{item.nombre}</h3>
              <span className="font-bold text-blue-600">${item.precio.toFixed(2)}</span>
            </div>
            
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.descripcion}</p>
            
            {!item.disponible && (
              <div className="mt-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                No disponible
              </div>
            )}
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <button 
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md 
              ${item.disponible 
              ? 'text-white bg-blue-600 hover:bg-blue-700' 
              : 'text-gray-500 bg-gray-200 cursor-not-allowed'}`}
            disabled={!item.disponible}
            onClick={(e) => {
              e.stopPropagation();
              if (item.disponible) {
                setIsModalOpen(true);
              }
            }}
          >
            <FaShoppingCart className="mr-2" /> 
            {item.opciones?.length ? 'Personalizar' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {/* Modal para personalizar el producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">{item.nombre}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {item.imagen && (
                <div className="mb-4 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x200?text=Producto';
                    }}
                  />
                </div>
              )}
              
              <p className="text-gray-600 mb-4">{item.descripcion}</p>
              
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-blue-600 text-xl">${item.precio.toFixed(2)}</span>
                
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3 py-1 border-l border-r border-gray-300">{cantidad}</span>
                  <button
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setCantidad(prev => prev + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              {/* Opciones del producto */}
              {item.opciones && item.opciones.length > 0 && (
                <div className="space-y-4 mb-4">
                  {item.opciones.map((opcion, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{opcion.nombre}</h3>
                        {opcion.obligatorio && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Obligatorio
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {opcion.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center">
                            <input
                              type={opcion.multiple ? 'checkbox' : 'radio'}
                              id={`${opcion.nombre}-${item.nombre}`}
                              name={opcion.nombre}
                              checked={selectedOptions[opcion.nombre]?.includes(item.nombre)}
                              onChange={() => handleOptionChange(opcion.nombre, item.nombre, !!opcion.multiple)}
                              className={opcion.multiple ? 'form-checkbox' : 'form-radio'}
                            />
                            <label htmlFor={`${opcion.nombre}-${item.nombre}`} className="ml-2 flex-grow">
                              {item.nombre}
                            </label>
                            {item.precio !== undefined && item.precio > 0 && (
                              <span className="text-gray-600">+${item.precio.toFixed(2)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Comentarios */}
              <div className="mb-4">
                <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios o instrucciones especiales
                </label>
                <textarea
                  id="comentarios"
                  placeholder="Ej: Sin cebolla, salsa aparte, etc."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled()}
                className={`px-4 py-2 rounded-md text-white 
                  ${isButtonDisabled() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Agregar al carrito - ${(item.precio * cantidad).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;
