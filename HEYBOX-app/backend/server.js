const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const morgan = require('morgan');

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

// Inicializar Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:19006'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

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

// Ruta principal
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de HEYBOX - Sistema de Pedido y Retiro para Restaurante' });
});

// Gestión de Socket.io para tiempo real
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);
  
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
    console.log('Cliente desconectado:', socket.id);
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
