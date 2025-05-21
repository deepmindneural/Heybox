import React, { useState } from 'react';

interface Opcion {
  nombre: string;
  precio_adicional: number;
}

interface ProductCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  opciones: Opcion[];
  onAddToCart: (product: any, cantidad: number, opcionesSeleccionadas: string[], comentarios: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  categoria,
  opciones,
  onAddToCart
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<string[]>([]);
  const [comentarios, setComentarios] = useState('');

  const handleOpcionChange = (opcionNombre: string) => {
    if (opcionesSeleccionadas.includes(opcionNombre)) {
      setOpcionesSeleccionadas(opcionesSeleccionadas.filter(o => o !== opcionNombre));
    } else {
      setOpcionesSeleccionadas([...opcionesSeleccionadas, opcionNombre]);
    }
  };

  const calcularPrecioTotal = () => {
    let total = precio * cantidad;
    
    opcionesSeleccionadas.forEach(opcionNombre => {
      const opcion = opciones.find(o => o.nombre === opcionNombre);
      if (opcion) {
        total += opcion.precio_adicional * cantidad;
      }
    });
    
    return total;
  };

  const toggleOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  const handleAddToCart = () => {
    onAddToCart(
      {
        id,
        nombre,
        precio,
        imagen,
        categoria,
      },
      cantidad,
      opcionesSeleccionadas,
      comentarios
    );
    
    // Reiniciar el estado
    setCantidad(1);
    setOpcionesSeleccionadas([]);
    setComentarios('');
    setMostrarOpciones(false);
  };

  return (
    <div className="card flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-1/4">
        <img
          src={imagen || 'https://via.placeholder.com/150?text=Producto'}
          alt={nombre}
          className="h-40 w-full md:h-full object-cover"
        />
      </div>
      <div className="p-4 md:w-3/4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
            <p className="mt-1 text-sm text-gray-600">{descripcion}</p>
          </div>
          <span className="text-lg font-bold text-primary">
            ${precio.toLocaleString('es-CO')}
          </span>
        </div>
        
        {opciones.length > 0 && (
          <button
            type="button"
            onClick={toggleOpciones}
            className="mt-3 text-sm text-primary hover:text-primary-dark focus:outline-none flex items-center"
          >
            {mostrarOpciones ? 'Ocultar opciones' : 'Mostrar opciones'}
            <svg
              className={`ml-1 h-4 w-4 transform ${
                mostrarOpciones ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        
        {mostrarOpciones && (
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Opciones adicionales:</p>
            {opciones.map((opcion) => (
              <div key={opcion.nombre} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${id}-${opcion.nombre}`}
                  checked={opcionesSeleccionadas.includes(opcion.nombre)}
                  onChange={() => handleOpcionChange(opcion.nombre)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor={`${id}-${opcion.nombre}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {opcion.nombre} (+${opcion.precio_adicional.toLocaleString('es-CO')})
                </label>
              </div>
            ))}
            <div className="mt-3">
              <label htmlFor={`comments-${id}`} className="block text-sm font-medium text-gray-700">
                Comentarios adicionales:
              </label>
              <textarea
                id={`comments-${id}`}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                className="mt-1 input-field text-sm"
                rows={2}
                placeholder="Ej: Sin cebolla, cocción término medio, etc."
              />
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="mx-2 text-gray-700">{cantidad}</span>
            <button
              type="button"
              onClick={() => setCantidad(cantidad + 1)}
              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div>
            {(opcionesSeleccionadas.length > 0 || cantidad > 1) && (
              <span className="mr-2 text-sm text-gray-500">
                Total: ${calcularPrecioTotal().toLocaleString('es-CO')}
              </span>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-primary flex items-center"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
