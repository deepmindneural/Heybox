const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  imagen: {
    type: String
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['entrada', 'plato principal', 'postre', 'bebida', 'complemento']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  tiempo_preparacion: {
    type: Number, // tiempo en minutos
    default: 15
  },
  opciones: [{
    nombre: String,
    precio_adicional: Number
  }],
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },
  destacado: {
    type: Boolean,
    default: false
  },
  calorias: Number,
  alergenos: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', ProductoSchema);
