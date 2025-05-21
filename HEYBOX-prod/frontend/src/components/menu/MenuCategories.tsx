import React, { useState, useRef, useEffect } from 'react';
import MenuItem from './MenuItem';

interface MenuCategory {
  _id: string;
  nombre: string;
  descripcion?: string;
}

interface MenuItemType {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  disponible: boolean;
  categoria: string;
  opciones?: {
    nombre: string;
    items: {
      nombre: string;
      precio?: number;
    }[];
    multiple?: boolean;
    obligatorio?: boolean;
  }[];
}

interface MenuCategoriesProps {
  categories: MenuCategory[];
  items: MenuItemType[];
  onAddToCart: (item: any, cantidad: number, opciones: any[], comentarios: string) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({ categories, items, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Establecer la categoría activa inicial
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
    }
  }, [categories, activeCategory]);

  // Observador de scroll para detectar qué categoría está visible
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const scrollPosition = scrollContainerRef.current.scrollTop;
      const containerHeight = scrollContainerRef.current.clientHeight;
      setIsScrolled(scrollPosition > 20);
      
      // Encontrar la categoría más visible
      let activeId = '';
      let maxVisibility = 0;
      
      Object.entries(categoryRefs.current).forEach(([categoryId, ref]) => {
        if (!ref) return;
        
        const rect = ref.getBoundingClientRect();
        const containerRect = scrollContainerRef.current!.getBoundingClientRect();
        const topInView = rect.top >= containerRect.top;
        const bottomInView = rect.bottom <= containerRect.top + containerHeight;
        
        let visibility = 0;
        if (topInView && bottomInView) {
          visibility = rect.height;
        } else if (topInView) {
          visibility = containerRect.top + containerHeight - rect.top;
        } else if (bottomInView) {
          visibility = rect.bottom - containerRect.top;
        }
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          activeId = categoryId;
        }
      });
      
      if (activeId && activeId !== activeCategory) {
        setActiveCategory(activeId);
      }
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeCategory]);

  // Scroll a la categoría seleccionada
  const scrollToCategory = (categoryId: string) => {
    const ref = categoryRefs.current[categoryId];
    if (ref && scrollContainerRef.current) {
      setActiveCategory(categoryId);
      
      scrollContainerRef.current.scrollTo({
        top: ref.offsetTop - 70, // Ajustar para el encabezado
        behavior: 'smooth'
      });
    }
  };

  // Agrupar elementos por categoría
  const itemsByCategory = categories.map(category => {
    return {
      ...category,
      items: items.filter(item => item.categoria === category._id)
    };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Tabs de categorías */}
      <div className={`sticky top-0 z-10 bg-white transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="overflow-x-auto">
          <div className="flex space-x-2 p-4 min-w-max">
            {categories.map(category => (
              <button
                key={category._id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeCategory === category._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => scrollToCategory(category._id)}
              >
                {category.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contenido de categorías */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pb-20" // añadir padding bottom para dar espacio al carrito fijo
      >
        {itemsByCategory.map(category => (
          <div
            key={category._id}
            ref={el => categoryRefs.current[category._id] = el}
            className="mb-8"
          >
            <div className="mb-4 px-4">
              <h2 className="text-xl font-bold text-gray-900">{category.nombre}</h2>
              {category.descripcion && (
                <p className="text-gray-600 text-sm">{category.descripcion}</p>
              )}
            </div>
            
            <div className="space-y-4 px-4">
              {category.items.length > 0 ? (
                category.items.map(item => (
                  <MenuItem 
                    key={item._id} 
                    item={item} 
                    onAddToCart={onAddToCart} 
                  />
                ))
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                  No hay productos disponibles en esta categoría
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;
