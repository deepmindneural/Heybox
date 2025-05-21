import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md mx-auto text-center px-4 py-10">
        <div className="mb-6">
          <svg className="h-16 w-16 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Regresar a inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
