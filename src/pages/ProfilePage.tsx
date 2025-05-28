import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Usuario } from '../types';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiAlertCircle } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const { usuario, actualizarPerfil, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Datos del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calle, setCalle] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  
  // Cargar datos del usuario
  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setEmail(usuario.email || '');
      setTelefono(usuario.telefono || '');
      
      // Acceder a la direcciu00f3n de forma segura ya que es opcional
      if (usuario.direccion) {
        setCalle(usuario.direccion.calle || '');
        setCiudad(usuario.direccion.ciudad || '');
        setCodigoPostal(usuario.direccion.codigoPostal || '');
      }
    } else {
      navigate('/login');
    }
  }, [usuario, navigate]);
  
  // Limpiar mensajes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setFormError(null);
      if (error) clearError();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [successMessage, formError, error, clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    
    try {
      const datosActualizacion = {
        nombre,
        telefono,
        direccion: {
          calle,
          ciudad,
          codigoPostal
        }
      };
      
      await actualizarPerfil(datosActualizacion);
      setSuccessMessage('Perfil actualizado correctamente');
      setEditMode(false);
    } catch (err: any) {
      setFormError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };
  
  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-400 p-4">
          <h1 className="text-white text-xl font-bold flex items-center">
            <FiUser className="mr-2" /> Perfil de Usuario
          </h1>
        </div>
        
        {(formError || error) && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end mb-4">
              {!editMode ? (
                <button 
                  type="button" 
                  onClick={() => setEditMode(true)}
                  className="text-cyan-600 hover:text-cyan-800 flex items-center text-sm"
                >
                  <FiEdit2 className="mr-1" /> Editar Perfil
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                >
                  Cancelar
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Información personal */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-700 mb-4">Información Personal</h2>
                
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUser className="mr-1 text-cyan-500" /> Nombre
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{nombre}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiMail className="mr-1 text-cyan-500" /> Email
                  </label>
                  <p className="text-gray-900">{email}</p>
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiPhone className="mr-1 text-cyan-500" /> Teléfono
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900">{telefono}</p>
                  )}
                </div>
              </div>
              
              {/* Dirección */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <FiMapPin className="mr-1 text-cyan-500" /> Dirección
                </h2>
                
                <div className="mb-4">
                  <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                    Calle y número
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      id="calle"
                      value={calle}
                      onChange={(e) => setCalle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  ) : (
                    <p className="text-gray-900">{calle || 'No especificado'}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        id="ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{ciudad || 'No especificado'}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                      Código Postal
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        id="codigoPostal"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    ) : (
                      <p className="text-gray-900">{codigoPostal || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {editMode && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" /> Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
