import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { fetchRestaurantDetails, fetchRestaurantReviews } from '../../services/api';
import RestaurantDetail from '../../components/restaurants/RestaurantDetail';
import CartSummary from '../../components/cart/CartSummary';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items, restaurante } = useCart();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCartWarning, setShowCartWarning] = useState<boolean>(false);
  
  // Verificar si hay items en el carrito de otro restaurante
  useEffect(() => {
    if (restaurante && id && restaurante.id !== id && items.length > 0) {
      setShowCartWarning(true);
    } else {
      setShowCartWarning(false);
    }
  }, [restaurante, id, items]);
  
  // Cargar datos del restaurante
  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchRestaurantDetails(id);
        setRestaurant(data);
        
        // Cargar reseñas
        const reviewsData = await fetchRestaurantReviews(id);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar los detalles del restaurante');
        console.error('Error al cargar detalles del restaurante:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadRestaurantData();
  }, [id]);
  
  // Manejar la limpieza del carrito para cambiar de restaurante
  const handleClearCartForNewRestaurant = () => {
    // Aquí usaríamos el contexto del carrito para limpiarlo
    // Asumiendo que clearCart está disponible en el contexto
    const { clearCart } = useCart();
    clearCart();
    setShowCartWarning(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error al cargar el restaurante</h3>
            <p className="text-gray-600 mb-4">
              {error || 'No se pudo encontrar el restaurante solicitado.'}
            </p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Volver a restaurantes
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {showCartWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Ya tienes productos de otro restaurante en tu carrito
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    No puedes agregar productos de diferentes restaurantes. Si deseas continuar, deberás vaciar tu carrito actual.
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <button 
                      onClick={handleClearCartForNewRestaurant}
                      className="px-4 py-1.5 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 hover:bg-yellow-200"
                    >
                      Vaciar carrito
                    </button>
                    <button 
                      onClick={() => navigate('/cart')}
                      className="px-4 py-1.5 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Ver carrito actual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <RestaurantDetail 
              restaurant={restaurant}
              reviews={reviews}
            />
          </div>
          <div>
            {items.length > 0 && (
              <CartSummary showHeader={true} showCheckoutButton={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
