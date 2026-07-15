const mongoose = require('mongoose');

const contenidoSchema = new mongoose.Schema({
  identificacion: {
    type: String,
    required: [true,"la identificacion es necesaria"],
    trim:true
  },
  edad: {
    type: Number,
    required: true
  },
  tipo_sangre: {
    type: String,
    required: true
  }
}, { _id: false }); 

// Esquema principal para los aprendices
const cbaAprendizSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true,"el nombre del aprendiz ess obligatorio"],
    trim: true
  },
  apellido: {
    type: String,
    required: [true,"el apellido del aprendiz ess obligatorio"],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  formacion: {
    type: String,
    required: [true,"la formacion es obligatorio"],
    trim: true
  },
  
  estado: {
    type: String,
    enum: ['pendiente', 'procesado', 'finalizado'],
    default: 'pendiente',
    required: true
  },
  contenido: [contenidoSchema], 
  fecha_ingreso: {
    type: String, 
    required: false
  },
  fecha_salida: {
    type: String, 
    required: false
  }
}, {
  versionKey: false, 
  timestamps: true   
});

const CbaAprendiz = mongoose.model('cba_aprendice', cbaAprendizSchema);

module.exports = CbaAprendiz;