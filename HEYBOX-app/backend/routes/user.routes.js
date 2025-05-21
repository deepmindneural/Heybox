const express = require('express');
const { check } = require('express-validator');
const { verificarToken, esAdmin } = require('../middlewares/auth.middleware');
const Usuario = require('../models/Usuario');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Privado
 */
router.get('/', [verificarToken, esAdmin], async (req, res) => {
  try {
    const usuarios = await Usuario.find({}).select('-password');
    res.json({ exito: true, usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Privado
 */
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Solo el propio usuario o un admin puede ver los detalles del usuario
    if (req.usuario.rol !== 'admin' && req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para ver este usuario'
      });
    }
    
    res.json({ exito: true, usuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Privado
 */
router.put('/:id', verificarToken, async (req, res) => {
  try {
    // Solo el propio usuario o un admin puede actualizar un usuario
    if (req.usuario.rol !== 'admin' && req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para actualizar este usuario'
      });
    }
    
    const { nombre, telefono, direccion } = req.body;
    const datosActualizacion = { nombre, telefono, direccion };
    
    // Solo el admin puede cambiar el rol
    if (req.usuario.rol === 'admin' && req.body.rol) {
      datosActualizacion.rol = req.body.rol;
    }
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { $set: datosActualizacion },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    res.json({ exito: true, usuario });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario
 * @access  Privado (Admin)
 */
router.delete('/:id', [verificarToken, esAdmin], async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // En lugar de eliminar, marcar como inactivo
    usuario.activo = false;
    await usuario.save();
    
    res.json({
      exito: true,
      mensaje: 'Usuario desactivado correctamente'
    });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/:id/metodo-pago
 * @desc    Agregar/actualizar método de pago
 * @access  Privado
 */
router.put('/:id/metodo-pago', [
  verificarToken,
  check('tipo', 'El tipo de pago es obligatorio').not().isEmpty(),
  check('detalles', 'Los detalles del pago son obligatorios').not().isEmpty()
], async (req, res) => {
  try {
    // Solo el propio usuario puede actualizar sus métodos de pago
    if (req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para actualizar los métodos de pago de este usuario'
      });
    }
    
    const { tipo, detalles } = req.body;
    
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Verificar si ya existe un método de pago con este ID
    if (req.body.id) {
      const metodoIndex = usuario.metodosPago.findIndex(m => m._id.toString() === req.body.id);
      
      if (metodoIndex >= 0) {
        // Actualizar método existente
        usuario.metodosPago[metodoIndex] = {
          _id: req.body.id,
          tipo,
          detalles
        };
      } else {
        return res.status(404).json({
          exito: false,
          mensaje: 'Método de pago no encontrado'
        });
      }
    } else {
      // Agregar nuevo método
      usuario.metodosPago.push({
        tipo,
        detalles
      });
    }
    
    await usuario.save();
    
    res.json({
      exito: true,
      metodosPago: usuario.metodosPago,
      mensaje: req.body.id ? 'Método de pago actualizado' : 'Método de pago agregado'
    });
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/:id/metodo-pago/:metodoId
 * @desc    Eliminar método de pago
 * @access  Privado
 */
router.delete('/:id/metodo-pago/:metodoId', verificarToken, async (req, res) => {
  try {
    // Solo el propio usuario puede eliminar sus métodos de pago
    if (req.usuario._id.toString() !== req.params.id) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para eliminar los métodos de pago de este usuario'
      });
    }
    
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Filtrar el método de pago a eliminar
    usuario.metodosPago = usuario.metodosPago.filter(
      metodo => metodo._id.toString() !== req.params.metodoId
    );
    
    await usuario.save();
    
    res.json({
      exito: true,
      metodosPago: usuario.metodosPago,
      mensaje: 'Método de pago eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
});

module.exports = router;
