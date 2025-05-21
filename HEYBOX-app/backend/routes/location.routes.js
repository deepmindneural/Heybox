const express = require('express');
const { check } = require('express-validator');
const locationController = require('../controllers/location.controller');
const { verificarToken, esRestaurante, esCliente } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/location/update
 * @desc    Actualizar ubicación del usuario
 * @access  Privado (Cliente)
 */
router.post(
  '/update',
  [
    verificarToken,
    esCliente,
    check('pedidoId', 'ID de pedido es obligatorio').not().isEmpty(),
    check('lat', 'Latitud es obligatoria').isFloat(),
    check('lng', 'Longitud es obligatoria').isFloat()
  ],
  locationController.actualizarUbicacion
);

/**
 * @route   GET /api/location/:pedidoId
 * @desc    Obtener ubicaciones recientes para un pedido
 * @access  Privado (Restaurante/Admin/Cliente propietario)
 */
router.get('/:pedidoId', verificarToken, locationController.obtenerUbicacionesPedido);

/**
 * @route   GET /api/location/restaurante/activos
 * @desc    Obtener pedidos activos con ubicación para un restaurante
 * @access  Privado (Restaurante)
 */
router.get(
  '/restaurante/activos',
  [verificarToken, esRestaurante],
  locationController.obtenerPedidosActivosConUbicacion
);

module.exports = router;
