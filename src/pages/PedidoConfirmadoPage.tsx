import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiMapPin, FiUser, FiCreditCard, FiHome } from 'react-icons/fi';

const PedidoConfirmadoPage: React.FC = () => {
  const [pedidoId, setPedidoId] = useState<string>('');
  const [codigoRetiro, setCodigoRetiro] = useState<string>('');
  const [tiempoEstimado, setTiempoEstimado] = useState<number>(0);
  
  useEffect(() => {
    // Simular obtener los datos del pedido recién creado
    // En un caso real, estos datos vendrían de un contexto o localStorage
    const generarPedidoId = () => {
      const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numeros = '0123456789';
      let id = '';
      
      // Generar formato HBXXX-XXXXXX (HB + 3 letras + guión + 6 números)
      id += 'HB';
      for (let i = 0; i < 3; i++) {
        id += letras.charAt(Math.floor(Math.random() * letras.length));
      }
      id += '-';
      for (let i = 0; i < 6; i++) {
        id += numeros.charAt(Math.floor(Math.random() * numeros.length));
      }
      
      return id;
    };
    
    const generarCodigoRetiro = () => {
      // Generar código de 4 dígitos
      let codigo = '';
      for (let i = 0; i < 4; i++) {
        codigo += Math.floor(Math.random() * 10);
      }
      return codigo;
    };
    
    // Generar un tiempo estimado entre 15 y 30 minutos
    const generarTiempoEstimado = () => {
      return Math.floor(Math.random() * 16) + 15;
    };
    
    setPedidoId(generarPedidoId());
    setCodigoRetiro(generarCodigoRetiro());
    setTiempoEstimado(generarTiempoEstimado());
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Confirmación */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-teal-400 p-6 text-white text-center">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-cyan-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h1>
            <p>Tu pedido ha sido recibido y está siendo procesado.</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Número de Pedido</h2>
              <p className="text-2xl font-bold text-cyan-600">{pedidoId}</p>
              <p className="text-sm text-gray-500 mt-1">Guarda este número para seguimiento</p>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-cyan-700">
                  <FiClock className="mr-2" />
                  <span className="font-medium">Tiempo estimado:</span>
                </div>
                <span className="font-bold">{tiempoEstimado} minutos</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-cyan-700">
                  <FiUser className="mr-2" />
                  <span className="font-medium">Código de retiro:</span>
                </div>
                <span className="font-bold text-lg">{codigoRetiro}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Detalles</h3>
              
              <div className="space-y-3">
                <div className="flex">
                  <FiMapPin className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Restaurante</p>
                    <p className="text-sm text-gray-500">El Buen Sabor</p>
                    <p className="text-sm text-gray-500">Calle Principal 123, Ciudad Ejemplo</p>
                  </div>
                </div>
                
                <div className="flex">
                  <FiCreditCard className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Método de pago</p>
                    <p className="text-sm text-gray-500">Tarjeta terminada en **** 1234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/seguimiento" 
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-500 text-center flex items-center justify-center"
          >
            <FiClock className="mr-2" /> Seguir pedido
          </Link>
          
          <Link 
            to="/" 
            className="flex-1 py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-center flex items-center justify-center"
          >
            <FiHome className="mr-2" /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PedidoConfirmadoPage;
