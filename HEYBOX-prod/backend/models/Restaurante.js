const mongoose = require('mongoose');

const RestauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del restaurante es obligatorio'],
    unique: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  direccion: {
    calle: {
      type: String,
      required: [true, 'La calle es obligatoria']
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es obligatoria']
    },
    codigoPostal: {
      type: String,
      required: [true, 'El código postal es obligatorio']
    },
    coordenadas: {
      lat: Number,
      lng: Number
    }
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio']
  },
  horario: {
    lunes: { apertura: String, cierre: String },
    martes: { apertura: String, cierre: String },
    miercoles: { apertura: String, cierre: String },
    jueves: { apertura: String, cierre: String },
    viernes: { apertura: String, cierre: String },
    sabado: { apertura: String, cierre: String },
    domingo: { apertura: String, cierre: String }
  },
  logo: {
    type: String
  },
  imagenes: [String],
  categoria: {
    type: String,
    enum: ['comida rápida', 'gourmet', 'vegetariano', 'vegano', 'cafetería', 'postres', 'otro'],
    required: true
  },
  calificacion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numeroCalificaciones: {
    type: Number,
    default: 0
  },
  activo: {
    type: Boolean,
    default: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  anillosProximidad: {
    type: [{
      distancia: Number, // en metros
      color: String
    }],
    default: [
      { distancia: 300, color: '#FF0000' }, // Rojo - Muy cercano
      { distancia: 1000, color: '#FFA500' }, // Naranja - Cercano
      { distancia: 3000, color: '#FFFF00' }  // Amarillo - Aproximándose
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurante', RestauranteSchema);
