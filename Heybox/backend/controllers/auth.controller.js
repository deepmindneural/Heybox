const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { validationResult } = require('express-validator');

/**
 * Generar token JWT
 */
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/registro
 * @access  Público
 */
exports.registro = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }

  const { nombre, email, password, telefono, direccion, rol } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      direccion,
      rol: rol || 'cliente' // Por defecto es cliente
    });

    if (usuario) {
      res.status(201).json({
        exito: true,
        usuario: {
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          rol: usuario.rol
        },
        token: generarToken(usuario._id)
      });
    }
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Iniciar sesión de usuario
 * @route   POST /api/auth/login
 * @access  Público
 */
exports.login = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }

  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    res.json({
      exito: true,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol
      },
      token: generarToken(usuario._id)
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener perfil del usuario
 * @route   GET /api/auth/perfil
 * @access  Privado
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        metodosPago: usuario.metodosPago,
        fechaRegistro: usuario.fechaRegistro
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar perfil de usuario
 * @route   PUT /api/auth/perfil
 * @access  Privado
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre, telefono, direccion },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      usuario: {
        _id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        telefono: usuarioActualizado.telefono,
        direccion: usuarioActualizado.direccion,
        rol: usuarioActualizado.rol
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};
