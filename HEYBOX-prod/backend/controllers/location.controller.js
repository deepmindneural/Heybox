const Ubicacion = require('../models/Ubicacion');
const Pedido = require('../models/Pedido');
const Restaurante = require('../models/Restaurante');
const { validationResult } = require('express-validator');

/**
 * @desc    Actualizar ubicación del usuario
 * @route   POST /api/location/update
 * @access  Privado
 */
exports.actualizarUbicacion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }

  const { pedidoId, lat, lng, precision, velocidad, altitud, rumbo } = req.body;

  try {
    // Verificar si el pedido existe y pertenece al usuario
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Pedido no encontrado'
      });
    }
    
    if (pedido.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para actualizar ubicación de este pedido'
      });
    }
    
    // Solo permitir actualización de ubicación para pedidos confirmados o en preparación o listos
    const estadosPermitidos = ['confirmado', 'en_preparacion', 'listo'];
    if (!estadosPermitidos.includes(pedido.estado)) {
      return res.status(400).json({
        exito: false,
        mensaje: `No se puede actualizar ubicación para pedidos en estado "${pedido.estado}"`
      });
    }
    
    // Crear registro de ubicación
    const ubicacion = await Ubicacion.create({
      usuario: req.usuario._id,
      pedido: pedidoId,
      coordenadas: { lat, lng },
      precision,
      velocidad,
      altitud,
      rumbo,
      timestamp: new Date()
    });
    
    // Actualizar la ubicación actual en el pedido
    pedido.ubicacionActual = { lat, lng };
    
    // Calcular distancia estimada al restaurante
    const restaurante = await Restaurante.findById(pedido.restaurante);
    if (restaurante && restaurante.direccion.coordenadas) {
      const distancia = calcularDistancia(
        lat, 
        lng, 
        restaurante.direccion.coordenadas.lat, 
        restaurante.direccion.coordenadas.lng
      );
      
      pedido.distanciaEstimada = Math.round(distancia);
      
      // Estimar tiempo de llegada basado en la velocidad o un promedio
      const velocidadMetrosPorMinuto = velocidad ? velocidad * 60 : 50; // 50 m/min = 3 km/h de promedio caminando
      pedido.tiempoEstimadoLlegada = Math.round(distancia / velocidadMetrosPorMinuto);
    }
    
    await pedido.save();
    
    // Esta información se transmitirá en tiempo real a través de socket.io
    // La implementación está en server.js
    
    res.status(201).json({
      exito: true,
      ubicacion,
      pedido: {
        distanciaEstimada: pedido.distanciaEstimada,
        tiempoEstimadoLlegada: pedido.tiempoEstimadoLlegada
      }
    });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener ubicaciones recientes para un pedido
 * @route   GET /api/location/:pedidoId
 * @access  Privado (Restaurante/Admin)
 */
exports.obtenerUbicacionesPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.pedidoId);
    
    if (!pedido) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Pedido no encontrado'
      });
    }
    
    // Si es cliente, solo puede ver sus propios pedidos
    if (req.usuario.rol === 'cliente' && pedido.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No autorizado para ver la ubicación de este pedido'
      });
    }
    
    // Si es restaurante, solo puede ver pedidos de su restaurante
    if (req.usuario.rol === 'restaurante') {
      const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
      
      if (!restaurante || pedido.restaurante.toString() !== restaurante._id.toString()) {
        return res.status(403).json({
          exito: false,
          mensaje: 'No autorizado para ver la ubicación de este pedido'
        });
      }
    }
    
    // Obtener últimas 20 ubicaciones ordenadas por timestamp
    const ubicaciones = await Ubicacion.find({ pedido: req.params.pedidoId })
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json({
      exito: true,
      pedido: {
        _id: pedido._id,
        numeroPedido: pedido.numeroPedido,
        estado: pedido.estado,
        ubicacionActual: pedido.ubicacionActual,
        distanciaEstimada: pedido.distanciaEstimada,
        tiempoEstimadoLlegada: pedido.tiempoEstimadoLlegada
      },
      ubicaciones: ubicaciones.reverse() // Enviar en orden cronológico
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * @desc    Obtener pedidos activos con ubicación para un restaurante
 * @route   GET /api/location/restaurante/activos
 * @access  Privado (Restaurante)
 */
exports.obtenerPedidosActivosConUbicacion = async (req, res) => {
  try {
    // Obtener el ID del restaurante asociado al usuario
    const restaurante = await Restaurante.findOne({ usuario: req.usuario._id });
    
    if (!restaurante) {
      return res.status(404).json({
        exito: false,
        mensaje: 'No se encontró un restaurante asociado a este usuario'
      });
    }
    
    // Obtener pedidos activos (confirmados, en preparación o listos)
    const pedidosActivos = await Pedido.find({
      restaurante: restaurante._id,
      estado: { $in: ['confirmado', 'en_preparacion', 'listo'] },
      ubicacionActual: { $ne: null } // Solo los que tienen ubicación
    }).populate('usuario', 'nombre email telefono');
    
    // Calcular zona de proximidad para cada pedido
    const pedidosConZona = pedidosActivos.map(pedido => {
      let zonaProximidad = null;
      
      if (pedido.distanciaEstimada !== null && restaurante.anillosProximidad) {
        for (const anillo of restaurante.anillosProximidad) {
          if (pedido.distanciaEstimada <= anillo.distancia) {
            zonaProximidad = {
              distancia: anillo.distancia,
              color: anillo.color
            };
            break;
          }
        }
      }
      
      return {
        _id: pedido._id,
        numeroPedido: pedido.numeroPedido,
        usuario: pedido.usuario,
        estado: pedido.estado,
        ubicacionActual: pedido.ubicacionActual,
        distanciaEstimada: pedido.distanciaEstimada,
        tiempoEstimadoLlegada: pedido.tiempoEstimadoLlegada,
        zonaProximidad
      };
    });
    
    res.json({
      exito: true,
      restaurante: {
        _id: restaurante._id,
        nombre: restaurante.nombre,
        coordenadas: restaurante.direccion.coordenadas,
        anillosProximidad: restaurante.anillosProximidad
      },
      pedidos: pedidosConZona
    });
  } catch (error) {
    console.error('Error al obtener pedidos activos con ubicación:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error en el servidor',
      error: error.message
    });
  }
};

/**
 * Función auxiliar para calcular la distancia entre dos puntos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del punto 1
 * @param {number} lon1 - Longitud del punto 1
 * @param {number} lat2 - Latitud del punto 2
 * @param {number} lon2 - Longitud del punto 2
 * @returns {number} - Distancia en metros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distancia en metros
  
  return distancia;
}
