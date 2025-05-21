import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGeolocation from '../../hooks/useGeolocation';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

interface PaymentProcessorProps {
  total: number;
  pedido: {
    id: string;
    items: Array<{
      id: string;
      nombre: string;
      cantidad: number;
      precio: number;
    }>;
    restaurante: {
      id: string;
      nombre: string;
    };
  };
  onPaymentComplete: (paymentData: any) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  total,
  pedido,
  onPaymentComplete
}) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    numero: '',
    nombre: '',
    expiracion: '',
    cvv: ''
  });

  // Inicializar el hook de geolocalización
  const { latitude, longitude, startTracking } = useGeolocation({
    pedidoId: pedido.id,
    enableHighAccuracy: true,
    trackingInterval: 15000 // 15 segundos
  });

  // Métodos de pago disponibles
  const paymentMethods: PaymentMethod[] = [
    { id: 'credit_card', name: 'Tarjeta de Crédito/Débito', icon: '💳' },
    { id: 'mercado_pago', name: 'Mercado Pago', icon: '🔵' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'efectivo', name: 'Efectivo al retirar', icon: '💵' }
  ];

  // Manejar cambio en campos de tarjeta
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Procesar el pago
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      setError('Por favor, selecciona un método de pago');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Realizar solicitud al servidor para procesar el pago
      const response = await axios.post('/api/pagos/procesar', {
        metodoPago: selectedMethod,
        pedidoId: pedido.id,
        total,
        datosTarjeta: selectedMethod === 'credit_card' ? cardData : undefined,
        ubicacion: {
          lat: latitude,
          lng: longitude
        }
      });

      // Si el pago es exitoso, iniciar el seguimiento de ubicación
      if (response.data.exito) {
        // Iniciar seguimiento de ubicación en tiempo real
        startTracking();
        
        // Notificar al componente padre que el pago se completó
        onPaymentComplete(response.data);
        
        // Redirigir a la página de seguimiento
        setTimeout(() => {
          navigate(`/track/${pedido.id}`);
        }, 1000);
      } else {
        setError(response.data.mensaje || 'Error al procesar el pago');
      }
    } catch (err: any) {
      console.error('Error en el proceso de pago:', err);
      setError(err.response?.data?.mensaje || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Método de Pago</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Selecciona un método de pago:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-cyan-500 bg-cyan-50' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod === 'credit_card' && (
        <form onSubmit={handlePayment} className="mb-6">
          <div className="mb-4">
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              value={cardData.numero}
              onChange={handleCardInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre en la tarjeta
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="JUAN PEREZ"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              value={cardData.nombre}
              onChange={handleCardInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiracion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <input
                type="text"
                id="expiracion"
                name="expiracion"
                placeholder="MM/AA"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                value={cardData.expiracion}
                onChange={handleCardInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                Código de seguridad
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                required
                maxLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                value={cardData.cvv}
                onChange={handleCardInputChange}
              />
            </div>
          </div>
        </form>
      )}

      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${(total * 0.84).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">IVA (16%):</span>
          <span className="font-medium">${(total * 0.16).toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4 text-lg font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors disabled:opacity-50"
        onClick={handlePayment}
        disabled={loading || !selectedMethod}
      >
        {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Al hacer clic en "Pagar", aceptas compartir tu ubicación en tiempo real para la entrega.
      </p>
    </div>
  );
};

export default PaymentProcessor;
