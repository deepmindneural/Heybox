const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true
  },
  coordenadas: {
    lat: {
      type: Number,
      required: [true, 'Latitud es obligatoria']
    },
    lng: {
      type: Number,
      required: [true, 'Longitud es obligatoria']
    }
  },
  precision: {
    type: Number // precisión en metros
  },
  velocidad: {
    type: Number // velocidad en m/s, si está disponible
  },
  altitud: Number,
  rumbo: Number, // dirección en grados
  timestamp: {
    type: Date,
    default: Date.now
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);
