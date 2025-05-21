import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCreditCard, FaWallet, FaPaypal, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  total: number;
  creditsAvailable?: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
  total,
  creditsAvailable = 0
}) => {
  const { isAuthenticated } = useAuth();
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [cardErrors, setCardErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Si el método seleccionado cambia a o desde tarjeta, actualizar el estado
    setShowCreditCardForm(selectedMethod === 'tarjeta');
  }, [selectedMethod]);

  const handleCardDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({
      ...cardData,
      [name]: value
    });

    // Validaciones básicas
    validateCardField(name, value);
  };

  const validateCardField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'cardNumber':
        if (!/^\d{0,16}$/.test(value)) {
          error = 'El número debe tener 16 dígitos';
        }
        break;
      case 'expiry':
        if (value && !/^\d{2}\/\d{2}$/.test(value)) {
          error = 'Formato debe ser MM/AA';
        }
        break;
      case 'cvc':
        if (value && !/^\d{3,4}$/.test(value)) {
          error = 'El CVC debe tener 3 o 4 dígitos';
        }
        break;
      case 'name':
        if (value && value.length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
    }

    setCardErrors({
      ...cardErrors,
      [name]: error
    });
  };

  // Formatear entrada de tarjeta
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };

  const hasSufficientCredits = creditsAvailable >= total;

  const paymentMethods = [
    {
      id: 'efectivo',
      name: 'Efectivo',
      icon: FaMoneyBillWave,
      description: 'Paga en efectivo al recibir tu pedido'
    },
    {
      id: 'tarjeta',
      name: 'Tarjeta de crédito/débito',
      icon: FaCreditCard,
      description: 'Paga con tu tarjeta de forma segura'
    },
    {
      id: 'creditos',
      name: 'Créditos HEYBOX',
      icon: FaWallet,
      description: `Saldo disponible: $${creditsAvailable.toFixed(2)}`,
      disabled: !hasSufficientCredits || !isAuthenticated,
      disabledReason: !isAuthenticated 
        ? 'Inicia sesión para usar tus créditos' 
        : !hasSufficientCredits 
          ? 'Saldo insuficiente' 
          : undefined
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: FaPaypal,
      description: 'Paga de forma segura con PayPal'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Método de pago</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <label 
              className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              } ${method.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => !method.disabled && onSelectMethod(method.id)}
                className="h-5 w-5 mt-0.5 text-blue-600 mr-3"
                disabled={method.disabled}
              />
              
              <div className="flex-1">
                <div className="flex items-center">
                  <method.icon className={`h-5 w-5 ${selectedMethod === method.id ? 'text-blue-600' : 'text-gray-500'} mr-2`} />
                  <div className="font-medium text-gray-900">{method.name}</div>
                  
                  {method.disabledReason && (
                    <div className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                      {method.disabledReason}
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {method.description}
                </div>
              </div>
            </label>
            
            {/* Información adicional para créditos */}
            {method.id === 'creditos' && isAuthenticated && selectedMethod === 'creditos' && (
              <div className="mt-2 ml-8 text-sm">
                {hasSufficientCredits ? (
                  <div className="text-green-600 flex items-center">
                    <FaInfoCircle className="mr-1" />
                    Se debitarán ${total.toFixed(2)} de tus créditos
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="text-red-600 flex items-center">
                      <FaInfoCircle className="mr-1" />
                      Necesitas ${(total - creditsAvailable).toFixed(2)} más para completar este pedido
                    </div>
                    <button 
                      className="text-blue-600 underline hover:text-blue-800"
                      onClick={() => window.location.href = '/creditos/comprar'}
                    >
                      Comprar más créditos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Formulario de tarjeta */}
      {showCreditCardForm && (
        <div className="mt-4 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ingresa los datos de tu tarjeta</h4>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="cardNumber" className="block text-xs font-medium text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardData.cardNumber)}
                onChange={handleCardDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                maxLength={19}
              />
              {cardErrors.cardNumber && (
                <p className="mt-1 text-xs text-red-600">{cardErrors.cardNumber}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="expiry" className="block text-xs font-medium text-gray-700 mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  placeholder="MM/AA"
                  value={formatExpiry(cardData.expiry)}
                  onChange={handleCardDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength={5}
                />
                {cardErrors.expiry && (
                  <p className="mt-1 text-xs text-red-600">{cardErrors.expiry}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cvc" className="block text-xs font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={handleCardDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  maxLength={4}
                />
                {cardErrors.cvc && (
                  <p className="mt-1 text-xs text-red-600">{cardErrors.cvc}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="JUAN PEREZ"
                value={cardData.name}
                onChange={handleCardDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {cardErrors.name && (
                <p className="mt-1 text-xs text-red-600">{cardErrors.name}</p>
              )}
            </div>
            
            <div className="mt-1 text-xs text-gray-500 flex items-center">
              <FaInfoCircle className="mr-1" />
              Tus datos son seguros. La información se envía encriptada.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
