# HEYBOX - Sistema de Pedido y Retiro para Restaurantes

Esta es la versión de producción de HEYBOX, un sistema completo para gestionar pedidos de comida y la relación entre restaurantes y clientes.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Backend**: API RESTful con Express.js y MongoDB, con soporte para comunicación en tiempo real a través de Socket.io.
- **Frontend**: Aplicación React con Vite, TailwindCSS y estado global gestionado a través de Context API.

## Requisitos Previos

- Node.js >= 18.0.0
- MongoDB (para producción)
- PM2 (recomendado para producción)

## Configuración del Proyecto

### Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Renombra `.env.example` a `.env` y ajusta los valores según tu entorno
   - Asegúrate de configurar una cadena de conexión MongoDB válida
   - Establece una clave secreta segura para JWT

### Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Las variables de entorno ya están configuradas para desarrollo y producción
   - Ajusta `.env.production` con la URL correcta de tu API y otras configuraciones
   - Reemplaza `YOUR_GOOGLE_MAPS_API_KEY` con tu clave de API de Google Maps

## Ejecución en Desarrollo

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run dev
```

## Compilación para Producción

### Frontend
```bash
cd frontend
npm run build:prod
```

### Implementación Completa

Para implementar el proyecto completo en producción:

1. Configura y inicia MongoDB:
   ```bash
   # Asegúrate de que MongoDB esté en ejecución
   mongod --dbpath /ruta/a/datos
   ```

2. Inicia el backend con PM2:
   ```bash
   cd backend
   npm install -g pm2
   pm2 start server.js --name heybox-api
   ```

3. Implementa los archivos estáticos del frontend:
   - Los archivos compilados se encuentran en `frontend/build`
   - Puedes servirlos con Nginx, Apache o cualquier otro servidor web
   - Alternativamente, el propio backend puede servir estos archivos

## Características

- Sistema completo de autenticación y registro
- Gestión de menús de restaurantes
- Sistema de carrito de compras
- Seguimiento de pedidos en tiempo real
- Gestión de ubicación y entrega
- Interfaz responsive para móvil y escritorio
- Diseño moderno con TailwindCSS

## Seguridad

- Hashing de contraseñas con bcrypt
- Protección contra ataques comunes (XSS, CSRF, inyección NoSQL)
- Rate limiting para prevenir ataques de fuerza bruta
- Validación de datos de entrada
- Sanitización de respuestas

## Licencia

Este proyecto es propiedad de HEYBOX. Todos los derechos reservados.

---

© 2025 HEYBOX. Versión 1.0.0
