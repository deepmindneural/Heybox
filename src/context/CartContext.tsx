import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  opciones: string[];
  comentarios: string;
  imagen?: string;
}

interface CartRestaurante {
  id: string;
  nombre: string;
}

interface CartContextProps {
  items: CartItem[];
  restaurante: CartRestaurante | null;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem, restauranteInfo: CartRestaurante) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, cantidad: number) => void;
  clearCart: () => void;
  isCartEmpty: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurante, setRestaurante] = useState<CartRestaurante | null>(null);
  
  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurante = localStorage.getItem('cartRestaurante');
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        localStorage.removeItem('cart');
      }
    }
    
    if (savedRestaurante) {
      try {
        setRestaurante(JSON.parse(savedRestaurante));
      } catch (error) {
        console.error('Error al cargar la información del restaurante:', error);
        localStorage.removeItem('cartRestaurante');
      }
    }
  }, []);
  
  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [items]);
  
  // Guardar la información del restaurante en localStorage cuando cambie
  useEffect(() => {
    if (restaurante) {
      localStorage.setItem('cartRestaurante', JSON.stringify(restaurante));
    } else {
      localStorage.removeItem('cartRestaurante');
    }
  }, [restaurante]);
  
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  
  const isCartEmpty = items.length === 0;
  
  const addItem = (item: CartItem, restauranteInfo: CartRestaurante) => {
    // Si el carrito tiene productos de otro restaurante, preguntar si quiere limpiar el carrito
    if (restaurante && restaurante.id !== restauranteInfo.id && items.length > 0) {
      if (
        window.confirm(
          `Tu carrito contiene productos de ${restaurante.nombre}. ¿Deseas eliminarlo para agregar productos de ${restauranteInfo.nombre}?`
        )
      ) {
        setItems([item]);
        setRestaurante(restauranteInfo);
      }
    } else {
      setItems([...items, item]);
      if (!restaurante) {
        setRestaurante(restauranteInfo);
      }
    }
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    
    if (newItems.length === 0) {
      setRestaurante(null);
    }
  };
  
  const updateQuantity = (index: number, cantidad: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], cantidad };
    setItems(newItems);
  };
  
  const clearCart = () => {
    setItems([]);
    setRestaurante(null);
  };
  
  return (
    <CartContext.Provider
      value={{
        items,
        restaurante,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartEmpty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
