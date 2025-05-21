const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  numeroPedido: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1']
    },
    precio: {
      type: Number,
      required: true
    },
    opciones: [String],
    comentarios: String
  }],
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    tipo: {
      type: String,
      enum: ['tarjeta', 'paypal', 'efectivo'],
      required: true
    },
    detalles: {
      transaccionId: String,
      ultimosDigitos: String
    }
  },
  total: {
    type: Number,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaEstimadaRecogida: {
    type: Date
  },
  codigoVerificacion: {
    type: String,
    required: true
  },
  ubicacionActual: {
    type: {
      lat: Number,
      lng: Number
    },
    default: null
  },
  distanciaEstimada: {
    type: Number, // en metros
    default: null
  },
  tiempoEstimadoLlegada: {
    type: Number, // en minutos
    default: null
  },
  historialEstados: [{
    estado: String,
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  calificacion: {
    puntuacion: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    fecha: Date
  }
}, {
  timestamps: true
});

// Generar número de pedido único
PedidoSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Crear un código alfanumérico único de 5 caracteres
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.numeroPedido = `HB-${randomCode}`;
    
    // Generar código de verificación (5 dígitos)
    this.codigoVerificacion = Math.floor(10000 + Math.random() * 90000).toString();
    
    // Registrar el estado inicial en el historial
    this.historialEstados.push({
      estado: this.estado,
      fecha: new Date()
    });
  } else if (this.isModified('estado')) {
    // Registrar cambio de estado en el historial
    this.historialEstados.push({
      estado: this.estado,
      fecha: new Date()
    });
  }
  
  next();
});

module.exports = mongoose.model('Pedido', PedidoSchema);
