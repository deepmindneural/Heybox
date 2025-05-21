import axios from 'axios';

// Configuración de axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Configurar el cliente axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si la respuesta es 401 (no autorizado), limpiar el token y redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Solo redirigir si estamos en el navegador
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API de autenticación
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (userData: any) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

// API de restaurantes
export const fetchRestaurants = async (params?: any) => {
  try {
    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching restaurants:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener restaurantes');
  }
};

export const fetchRestaurantDetails = async (id: string) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export const searchRestaurants = async (query: string) => {
  const response = await api.get('/restaurants/search', { params: { q: query } });
  return response.data;
};

// API de promociones
export const fetchPromos = async () => {
  try {
    const response = await api.get('/promos');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching promos:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener promociones');
  }
};

// API de pedidos
export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const fetchUserOrders = async () => {
  const response = await api.get('/orders/me');
  return response.data;
};

export const fetchOrderDetails = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id: string) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};

// API de ubicación
export const updateOrderLocation = async (orderId: string, locationData: any) => {
  const response = await api.post('/location/update', {
    pedidoId: orderId,
    ...locationData
  });
  return response.data;
};

// API de categorías
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener categorías');
  }
};

// API de reviews
export const createReview = async (reviewData: any) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const fetchRestaurantReviews = async (restaurantId: string) => {
  const response = await api.get(`/reviews/restaurant/${restaurantId}`);
  return response.data;
};

// API de favoritos
export const addFavoriteRestaurant = async (restaurantId: string) => {
  const response = await api.post('/favorites', { restauranteId: restaurantId });
  return response.data;
};

export const removeFavoriteRestaurant = async (restaurantId: string) => {
  const response = await api.delete(`/favorites/${restaurantId}`);
  return response.data;
};

export const fetchUserFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data;
};

// Exportar el cliente de axios configurado
export default api;
