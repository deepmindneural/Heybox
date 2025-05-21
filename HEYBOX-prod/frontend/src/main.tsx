import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'
import { CreditosProvider } from './context/CreditosContext'
import './index.css'

// Configuración de errores para producción
if (import.meta.env.PROD) {
  // Desactivar console.log en producción para mejor rendimiento
  console.log = () => {}
  
  // Manejador global de errores no capturados
  window.addEventListener('error', (event) => {
    // En producción podríamos enviar estos errores a un servicio de monitoreo
    event.preventDefault()
  })
}

// Elemento raíz donde se montará la aplicación
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el elemento root en el DOM.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            <CreditosProvider>
              <App />
            </CreditosProvider>
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
