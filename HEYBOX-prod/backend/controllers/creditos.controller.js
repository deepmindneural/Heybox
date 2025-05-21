const { validationResult } = require('express-validator');
const Credito = require('../models/Credito');
const Transaccion = require('../models/Transaccion');
const PlanCredito = require('../models/PlanCredito');
const Usuario = require('../models/Usuario');

/**
 * @desc    Obtener saldo de créditos del usuario
 * @route   GET /api/creditos/saldo
 * @access  Privado
 */
exports.obtenerSaldo = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    }
    
    const credito = await Credito.findOne({ usuario: req.usuario._id });
    
    return res.json({
      exito: true,
      saldo: credito ? credito.saldo : 0,
      fechaActualizacion: credito ? credito.updatedAt : null
    });
  } catch (err) {
    console.error('Error al obtener saldo:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener historial de transacciones del usuario
 * @route   GET /api/creditos/transacciones
 * @access  Privado
 */
exports.obtenerTransacciones = async (req, res) => {
  try {
    // Parámetros opcionales de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const skip = (pagina - 1) * limite;
    
    // Obtener transacciones
    const transacciones = await Transaccion.find({ usuario: req.usuario._id })
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limite)
      .populate('restaurante', 'nombre');
    
    // Contar total de transacciones para paginación
    const total = await Transaccion.countDocuments({ usuario: req.usuario._id });
    
    return res.json({
      exito: true,
      transacciones,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    console.error('Error al obtener transacciones:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener planes de créditos disponibles
 * @route   GET /api/creditos/planes
 * @access  Público
 */
exports.obtenerPlanes = async (req, res) => {
  try {
    const planes = await PlanCredito.find({ activo: true }).sort({ creditos: 1 });
    
    return res.json({
      exito: true,
      planes
    });
  } catch (err) {
    console.error('Error al obtener planes:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener estadísticas de uso de créditos
 * @route   GET /api/creditos/estadisticas
 * @access  Privado
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Calcular el total gastado
    const agregadoTotal = await Transaccion.aggregate([
      { $match: { usuario: req.usuario._id, tipo: 'gasto' } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);
    
    const totalGastado = agregadoTotal.length > 0 ? agregadoTotal[0].total : 0;
    
    // Calcular el promedio mensual (últimos 3 meses)
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
    
    const agregadoMensual = await Transaccion.aggregate([
      { 
        $match: { 
          usuario: req.usuario._id, 
          tipo: 'gasto',
          fecha: { $gte: tresMesesAtras } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);
    
    // Promedio mensual (dividir entre 3 meses o menos si el usuario es más reciente)
    let promedioMensual = 0;
    if (agregadoMensual.length > 0) {
      // Verificar la fecha de registro del usuario para calcular meses reales
      const usuario = await Usuario.findById(req.usuario._id);
      const fechaRegistro = usuario.createdAt;
      const ahora = new Date();
      const mesesDesdeRegistro = (ahora.getFullYear() - fechaRegistro.getFullYear()) * 12 + 
        (ahora.getMonth() - fechaRegistro.getMonth());
      
      const mesesReales = Math.min(3, Math.max(1, mesesDesdeRegistro));
      promedioMensual = agregadoMensual[0].total / mesesReales;
    }
    
    // Obtener transacciones por categoría (restaurantes)
    const transaccionesPorCategoria = await Transaccion.aggregate([
      { $match: { usuario: req.usuario._id, tipo: 'gasto' } },
      { $group: { 
          _id: '$restaurante', 
          monto: { $sum: '$monto' },
          count: { $sum: 1 }
        } 
      },
      { $sort: { monto: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'restaurantes',
          localField: '_id',
          foreignField: '_id',
          as: 'infoRestaurante'
        }
      }
    ]);
    
    // Formatear las categorías y calcular porcentajes
    const categorias = await Promise.all(transaccionesPorCategoria.map(async (cat) => {
      const nombreCategoria = cat.infoRestaurante.length > 0 
        ? cat.infoRestaurante[0].nombre 
        : 'Otro';
      
      return {
        categoria: nombreCategoria,
        monto: cat.monto,
        porcentaje: totalGastado > 0 ? (cat.monto / totalGastado) * 100 : 0
      };
    }));
    
    return res.json({
      exito: true,
      estadisticas: {
        totalGastado,
        promedioMensual,
        transaccionesPorCategoria: categorias
      }
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Comprar créditos según un plan
 * @route   POST /api/creditos/comprar
 * @access  Privado
 */
exports.comprarCreditos = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }
  
  const { planId, metodoPago } = req.body;
  
  try {
    // Verificar si el plan existe
    const plan = await PlanCredito.findById(planId);
    if (!plan) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Plan no encontrado'
      });
    }
    
    // En un entorno real, aquí iría la integración con el sistema de pagos
    // Por ahora, simplemente simulamos la compra como exitosa
    
    // Buscar el registro de crédito del usuario o crear uno nuevo
    let credito = await Credito.findOne({ usuario: req.usuario._id });
    
    if (!credito) {
      credito = new Credito({
        usuario: req.usuario._id,
        saldo: 0
      });
    }
    
    // Actualizar el saldo
    credito.saldo += plan.creditos;
    await credito.save();
    
    // Registrar la transacción
    const nuevaTransaccion = new Transaccion({
      usuario: req.usuario._id,
      tipo: 'compra',
      monto: plan.creditos,
      concepto: `Compra de plan "${plan.nombre}"`,
      referencia: `P-${planId.substring(0, 8)}`
    });
    
    await nuevaTransaccion.save();
    
    return res.json({
      exito: true,
      mensaje: `Has comprado ${plan.creditos} créditos exitosamente`,
      creditosAgregados: plan.creditos,
      nuevoSaldo: credito.saldo,
      transaccion: nuevaTransaccion
    });
  } catch (err) {
    console.error('Error al comprar créditos:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Utilizar créditos (para hacer un pedido)
 * @route   POST /api/creditos/utilizar
 * @access  Privado
 */
exports.utilizarCreditos = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ 
      exito: false, 
      errores: errores.array() 
    });
  }
  
  const { monto, concepto, restauranteId } = req.body;
  
  try {
    // Buscar el registro de crédito del usuario
    const credito = await Credito.findOne({ usuario: req.usuario._id });
    
    if (!credito) {
      return res.status(400).json({
        exito: false,
        mensaje: 'No tienes créditos disponibles'
      });
    }
    
    // Verificar si tiene saldo suficiente
    if (credito.saldo < monto) {
      return res.status(400).json({
        exito: false,
        mensaje: `Saldo insuficiente. Tienes ${credito.saldo} créditos disponibles.`
      });
    }
    
    // Actualizar el saldo
    credito.saldo -= monto;
    await credito.save();
    
    // Registrar la transacción
    const nuevaTransaccion = new Transaccion({
      usuario: req.usuario._id,
      tipo: 'gasto',
      monto,
      concepto,
      restaurante: restauranteId
    });
    
    await nuevaTransaccion.save();
    
    return res.json({
      exito: true,
      mensaje: `Has utilizado ${monto} créditos exitosamente`,
      creditosUtilizados: monto,
      nuevoSaldo: credito.saldo,
      transaccion: nuevaTransaccion
    });
  } catch (err) {
    console.error('Error al utilizar créditos:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener todas las transacciones (solo admin)
 * @route   GET /api/creditos/admin/todas-transacciones
 * @access  Privado - Admin
 */
exports.todasTransacciones = async (req, res) => {
  try {
    // Verificar si el usuario es administrador
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        exito: false,
        mensaje: 'Acceso denegado'
      });
    }
    
    // Parámetros opcionales de paginación
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 15;
    const skip = (pagina - 1) * limite;
    
    // Filtros opcionales
    let filtro = {};
    
    if (req.query.tipo) {
      filtro.tipo = req.query.tipo;
    }
    
    if (req.query.usuario) {
      filtro.usuario = req.query.usuario;
    }
    
    if (req.query.restaurante) {
      filtro.restaurante = req.query.restaurante;
    }
    
    // Fechas
    if (req.query.fechaDesde) {
      filtro.fecha = filtro.fecha || {};
      filtro.fecha.$gte = new Date(req.query.fechaDesde);
    }
    
    if (req.query.fechaHasta) {
      filtro.fecha = filtro.fecha || {};
      filtro.fecha.$lte = new Date(req.query.fechaHasta);
    }
    
    // Obtener transacciones
    const transacciones = await Transaccion.find(filtro)
      .sort({ fecha: -1 })
      .skip(skip)
      .limit(limite)
      .populate('usuario', 'nombre email')
      .populate('restaurante', 'nombre');
    
    // Contar total de transacciones para paginación
    const total = await Transaccion.countDocuments(filtro);
    
    return res.json({
      exito: true,
      transacciones,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    console.error('Error al obtener todas las transacciones:', err);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};
