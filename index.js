const express = require('express');
const mongoose = require('mongoose');
const cba_aprendiz = require('./cba_aprendiz');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// 1. Conexión a la Base de Datos (Mantenla independiente)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🔥 Conexión exitosa a MongoDB"))
    .catch(err => console.error("❌ No se pudo conectar a MongoDB", err));

// 2. Definición de Rutas (Siempre afuera, accesibles desde el inicio)
console.log("Registrando endpoints...");

console.log("🔥 ¡Registrando la ruta POST /api/solicitud!");
app.post('/api/solicitud', async (req, res) => {
    try {
        const nuevasolicitud = req.body;

        if (!nuevasolicitud.nombre || !nuevasolicitud.email) {
            return res.status(400).json({
                error: "Formato inválido, el email y nombre son obligatorios"
            });
        }

        // Nota: Es mejor usar el modelo cba_aprendiz.create() si ya lo tienes importado,
        // pero esto mediante Driver nativo también funcionará si la conexión ya se estableció.
        const resultado = await mongoose.connection.db.collection('cba_aprendices').insertOne(nuevasolicitud);

        res.status(201).json({
            mensaje: "Solicitud creada",
            id_generado: resultado.insertedId,
            datosGuardados: nuevasolicitud
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error crítico al guardar la solicitud" });
    }
});

app.get('/', async (req, res) => {
    console.log("Entrando al endpoint GET /");
    try {
        const aprendices = await cba_aprendiz.find().lean();
        console.table(aprendices);
        res.json({ aprendices });
    } catch (error) {
        console.error("Error en la consulta", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// 3. Encendido del Servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 El backend está escuchando en http://localhost:${PORT}`);
});