import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/api';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, setUsuario } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direcciones: [{ calle: '', ciudad: '', codigoPostal: '', referencia: '', predeterminada: true }],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [authLoading, isAuthenticated, navigate]);
  
  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userData = await getProfile();
        
        setFormData({
          ...formData,
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          email: userData.email || '',
          telefono: userData.telefono || '',
          direcciones: userData.direcciones?.length 
            ? userData.direcciones 
            : [{ calle: '', ciudad: '', codigoPostal: '', referencia: '', predeterminada: true }]
        });
      } catch (err: any) {
        setError(err.response?.data?.mensaje || 'Error al cargar el perfil');
        console.error('Error al cargar el perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [isAuthenticated]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { name, value } = e.target;
    
    setFormData(prevState => {
      const updatedDirecciones = [...prevState.direcciones];
      updatedDirecciones[index] = {
        ...updatedDirecciones[index],
        [name]: value
      };
      
      return {
        ...prevState,
        direcciones: updatedDirecciones
      };
    });
  };
  
  const handleAddAddress = () => {
    setFormData(prevState => ({
      ...prevState,
      direcciones: [
        ...prevState.direcciones,
        { calle: '', ciudad: '', codigoPostal: '', referencia: '', predeterminada: false }
      ]
    }));
  };
  
  const handleRemoveAddress = (index: number) => {
    if (formData.direcciones.length <= 1) return;
    
    setFormData(prevState => {
      const updatedDirecciones = prevState.direcciones.filter((_, i) => i !== index);
      
      // Si eliminamos la dirección predeterminada, establecer la primera como predeterminada
      if (prevState.direcciones[index].predeterminada && updatedDirecciones.length > 0) {
        updatedDirecciones[0].predeterminada = true;
      }
      
      return {
        ...prevState,
        direcciones: updatedDirecciones
      };
    });
  };
  
  const handleSetDefaultAddress = (index: number) => {
    setFormData(prevState => {
      const updatedDirecciones = prevState.direcciones.map((dir, i) => ({
        ...dir,
        predeterminada: i === index
      }));
      
      return {
        ...prevState,
        direcciones: updatedDirecciones
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Validar campos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }
    
    // Validar cambio de contraseña
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Debes ingresar tu contraseña actual para cambiar la contraseña');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las nuevas contraseñas no coinciden');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
    }
    
    // Validar direcciones
    const emptyAddressFields = formData.direcciones.some(dir => 
      !dir.calle || !dir.ciudad || !dir.codigoPostal
    );
    
    if (emptyAddressFields) {
      setError('Por favor, completa todos los campos de las direcciones');
      return;
    }
    
    try {
      setSaving(true);
      
      // Preparar datos para actualizar
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direcciones: formData.direcciones,
        // Solo incluir contraseñas si se están cambiando
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      };
      
      const updatedUser = await updateProfile(userData);
      setUsuario(updatedUser);
      setSuccess(true);
      
      // Limpiar campos de contraseña
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Mostrar mensaje de éxito durante 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al actualizar el perfil');
      console.error('Error al actualizar el perfil:', err);
    } finally {
      setSaving(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">
            Administra tu información personal y preferencias
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-md">
            ¡Perfil actualizado con éxito!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Información Personal */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h2>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  El correo electrónico no se puede cambiar
                </p>
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Direcciones */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Mis Direcciones</h2>
              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Dirección
              </button>
            </div>
            
            {formData.direcciones.map((direccion, index) => (
              <div key={index} className="mb-6 border border-gray-200 rounded-md p-4 relative">
                {formData.direcciones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={`calle-${index}`} className="block text-sm font-medium text-gray-700">
                      Calle y número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`calle-${index}`}
                      name="calle"
                      value={direccion.calle}
                      onChange={(e) => handleAddressChange(e, index)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`ciudad-${index}`} className="block text-sm font-medium text-gray-700">
                      Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`ciudad-${index}`}
                      name="ciudad"
                      value={direccion.ciudad}
                      onChange={(e) => handleAddressChange(e, index)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`codigoPostal-${index}`} className="block text-sm font-medium text-gray-700">
                      Código Postal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`codigoPostal-${index}`}
                      name="codigoPostal"
                      value={direccion.codigoPostal}
                      onChange={(e) => handleAddressChange(e, index)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor={`referencia-${index}`} className="block text-sm font-medium text-gray-700">
                      Referencias
                    </label>
                    <textarea
                      id={`referencia-${index}`}
                      name="referencia"
                      value={direccion.referencia}
                      onChange={(e) => handleAddressChange(e, index)}
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        id={`predeterminada-${index}`}
                        name="predeterminada"
                        type="radio"
                        checked={direccion.predeterminada}
                        onChange={() => handleSetDefaultAddress(index)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor={`predeterminada-${index}`} className="ml-2 block text-sm text-gray-700">
                        Establecer como dirección predeterminada
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Cambiar Contraseña */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h2>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="p-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 mr-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
