import { io, Socket } from 'socket.io-client';

// Configuración de Socket.io
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

// Crear instancia del socket
let socket: Socket;

// Función para inicializar el socket
export const initSocket = (token?: string): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
    auth: token ? { token } : undefined,
  });

  // Manejar eventos de conexión
  socket.on('connect', () => {
    console.log('Socket conectado');
  });

  socket.on('connect_error', (error) => {
    console.error('Error de conexión del socket:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket desconectado:', reason);
  });

  // Conectar el socket
  socket.connect();

  return socket;
};

// Función para desconectar el socket
export const disconnectSocket = (): void => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log('Socket desconectado intencionalmente');
  }
};

// Función para actualizar el token de autenticación
export const updateSocketAuth = (token: string): void => {
  if (socket) {
    socket.auth = { token };
    // Si el socket ya está conectado, desconectar y reconectar para aplicar el nuevo token
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }
};

// Función para unirse a una sala (ej. sala de un pedido específico)
export const joinRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('join_room', room);
  }
};

// Función para abandonar una sala
export const leaveRoom = (room: string): void => {
  if (socket && socket.connected) {
    socket.emit('leave_room', room);
  }
};

// Exportar la instancia del socket
export { socket };
