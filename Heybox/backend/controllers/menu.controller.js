const Producto = require('../models/Producto');
const Restaurante = require('../models/Restaurante');
const { validationResult } = require('express-validator');

/**
 * @desc    Obtener todos los productos de un restaurante
 * @route   GET /api/menu/:restauranteId
 * @access  Público
 */
exports.obtenerProductosRestaurante = async (req, res) => {
  try {
    // Verificar si el restaurante existe
    const restaurante = await Restaurante.findById(req.params.restauranteId);
    
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Restaurante no encontrado'
      });
    }
    
    // Obtener productos por categoría
    const productos = await Producto.find({ 
      restaurante: req.params.restauranteId,
      disponible: true
    }).sort({ categoria: 1, nombre: 1 });
    
    // Agrupar productos por categoría
    const productosPorCategoria = {};
    
    productos.forEach(producto => {
      if (!productosPorCategoria[producto.categoria]) {
        productosPorCategoria[producto.categoria] = [];
      }
      productosPorCategoria[producto.categoria].push(producto);
    });
    
    res.json({
      exito: true,
      restaurante: {
        _id: restaurante._id,
        nombre: restaurante.nombre,
        descripcion: restaurante.descripcion,
        direccion: restaurante.direccion,
        calificacion: restaurante.calificacion,
        categoria: restaurante.categoria,
        logo: restaurante.logo
      },
      productos: productosPorCategoria
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/menu/producto/:id
 * @access  Público
 */
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('restaurante', 'nombre direccion telefono');
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      exito: true,
      producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Crear un nuevo producto
 * @route   POST /api/menu/producto
 * @access  Privado (Restaurante)
 */
exports.crearProducto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }
  
  const { 
    nombre, 
    descripcion, 
    precio, 
    imagen, 
    categoria, 
    opciones, 
    tiempo_preparacion,
    destacado,
    calorias,
    alergenos
  } = req.body;
  
  try {
    // Obtener el restaurante asociado al usuario
    const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
    
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontró un restaurante asociado a este usuario'
      });
    }
    
    // Crear el producto
    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      opciones: opciones || [],
      tiempo_preparacion: tiempo_preparacion || 15,
      restaurante: restaurante._id,
      destacado: destacado || false,
      calorias,
      alergenos: alergenos || []
    });
    
    res.status(201).json({
      exito: true,
      producto,
      mensaje: 'Producto creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar un producto
 * @route   PUT /api/menu/producto/:id
 * @access  Privado (Restaurante)
 */
exports.actualizarProducto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }
  
  const { 
    nombre, 
    descripcion, 
    precio, 
    imagen, 
    categoria, 
    disponible,
    opciones, 
    tiempo_preparacion,
    destacado,
    calorias,
    alergenos
  } = req.body;
  
  try {
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    // Verificar que el producto pertenece al restaurante del usuario
    const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
    
    if (!restaurante || producto.restaurante.toString() !== restaurante._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para actualizar este producto'
      });
    }
    
    // Actualizar el producto
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre: nombre || producto.nombre,
        descripcion: descripcion || producto.descripcion,
        precio: precio || producto.precio,
        imagen: imagen || producto.imagen,
        categoria: categoria || producto.categoria,
        disponible: disponible !== undefined ? disponible : producto.disponible,
        opciones: opciones || producto.opciones,
        tiempo_preparacion: tiempo_preparacion || producto.tiempo_preparacion,
        destacado: destacado !== undefined ? destacado : producto.destacado,
        calorias: calorias || producto.calorias,
        alergenos: alergenos || producto.alergenos
      },
      { new: true, runValidators: true }
    );
    
    res.json({
      exito: true,
      producto: productoActualizado,
      mensaje: 'Producto actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Eliminar un producto
 * @route   DELETE /api/menu/producto/:id
 * @access  Privado (Restaurante)
 */
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    // Verificar que el producto pertenece al restaurante del usuario
    const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
    
    if (!restaurante || producto.restaurante.toString() !== restaurante._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para eliminar este producto'
      });
    }
    
    await Producto.findByIdAndDelete(req.params.id);
    
    res.json({
      exito: true,
      mensaje: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener productos destacados
 * @route   GET /api/menu/destacados/:restauranteId
 * @access  Público
 */
exports.obtenerProductosDestacados = async (req, res) => {
  try {
    // Verificar si el restaurante existe
    const restaurante = await Restaurante.findById(req.params.restauranteId);
    
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Restaurante no encontrado'
      });
    }
    
    // Obtener productos destacados
    const productosDestacados = await Producto.find({ 
      restaurante: req.params.restauranteId,
      disponible: true,
      destacado: true
    }).limit(5);
    
    res.json({
      exito: true,
      productosDestacados
    });
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};
