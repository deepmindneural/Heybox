const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo: {
    type: String,
    enum: ['compra', 'gasto', 'recarga', 'reembolso'],
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  concepto: {
    type: String,
    required: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante'
  },
  referencia: {
    type: String
  },
  metodoPago: {
    type: String
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completada', 'cancelada', 'fallida'],
    default: 'completada'
  },
  notas: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaccion', TransaccionSchema);
