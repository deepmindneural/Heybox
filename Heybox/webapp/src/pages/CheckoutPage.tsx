import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface FormaPago {
  id: string;
  tipo: string;
  ultimosDigitos?: string;
  fechaExpiracion?: string;
  titular?: string;
}

interface DireccionEntrega {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  referencia?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, restaurante, totalPrice, clearCart } = useCart();
  const { usuario, isAuthenticated, token } = useAuth();
  
  const [formasPago, setFormasPago] = useState<FormaPago[]>([]);
  const [formaPagoSeleccionada, setFormaPagoSeleccionada] = useState<string>('');
  const [nuevaFormaPago, setNuevaFormaPago] = useState<boolean>(false);
  
  const [direccionEntrega, setDireccionEntrega] = useState<DireccionEntrega>({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    referencia: ''
  });
  
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [loadingPago, setLoadingPago] = useState<boolean>(false);
  const [errorPago, setErrorPago] = useState<string | null>(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Redirigir si no hay elementos en el carrito o no hay restaurante seleccionado
  useEffect(() => {
    if (items.length === 0 || !restaurante) {
      navigate('/');
    }
  }, [items, restaurante, navigate]);

  // Cargar las formas de pago del usuario
  useEffect(() => {
    if (isAuthenticated && usuario) {
      // En una aplicación real, cargaríamos los métodos de pago del usuario desde el API
      const metodosUsuario = usuario.metodosPago || [];
      
      // Convertir métodos de pago del usuario al formato requerido
      const formasPagoUsuario: FormaPago[] = metodosUsuario.map((metodo, index) => ({
        id: index.toString(),
        tipo: metodo.tipo,
        ultimosDigitos: metodo.detalles?.ultimosDigitos,
        fechaExpiracion: metodo.detalles?.fechaExpiracion,
        titular: metodo.detalles?.titular
      }));
      
      // Agregar opciones adicionales
      const opcionesAdicionales: FormaPago[] = [
        { id: 'nueva-tarjeta', tipo: 'tarjeta', ultimosDigitos: undefined },
        { id: 'efectivo', tipo: 'efectivo' }
      ];
      
      setFormasPago([...formasPagoUsuario, ...opcionesAdicionales]);
      
      // Seleccionar la primera forma de pago por defecto
      if (formasPagoUsuario.length > 0) {
        setFormaPagoSeleccionada(formasPagoUsuario[0].id);
      } else {
        setFormaPagoSeleccionada('nueva-tarjeta');
        setNuevaFormaPago(true);
      }
      
      // Cargar dirección del usuario
      if (usuario.direccion) {
        setDireccionEntrega({
          calle: usuario.direccion.calle || '',
          ciudad: usuario.direccion.ciudad || '',
          codigoPostal: usuario.direccion.codigoPostal || '',
          referencia: ''
        });
      }
    }
  }, [isAuthenticated, usuario]);

  // Función para cambiar forma de pago
  const handleFormaPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFormaPagoSeleccionada(valor);
    setNuevaFormaPago(valor === 'nueva-tarjeta');
  };

  // Función para cambiar datos de la dirección
  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDireccionEntrega({
      ...direccionEntrega,
      [e.target.name]: e.target.value
    });
  };

  // Función para procesar el pago
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aceptaTerminos) {
      setErrorPago('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    try {
      setLoadingPago(true);
      setErrorPago(null);
      
      // Preparar datos del pedido
      const pedidoData = {
        restauranteId: restaurante?.id,
        productos: items.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          opciones: item.opciones,
          comentarios: item.comentarios
        })),
        metodoPago: {
          tipo: formasPago.find(fp => fp.id === formaPagoSeleccionada)?.tipo || 'tarjeta',
          detalles: nuevaFormaPago
            ? {
                // Datos que vendrían del formulario de tarjeta en una app real
                transaccionId: `TX-${Date.now()}`,
                ultimosDigitos: '1234' // Simulado para desarrollo
              }
            : {
                transaccionId: `TX-${Date.now()}`,
                ultimosDigitos: formasPago.find(fp => fp.id === formaPagoSeleccionada)?.ultimosDigitos
              }
        }
      };
      
      // En una aplicación real, aquí se procesaría el pago con una pasarela como Stripe
      // Para nuestro ejemplo, simularemos una respuesta exitosa
      
      // Crear pedido en el backend
      const response = await axios.post(
        `${API_URL}/orders`,
        pedidoData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de confirmación
      navigate(`/pedidos/${response.data.pedido._id}`, {
        state: {
          success: true,
          numeroPedido: response.data.pedido.numeroPedido,
          codigoVerificacion: response.data.pedido.codigoVerificacion
        }
      });
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      setErrorPago(error.response?.data?.mensaje || 'Ha ocurrido un error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setLoadingPago(false);
    }
  };

  // Si no hay items, mostrar mensaje
  if (items.length === 0 || !restaurante) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
          <p className="mb-6">No tienes productos en tu carrito de compras.</p>
          <button
            onClick={() => navigate('/restaurantes')}
            className="btn-primary"
          >
            Explorar restaurantes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalizar pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de pago */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Paso 1: Resumen del pedido */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
                <p className="text-gray-600 mb-4">
                  Pedido en <span className="font-medium">{restaurante.nombre}</span>
                </p>
                
                <div className="border-t border-gray-200 pt-4">
                  <ul className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <div>
                          <span className="font-medium">{item.cantidad}x </span>
                          {item.nombre}
                          {item.opciones.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {item.opciones.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-gray-900">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal</span>
                      <span>${totalPrice.toLocaleString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>IVA (incluido)</span>
                      <span>${(totalPrice * 0.19).toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${totalPrice.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
              
              {/* Paso 2: Método de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Método de pago</h2>
                
                <div className="space-y-4">
                  {formasPago.map((formaPago) => (
                    <div key={formaPago.id} className="flex items-center">
                      <input
                        id={`formaPago-${formaPago.id}`}
                        name="formaPago"
                        type="radio"
                        value={formaPago.id}
                        checked={formaPagoSeleccionada === formaPago.id}
                        onChange={handleFormaPagoChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor={`formaPago-${formaPago.id}`} className="ml-3 flex items-center">
                        {formaPago.tipo === 'tarjeta' && (
                          <svg className="h-6 w-6 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                        {formaPago.tipo === 'efectivo' && (
                          <svg className="h-6 w-6 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                        
                        <div>
                          {formaPago.id === 'nueva-tarjeta' && 'Nueva tarjeta de crédito/débito'}
                          {formaPago.id === 'efectivo' && 'Pago en efectivo al recoger'}
                          {formaPago.tipo === 'tarjeta' && formaPago.ultimosDigitos && (
                            <>
                              Tarjeta terminada en {formaPago.ultimosDigitos}
                              {formaPago.fechaExpiracion && (
                                <span className="text-sm text-gray-500 ml-2">
                                  (Vence: {formaPago.fechaExpiracion})
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {/* Formulario para nueva tarjeta */}
                {nuevaFormaPago && (
                  <div className="mt-6 p-4 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Número de tarjeta
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="input-field mt-1"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Fecha de expiración
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          placeholder="MM/AA"
                          className="input-field mt-1"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                          className="input-field mt-1"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Nombre en la tarjeta
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          placeholder="NOMBRE APELLIDO"
                          className="input-field mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Paso 3: Términos y finalizar */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start mb-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      Acepto los términos y condiciones
                    </label>
                    <p className="text-gray-500">
                      Al realizar este pedido, acepto compartir mi ubicación en tiempo real y los{' '}
                      <a href="/terminos" className="text-primary hover:text-primary-dark">
                        términos y condiciones
                      </a>{' '}
                      de HEYBOX.
                    </p>
                  </div>
                </div>
                
                {errorPago && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {errorPago}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loadingPago}
                  className={`w-full btn-primary py-3 ${
                    loadingPago ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loadingPago ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Realizar pedido'
                  )}
                </button>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Tu información de pago está protegida con encriptación SSL de 256 bits.
                </p>
              </div>
            </form>
          </div>
          
          {/* Resumen del pedido (vista móvil) */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:h-min">
            <h2 className="text-lg font-semibold mb-4">Información adicional</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Restaurante</h3>
                <p className="text-gray-900">{restaurante.nombre}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de entrega</h3>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-900">Recoger en restaurante</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Recibirás notificaciones cuando tu pedido esté listo y el restaurante podrá ver tu ubicación cuando te acerques.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tiempo estimado</h3>
                <p className="text-gray-900">20-30 minutos</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tiempo estimado para recoger tu pedido una vez confirmado.
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen</h3>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between mt-2 font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
