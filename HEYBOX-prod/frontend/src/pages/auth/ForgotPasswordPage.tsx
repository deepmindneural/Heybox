import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    try {
      setLoading(true);
      // Aquí iría la llamada a la API para solicitar reseteo de contraseña
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al solicitar el restablecimiento de la contraseña');
      console.error('Error al solicitar restablecimiento:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
        Recuperar Contraseña
      </h2>
      
      {success ? (
        <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-md mb-6">
          <h3 className="text-lg font-medium">Solicitud enviada</h3>
          <p className="mt-2">
            Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.
            Por favor, revisa tu bandeja de entrada.
          </p>
          <Link 
            to="/login"
            className="mt-4 inline-block text-primary hover:text-primary-dark font-medium"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <p className="mb-6 text-sm text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </div>
          </form>
        </>
      )}
      
      <div className="mt-6">
        <div className="text-center text-sm">
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
