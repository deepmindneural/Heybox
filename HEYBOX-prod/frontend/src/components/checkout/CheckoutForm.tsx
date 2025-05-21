import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { createOrder } from '../../services/api';

interface CheckoutFormProps {
  onSuccess?: (orderId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { usuario } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentLocation, getUserLocation } = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    telefono: usuario?.telefono || '',
    direccion: usuario?.direccion || '',
    notas: '',
    metodoPago: 'efectivo',
    propina: 0
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  
  // Opciones de propina
  const propinaOptions = [
    { value: 0, label: 'Sin propina' },
    { value: 5, label: '5%' },
    { value: 10, label: '10%' },
    { value: 15, label: '15%' }
  ];
  
  // Pre-llenar formulario con información del usuario
  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({
        ...prev,
        nombre: usuario.nombre || prev.nombre,
        telefono: usuario.telefono || prev.telefono,
        direccion: usuario.direccion || prev.direccion
      }));
    }
  }, [usuario]);
  
  // Manejar ubicación actual
  const handleGetCurrentLocation = async () => {
    setLocationLoading(true);
    setShowLocationError(false);
    
    try {
      const success = await getUserLocation();
      
      if (success && currentLocation) {
        setUseCurrentLocation(true);
      } else {
        setShowLocationError(true);
      }
    } catch (error) {
      setShowLocationError(true);
    } finally {
      setLocationLoading(false);
    }
  };
  
  // Manejar cambio en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s+/g, ''))) {
      newErrors.telefono = 'Teléfono inválido';
    }
    
    if (!useCurrentLocation && !formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calcular totales
  const subtotal = cartTotal;
  const impuestos = subtotal * 0.19;
  const propina = (subtotal * parseInt(formData.propina.toString())) / 100;
  const total = subtotal + impuestos + propina;
  
  // Enviar pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar los datos del pedido
      const orderData = {
        items: cartItems.map(item => ({
          productoId: item.productoId,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad
        })),
        restauranteId: cartItems[0].restauranteId,
        direccion: useCurrentLocation ? 'Usar ubicación actual' : formData.direccion,
        ubicacion: useCurrentLocation ? currentLocation : null,
        nombre: formData.nombre,
        telefono: formData.telefono,
        notas: formData.notas,
        metodoPago: formData.metodoPago,
        subtotal,
        impuestos,
        propina,
        total
      };
      
      // Enviar pedido al servidor
      const response = await createOrder(orderData);
      
      // Limpiar carrito después de pedido exitoso
      clearCart();
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(response.pedido._id);
      } else {
        // Redirigir a la página de confirmación
        navigate(`/order/${response.pedido._id}`);
      }
    } catch (error: any) {
      console.error('Error al crear el pedido:', error);
      alert(error.response?.data?.mensaje || 'Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Completa tu pedido</h2>
      
      {cartItems.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
          <button 
            onClick={() => navigate('/restaurants')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Explorar restaurantes
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Información personal */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Dirección */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Dirección de entrega</h3>
              
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locationLoading}
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md ${
                    useCurrentLocation 
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {locationLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  )}
                  {useCurrentLocation ? 'Usando ubicación actual' : 'Usar mi ubicación actual'}
                </button>
                
                {showLocationError && (
                  <p className="mt-1 text-sm text-red-600">
                    No se pudo obtener tu ubicación. Por favor, habilita los permisos de ubicación o ingresa una dirección manualmente.
                  </p>
                )}
              </div>
              
              {!useCurrentLocation && (
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección completa
                  </label>
                  <textarea
                    id="direccion"
                    name="direccion"
                    rows={3}
                    value={formData.direccion}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${
                      errors.direccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Calle, número, apartamento, ciudad, referencias..."
                  />
                  {errors.direccion && (
                    <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Método de pago */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Método de pago</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={formData.metodoPago === 'efectivo'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Efectivo</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={formData.metodoPago === 'tarjeta'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Tarjeta (al recoger)</span>
                </label>
              </div>
            </div>
            
            {/* Propina */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Propina</h3>
              
              <div className="grid grid-cols-4 gap-2">
                {propinaOptions.map(option => (
                  <label 
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                      parseInt(formData.propina.toString()) === option.value
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="propina"
                      value={option.value}
                      checked={parseInt(formData.propina.toString()) === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-lg font-medium">
                      {option.value > 0 ? `${option.value}%` : 'Ninguna'}
                    </span>
                    {option.value > 0 && (
                      <span className="text-sm text-gray-500 mt-1">
                        ${((subtotal * option.value) / 100).toLocaleString('es-CO')}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Notas adicionales */}
            <div>
              <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales (opcional)
              </label>
              <textarea
                id="notas"
                name="notas"
                rows={3}
                value={formData.notas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Instrucciones especiales, solicitudes para tu pedido..."
              />
            </div>
            
            {/* Resumen del pedido */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen del pedido</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos (19%)</span>
                  <span>${impuestos.toLocaleString('es-CO')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Propina ({formData.propina}%)</span>
                  <span>${propina.toLocaleString('es-CO')}</span>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
            
            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Confirmar pedido'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
