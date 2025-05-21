import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white text-center">
          <h1 className="text-3xl font-bold">HEYBOX</h1>
          <p className="mt-2">Sistema de Restaurantes</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8 text-center">
            <div className="text-xl font-bold text-gray-800 mb-2">Estado del Servidor</div>
            <div className="text-primary font-medium">¡Estamos en línea!</div>
            <div className="mt-2 text-sm text-gray-600">
              Servidores activos: 
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded ml-1">
                Frontend (5173)
              </span> 
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded ml-1">
                Backend (5001)
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">Restaurantes Populares</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(id => (
                <div key={id} className="border border-gray-200 rounded p-3 flex flex-col items-center">
                  <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Restaurante {id}</span>
                  </div>
                  <span className="font-medium text-gray-800">La Trattoria {id}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-primary-dark font-medium">Aplicación en desarrollo</p>
            <p className="text-sm text-gray-600 mt-1">Versión 0.1.0</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        &copy; 2025 HEYBOX Restaurant App
      </div>
    </div>
  );
}

export default App;
