const mongoose = require('mongoose');

const PlanCreditoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  creditos: {
    type: Number,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  moneda: {
    type: String,
    default: 'COP'  // Pesos colombianos como predeterminado
  },
  popular: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#00b8d4'  // Color turquesa/cyan que mencionaste
  },
  activo: {
    type: Boolean,
    default: true
  },
  orden: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanCredito', PlanCreditoSchema);
