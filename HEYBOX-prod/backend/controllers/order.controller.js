const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Restaurante = require('../models/Restaurante');
const { validationResult } = require('express-validator');

/**
 * @desc    Crear nuevo pedido
 * @route   POST /api/orders
 * @access  Privado
 */
exports.crearPedido = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }

  const { restauranteId, productos, metodoPago } = req.body;

  try {
    // Verificar si existe el restaurante
    const restaurante = await Restaurante.findById(restauranteId);
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Restaurante no encontrado'
      });
    }

    // Calcular el total y validar productos
    let total = 0;
    const itemsPedido = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.productoId);
      
      if (!producto) {
        return res.status(404).json({
          exito: false,
          mensaje: `Producto con ID ${item.productoId} no encontrado`
        });
      }
      
      if (!producto.disponible) {
        return res.status(400).json({
          exito: false,
          mensaje: `El producto ${producto.nombre} no está disponible`
        });
      }

      // Calcular precio con opciones adicionales
      let precioItem = producto.precio;
      if (item.opciones && item.opciones.length > 0) {
        for (const opcion of item.opciones) {
          const opcionEncontrada = producto.opciones.find(o => o.nombre === opcion);
          if (opcionEncontrada) {
            precioItem += opcionEncontrada.precio_adicional;
          }
        }
      }

      // Calcular subtotal del item
      const subtotal = precioItem * item.cantidad;
      total += subtotal;

      itemsPedido.push({
        producto: producto._id,
        cantidad: item.cantidad,
        precio: precioItem,
        opciones: item.opciones || [],
        comentarios: item.comentarios || ''
      });
    }

    // Crear el pedido
    const pedido = await Pedido.create({
      usuario: req.usuario._id,
      restaurante: restauranteId,
      productos: itemsPedido,
      metodoPago,
      total,
      fechaEstimadaRecogida: new Date(Date.now() + 30 * 60000) // 30 minutos después
    });

    // Notificar al restaurante en tiempo real (se manejaría con Socket.io)
    // Esta notificación se emite desde el servidor.js

    res.status(201).json({
      exito: true,
      pedido: {
        _id: pedido._id,
        numeroPedido: pedido.numeroPedido,
        codigoVerificacion: pedido.codigoVerificacion,
        total: pedido.total,
        estado: pedido.estado,
        fechaCreacion: pedido.fechaCreacion,
        fechaEstimadaRecogida: pedido.fechaEstimadaRecogida
      },
      mensaje: 'Pedido creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener todos los pedidos del usuario actual
 * @route   GET /api/orders
 * @access  Privado
 */
exports.obtenerPedidosUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario._id })
      .populate('restaurante', 'nombre direccion telefono')
      .populate('productos.producto', 'nombre precio imagen')
      .sort({ fechaCreacion: -1 });

    res.json({
      exito: true,
      pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener pedido por ID
 * @route   GET /api/orders/:id
 * @access  Privado
 */
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('restaurante', 'nombre direccion telefono coordenadas')
      .populate('productos.producto', 'nombre descripcion precio imagen');

    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Pedido no encontrado'
      });
    }

    // Verificar si el pedido pertenece al usuario o si es un restaurante/admin
    if (pedido.usuario.toString() !== req.usuario._id.toString() && 
        req.usuario.rol !== 'restaurante' && 
        req.usuario.rol !== 'admin') {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para ver este pedido'
      });
    }

    res.json({
      exito: true,
      pedido
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Actualizar estado de pedido
 * @route   PUT /api/orders/:id/estado
 * @access  Privado (Restaurante)
 */
exports.actualizarEstadoPedido = async (req, res) => {
  const { estado } = req.body;
  
  // Verificar que el estado es válido
  const estadosValidos = ['pendiente', 'confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado'];
  
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Estado no válido'
    });
  }

  try {
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Pedido no encontrado'
      });
    }
    
    // Solo restaurantes, administradores o el propio usuario pueden actualizar
    if (req.usuario.rol !== 'restaurante' && 
        req.usuario.rol !== 'admin' && 
        pedido.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para actualizar este pedido'
      });
    }
    
    // Si el usuario es cliente, solo puede cancelar si el pedido está pendiente
    if (req.usuario.rol === 'cliente' && 
        estado === 'cancelado' && 
        !['pendiente', 'confirmado'].includes(pedido.estado)) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No se puede cancelar un pedido que ya está en preparación o listo'
      });
    }
    
    // Si el pedido ya fue entregado o cancelado, no se puede cambiar
    if (pedido.estado === 'entregado' || pedido.estado === 'cancelado') {
      return res.status(400).json({
        exito: false,
        mensaje: `No se puede cambiar un pedido que ya está ${pedido.estado}`
      });
    }
    
    // Actualizar el estado
    pedido.estado = estado;
    await pedido.save();
    
    // Notificar al cliente en tiempo real (se manejaría con Socket.io)
    // Esta notificación se emite desde el servidor.js
    
    res.json({
      exito: true,
      pedido: {
        _id: pedido._id,
        numeroPedido: pedido.numeroPedido,
        estado: pedido.estado,
        historialEstados: pedido.historialEstados
      },
      mensaje: `Estado del pedido actualizado a: ${estado}`
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Calificar pedido
 * @route   POST /api/orders/:id/calificar
 * @access  Privado (Cliente)
 */
exports.calificarPedido = async (req, res) => {
  const { puntuacion, comentario } = req.body;
  
  // Validar puntuación
  if (puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({
      exito: false,
      mensaje: 'La puntuación debe estar entre 1 y 5'
    });
  }

  try {
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Pedido no encontrado'
      });
    }
    
    // Solo el cliente que hizo el pedido puede calificarlo
    if (pedido.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para calificar este pedido'
      });
    }
    
    // Solo pedidos entregados pueden ser calificados
    if (pedido.estado !== 'entregado') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Solo pedidos entregados pueden ser calificados'
      });
    }
    
    // Si ya fue calificado, no permitir calificar de nuevo
    if (pedido.calificacion && pedido.calificacion.puntuacion) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Este pedido ya fue calificado'
      });
    }
    
    // Actualizar la calificación del pedido
    pedido.calificacion = {
      puntuacion,
      comentario,
      fecha: new Date()
    };
    await pedido.save();
    
    // Actualizar la calificación del restaurante
    const restaurante = await Restaurante.findById(pedido.restaurante);
    const nuevaCalificacion = (restaurante.calificacion * restaurante.numeroCalificaciones + puntuacion) / 
                              (restaurante.numeroCalificaciones + 1);
    
    restaurante.calificacion = nuevaCalificacion;
    restaurante.numeroCalificaciones += 1;
    await restaurante.save();
    
    res.json({
      exito: true,
      calificacion: pedido.calificacion,
      mensaje: 'Pedido calificado correctamente'
    });
  } catch (error) {
    console.error('Error al calificar pedido:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener pedidos para restaurante
 * @route   GET /api/orders/restaurante
 * @access  Privado (Restaurante)
 */
exports.obtenerPedidosRestaurante = async (req, res) => {
  try {
    // Obtener el ID del restaurante asociado al usuario
    const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
    
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontró un restaurante asociado a este usuario'
      });
    }
    
    const { estado } = req.query;
    const filtro = { restaurante: restaurante._id };
    
    // Filtrar por estado si se proporciona
    if (estado && ['pendiente', 'confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado'].includes(estado)) {
      filtro.estado = estado;
    }
    
    const pedidos = await Pedido.find(filtro)
      .populate('usuario', 'nombre email telefono')
      .populate('productos.producto', 'nombre precio imagen')
      .sort({ fechaCreacion: -1 });
    
    res.json({
      exito: true,
      pedidos
    });
  } catch (error) {
    console.error('Error al obtener pedidos del restaurante:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};
