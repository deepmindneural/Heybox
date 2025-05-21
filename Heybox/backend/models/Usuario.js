const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6,
    select: false
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio']
  },
  direccion: {
    calle: String,
    ciudad: String,
    codigoPostal: String
  },
  rol: {
    type: String,
    enum: ['cliente', 'restaurante', 'admin'],
    default: 'cliente'
  },
  metodosPago: [{
    tipo: {
      type: String,
      enum: ['tarjeta', 'paypal', 'efectivo']
    },
    detalles: {
      ultimosDigitos: String,
      fechaExpiracion: String,
      titular: String
    }
  }],
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
