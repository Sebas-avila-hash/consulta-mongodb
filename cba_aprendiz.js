const mongoose = require('mongoose');

const aprendizSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    formacion: String,
    contenido: [
        {
            identificacion: String,
            edad: Number,
            tipo_sangre: String
        }
    ]
});

module.exports = mongoose.model('cba_aprendices', aprendizSchema);