const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

// Rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const locationRoutes = require('./routes/location.routes');

// Middleware de autenticación
const { verificarToken } = require('./middlewares/auth.middleware');

// Configuración de variables de entorno
dotenv.config();

// Determinar entorno
const isProduction = process.env.NODE_ENV === 'production';

// Inicializar Express
const app = express();
const server = http.createServer(app);

// Configuración de cors para producción
const corsOptions = {
  origin: isProduction 
    ? [process.env.CORS_ORIGIN || 'https://heybox.domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:19006'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Configuración de Socket.io
const io = socketIo(server, {
  cors: corsOptions
});

// Limitar peticiones para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  max: 200, // máximo 200 peticiones
  windowMs: 60 * 60 * 1000, // 1 hora
  message: 'Demasiadas peticiones desde esta IP, intente nuevamente en una hora'
});

// Middlewares de seguridad y optimización
app.use('/api/', limiter);
app.use(cors(corsOptions));
app.use(helmet()); // Protege contra vulnerabilidades conocidas con headers HTTP
app.use(compression()); // Comprimir respuestas
app.use(morgan(isProduction ? 'combined' : 'dev')); // Logging adecuado según entorno
app.use(express.json({ limit: '10kb' })); // Limitar tamaño payload JSON
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize()); // Prevenir NoSQL injection
app.use(xss()); // Limpiar input de usuario contra XSS
app.use(hpp()); // Prevenir parameter pollution

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heybox')
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', verificarToken, userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', verificarToken, orderRoutes);
app.use('/api/location', verificarToken, locationRoutes);

// Rutas API con versionado
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', verificarToken, userRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/orders', verificarToken, orderRoutes);
app.use('/api/v1/location', verificarToken, locationRoutes);

// Mantener rutas sin versionar por compatibilidad
app.use('/api/auth', authRoutes);
app.use('/api/users', verificarToken, userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', verificarToken, orderRoutes);
app.use('/api/location', verificarToken, locationRoutes);

// Ruta principal para la API
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: 'API de HEYBOX - Sistema de Pedido y Retiro para Restaurante',
    version: '1.0.0',
    endpoints: [
      '/api/auth', 
      '/api/users', 
      '/api/menu', 
      '/api/orders', 
      '/api/location'
    ]
  });
});

// Servir aplicación frontend en producción
if (isProduction) {
  // Servir archivos estáticos desde la carpeta 'frontend/build'
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Para cualquier otra ruta, servir index.html (para routing de React)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    exito: false,
    error: {
      mensaje: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Gestión de Socket.io para tiempo real
io.on('connection', (socket) => {
  // Log solo en desarrollo
  if (!isProduction) {
    console.log('Nuevo cliente conectado:', socket.id);
  }
  
  // Escuchar actualización de ubicaciones
  socket.on('updateLocation', (data) => {
    // Transmitir ubicación a todos los restaurantes
    io.emit('clientLocation', data);
  });
  
  // Escuchar nuevos pedidos
  socket.on('newOrder', (orderData) => {
    // Enviar notificación de nuevo pedido al restaurante
    io.emit('orderNotification', orderData);
  });
  
  // Escuchar actualizaciones de estado de pedidos
  socket.on('updateOrderStatus', (orderUpdate) => {
    // Notificar al cliente específico sobre la actualización
    io.emit('orderStatusUpdate', orderUpdate);
  });
  
  // Desconexión
  socket.on('disconnect', () => {
    if (!isProduction) {
      console.log('Cliente desconectado:', socket.id);
    }
  });
});

// Gestión de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('ERROR NO CAPTURADO! 💥 Cerrando aplicación...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('PROMESA RECHAZADA NO MANEJADA! 💥 Cerrando aplicación...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Puerto
const PORT = process.env.PORT || 5001;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en modo ${process.env.NODE_ENV || 'desarrollo'} en el puerto ${PORT}`);
});
