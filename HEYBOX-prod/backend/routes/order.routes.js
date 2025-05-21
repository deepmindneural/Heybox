const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { verificarToken, esRestaurante, esCliente } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Crear nuevo pedido
 * @access  Privado (Cliente)
 */
router.post(
  '/',
  [
    verificarToken,
    esCliente,
    check('restauranteId', 'ID de restaurante es obligatorio').not().isEmpty(),
    check('productos', 'Productos es obligatorio').isArray({ min: 1 }),
    check('productos.*.productoId', 'ID de producto es obligatorio').not().isEmpty(),
    check('productos.*.cantidad', 'Cantidad debe ser un número positivo').isInt({ min: 1 }),
    check('metodoPago', 'Método de pago es obligatorio').not().isEmpty(),
    check('metodoPago.tipo', 'Tipo de pago es obligatorio').not().isEmpty()
  ],
  orderController.crearPedido
);

/**
 * @route   GET /api/orders
 * @desc    Obtener todos los pedidos del usuario actual
 * @access  Privado (Cliente)
 */
router.get('/', [verificarToken, esCliente], orderController.obtenerPedidosUsuario);

/**
 * @route   GET /api/orders/:id
 * @desc    Obtener pedido por ID
 * @access  Privado (Cliente/Restaurante)
 */
router.get('/:id', verificarToken, orderController.obtenerPedidoPorId);

/**
 * @route   PUT /api/orders/:id/estado
 * @desc    Actualizar estado de pedido
 * @access  Privado (Restaurante/Cliente para cancelar)
 */
router.put(
  '/:id/estado',
  [
    verificarToken,
    check('estado', 'Estado es obligatorio').not().isEmpty()
  ],
  orderController.actualizarEstadoPedido
);

/**
 * @route   POST /api/orders/:id/calificar
 * @desc    Calificar pedido
 * @access  Privado (Cliente)
 */
router.post(
  '/:id/calificar',
  [
    verificarToken,
    esCliente,
    check('puntuacion', 'Puntuación debe ser entre 1 y 5').isInt({ min: 1, max: 5 })
  ],
  orderController.calificarPedido
);

/**
 * @route   GET /api/orders/restaurante
 * @desc    Obtener pedidos para restaurante
 * @access  Privado (Restaurante)
 */
router.get(
  '/restaurante',
  [verificarToken, esRestaurante],
  orderController.obtenerPedidosRestaurante
);

module.exports = router;
