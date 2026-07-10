const express = require('express');
const mongoose = require('mongoose');
const cba_aprendiz = require('./cba_aprendiz');
const { ObjectId } = require('mongodb');
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

console.log("¡Registrando la ruta POST /api/solicitud!");
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

app.put('/api/solicitud/:id', async (req, res) => {
    try {
        // 1. Limpiamos espacios en blanco usando .trim()
        const id = req.params.id.trim(); 
        console.log("El id limpio que se va a buscar es:", id);

        // 2. Validamos que el formato sea un ObjectId real de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        const datosNuevos = req.body;
        
        const resultado = await mongoose.connection.db.collection('cba_aprendices').updateOne(
            { _id: new ObjectId(id) }, // Condición
            { $set: datosNuevos } // Acción
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ error: "no encontrado en la BD" });
        }

        res.json({
            mensaje: "actualizado correctamente", 
            modificaciones: resultado.modifiedCount
        });
    } catch (error) {
        console.error("❌ Error completo en PUT:", error);
        res.status(500).json({ error: "No se pudo actualizar" });
    }
});

app.delete('/api/solicitud/:id', async (req, res) => {
    try {
        const id = req.params.id; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        const resultado = await mongoose.connection.db.collection('cba_aprendices').deleteOne({
            _id: new ObjectId(id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: "no encontrado en la BD o ya fue eliminado." });
        }

        res.json({ mensaje: "eliminado correctamente" });
    } catch (error) {
        // 👇 ESTO ES CLAVE: Ahora sí verás el error real en tu terminal negra/consola
        console.error("❌ Error completo en DELETE:", error); 
        res.status(500).json({ error: "No se pudo eliminar el aprendiz" });
    }
});      
// 3. Encendido del Servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`El backend está escuchando en http://localhost:${PORT}`);
});