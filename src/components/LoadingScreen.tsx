import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold">H</div>
        </div>
        <h2 className="text-3xl font-bold tracking-wider">HEYBOX</h2>
        <p className="mt-3 text-white/80 text-lg">Cargando experiencia gastronómica...</p>
        
        <div className="mt-8 w-48 h-2 bg-white/20 rounded-full mx-auto overflow-hidden relative">
          <div className="h-full bg-white rounded-full animate-loadingBar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
