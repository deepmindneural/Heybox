const express = require('express');
const { check } = require('express-validator');
const menuController = require('../controllers/menu.controller');
const { verificarToken, esRestaurante } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/menu/:restauranteId
 * @desc    Obtener todos los productos de un restaurante
 * @access  Público
 */
router.get('/:restauranteId', menuController.obtenerProductosRestaurante);

/**
 * @route   GET /api/menu/producto/:id
 * @desc    Obtener un producto por ID
 * @access  Público
 */
router.get('/producto/:id', menuController.obtenerProductoPorId);

/**
 * @route   POST /api/menu/producto
 * @desc    Crear un nuevo producto
 * @access  Privado (Restaurante)
 */
router.post(
  '/producto',
  [
    verificarToken,
    esRestaurante,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('precio', 'El precio debe ser un número positivo').isFloat({ min: 0 }),
    check('categoria', 'La categoría es obligatoria').not().isEmpty()
  ],
  menuController.crearProducto
);

/**
 * @route   PUT /api/menu/producto/:id
 * @desc    Actualizar un producto
 * @access  Privado (Restaurante)
 */
router.put(
  '/producto/:id',
  [
    verificarToken,
    esRestaurante
  ],
  menuController.actualizarProducto
);

/**
 * @route   DELETE /api/menu/producto/:id
 * @desc    Eliminar un producto
 * @access  Privado (Restaurante)
 */
router.delete(
  '/producto/:id',
  [verificarToken, esRestaurante],
  menuController.eliminarProducto
);

/**
 * @route   GET /api/menu/destacados/:restauranteId
 * @desc    Obtener productos destacados
 * @access  Público
 */
router.get('/destacados/:restauranteId', menuController.obtenerProductosDestacados);

module.exports = router;
