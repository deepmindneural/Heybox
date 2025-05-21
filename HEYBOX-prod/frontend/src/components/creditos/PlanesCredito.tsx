import React, { useState } from 'react';
import { useCreditos } from '../../context/CreditosContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planNombre: string;
  planCreditos: number;
  planPrecio: number;
}

const ModalCompra: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  planId, 
  planNombre, 
  planCreditos, 
  planPrecio 
}) => {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [procesando, setProcesando] = useState(false);
  const { comprarCreditos } = useCreditos();

  if (!isOpen) return null;

  const handleCompra = async () => {
    setProcesando(true);
    try {
      const resultado = await comprarCreditos(planId, metodoPago);
      if (resultado) {
        // Mostrar mensaje de éxito
        alert('¡Compra realizada con éxito!');
        onClose();
      }
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Hubo un error al procesar la compra. Inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Comprar Plan de Créditos</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border border-cyan-100 bg-cyan-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-cyan-800">{planNombre}</h4>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-bold text-cyan-600">{planCreditos} créditos</span>
            <span className="text-lg font-medium">${planPrecio.toLocaleString('es-CO')}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de pago
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-cyan-600"
                checked={metodoPago === 'tarjeta'}
                onChange={() => setMetodoPago('tarjeta')}
              />
              <span className="text-gray-900">Tarjeta de Crédito/Débito</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-cyan-600"
                checked={metodoPago === 'pse'}
                onChange={() => setMetodoPago('pse')}
              />
              <span className="text-gray-900">PSE - Transferencia Bancaria</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-cyan-600"
                checked={metodoPago === 'efectivo'}
                onChange={() => setMetodoPago('efectivo')}
              />
              <span className="text-gray-900">Efectivo (Baloto, Efecty)</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${planPrecio.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between font-medium text-lg mb-4">
            <span className="text-gray-900">Total a pagar:</span>
            <span className="text-cyan-700">${planPrecio.toLocaleString('es-CO')}</span>
          </div>

          <button
            onClick={handleCompra}
            disabled={procesando}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              procesando 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {procesando ? 'Procesando...' : 'Confirmar Compra'}
          </button>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Al confirmar aceptas los términos y condiciones de HEYBOX
          </p>
        </div>
      </div>
    </div>
  );
};

const PlanesCredito: React.FC = () => {
  const { planes, cargando, error, cargarPlanes } = useCreditos();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<any>(null);

  if (cargando) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Créditos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Créditos</h3>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error al cargar los planes: {error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => cargarPlanes()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const abrirModal = (plan: any) => {
    setPlanSeleccionado(plan);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPlanSeleccionado(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Planes de Créditos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planes.map((plan) => (
          <div 
            key={plan.id} 
            className={`border rounded-lg p-5 transition-all ${
              plan.popular 
                ? 'border-cyan-400 bg-cyan-50 shadow-md transform hover:scale-105' 
                : 'border-gray-200 hover:border-cyan-300 hover:shadow'
            }`}
          >
            {plan.popular && (
              <div className="bg-cyan-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full absolute -mt-8 ml-2">
                Popular
              </div>
            )}
            <h4 className="font-medium text-lg text-gray-900 mb-1">{plan.nombre}</h4>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-cyan-700">{plan.creditos}</span>
              <span className="ml-1 text-gray-500">créditos</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{plan.descripcion}</p>
            <div className="mt-3 mb-4">
              <span className="text-xl font-bold">${plan.precio.toLocaleString('es-CO')}</span>
            </div>
            <button 
              onClick={() => abrirModal(plan)}
              className={`w-full py-2 rounded-md text-center font-medium ${
                plan.popular 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'border border-cyan-600 text-cyan-700 hover:bg-cyan-50'
              }`}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Si no hay planes, mostrar mensaje */}
      {planes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No hay planes disponibles en este momento. Por favor, inténtalo más tarde.
          </p>
        </div>
      )}

      {/* Modal de compra */}
      {modalAbierto && planSeleccionado && (
        <ModalCompra 
          isOpen={modalAbierto}
          onClose={cerrarModal}
          planId={planSeleccionado.id}
          planNombre={planSeleccionado.nombre}
          planCreditos={planSeleccionado.creditos}
          planPrecio={planSeleccionado.precio}
        />
      )}
    </div>
  );
};

export default PlanesCredito;
