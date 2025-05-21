const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
router.post(
  '/registro',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('telefono', 'El teléfono es obligatorio').not().isEmpty()
  ],
  authController.registro
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Público
 */
router.post(
  '/login',
  [
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists()
  ],
  authController.login
);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener perfil del usuario
 * @access  Privado
 */
router.get('/perfil', verificarToken, authController.obtenerPerfil);

/**
 * @route   PUT /api/auth/perfil
 * @desc    Actualizar perfil de usuario
 * @access  Privado
 */
router.put('/perfil', verificarToken, authController.actualizarPerfil);

module.exports = router;
