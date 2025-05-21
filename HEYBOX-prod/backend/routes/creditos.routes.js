const express = require('express');
const { check } = require('express-validator');
const creditosController = require('../controllers/creditos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/creditos/saldo
 * @desc    Obtener saldo de créditos del usuario
 * @access  Privado
 */
router.get('/saldo', verificarToken, creditosController.obtenerSaldo);

/**
 * @route   GET /api/creditos/transacciones
 * @desc    Obtener historial de transacciones del usuario
 * @access  Privado
 */
router.get('/transacciones', verificarToken, creditosController.obtenerTransacciones);

/**
 * @route   GET /api/creditos/planes
 * @desc    Obtener planes de créditos disponibles
 * @access  Público
 */
router.get('/planes', creditosController.obtenerPlanes);

/**
 * @route   GET /api/creditos/estadisticas
 * @desc    Obtener estadísticas de uso de créditos
 * @access  Privado
 */
router.get('/estadisticas', verificarToken, creditosController.obtenerEstadisticas);

/**
 * @route   POST /api/creditos/comprar
 * @desc    Comprar créditos según un plan
 * @access  Privado
 */
router.post(
  '/comprar',
  [
    verificarToken,
    check('planId', 'El ID del plan es obligatorio').not().isEmpty(),
    check('metodoPago', 'El método de pago es obligatorio').not().isEmpty()
  ],
  creditosController.comprarCreditos
);

/**
 * @route   POST /api/creditos/utilizar
 * @desc    Utilizar créditos (para hacer un pedido)
 * @access  Privado
 */
router.post(
  '/utilizar',
  [
    verificarToken,
    check('monto', 'El monto a utilizar es obligatorio').isNumeric(),
    check('concepto', 'El concepto es obligatorio').not().isEmpty()
  ],
  creditosController.utilizarCreditos
);

/**
 * @route   GET /api/creditos/admin/todas-transacciones
 * @desc    Obtener todas las transacciones (solo admin)
 * @access  Privado - Admin
 */
router.get('/admin/todas-transacciones', verificarToken, creditosController.todasTransacciones);

module.exports = router;
