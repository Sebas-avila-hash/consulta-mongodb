const mongoose = require("mongoose");

const contenidoSchema = new mongoose.Schema({
    identificacion: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true
    },
    tipo_sangre: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model("Contenido", contenidoSchema);