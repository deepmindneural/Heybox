const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Middleware para verificar token de autenticación
 */
exports.verificarToken = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario y asignarlo a req.usuario
      req.usuario = await Usuario.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Error al verificar token:', error);
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Token no válido o expirado' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      exito: false, 
      mensaje: 'No autorizado, no se proporcionó token' 
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 */
exports.esAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      exito: false, 
      mensaje: 'Acceso denegado. Se requiere rol de administrador' 
    });
  }
};

/**
 * Middleware para verificar rol de restaurante
 */
exports.esRestaurante = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'restaurante') {
    next();
  } else {
    return res.status(403).json({ 
      exito: false, 
      mensaje: 'Acceso denegado. Se requiere rol de restaurante' 
    });
  }
};

/**
 * Middleware para verificar rol de cliente
 */
exports.esCliente = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'cliente') {
    next();
  } else {
    return res.status(403).json({ 
      exito: false, 
      mensaje: 'Acceso denegado. Se requiere rol de cliente' 
    });
  }
};
