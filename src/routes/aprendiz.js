const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const cba_aprendiz = require('../../models/cba_aprendiz');
const { actualizarEstado, obtenerAprendices, actualizarAprendiz } = require('../../controllers/aprendiz');
router.patch('/solicitud/:id',actualizarEstado);
const cba_contenido = require('../../models/contenido');

// 1. CREAR SOLICITUD
router.post('/solicitud', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: "No hay conexión activa con MongoDB",
                detalle: "Revisa la variable MONGO_URI en Vercel y el estado de tu cluster de Atlas"
            });
        }

        const datosUsuario = req.body;

        // Si el cliente envía un ID en el campo contenido, buscamos todo su objeto en la BD
        if (datosUsuario.contenido && mongoose.Types.ObjectId.isValid(datosUsuario.contenido)) {
            const contenidoCompleto = await cba_contenido.findById(datosUsuario.contenido);
            
            if (!contenidoCompleto) {
                return res.status(404).json({ 
                    error: "No se encontró el contenido asociado",
                    mensaje: `El ID '${datosUsuario.contenido}' no existe en la base de datos.` 
                });
            }

            // Reemplazamos el ID de texto por el documento de contenido completo
            datosUsuario.contenido = contenidoCompleto;
        }

        // Creamos el aprendiz con todos los datos inyectados
        const nuevoAprendiz = new cba_aprendiz(datosUsuario);
        const resultado = await nuevoAprendiz.save();

        res.status(201).json({
            mensaje: "Solicitud creada con éxito y todos los datos del contenido asignados",
            id_generado: resultado._id,
            datosGuardados: resultado
        });

    } catch (error) {
        console.error("❌ ERROR DETALLADO EN POST:", error);
        res.status(500).json({ 
            error: "Error crítico al guardar la solicitud",
            detalleError: error.message,
            objetoError: error 
        });
    }
});

// 2. OBTENER TODOS LOS APRENDICES
router.get('/', obtenerAprendices); 
// 3. ACTUALIZAR SOLICITUD
router.put('/solicitud/:id', actualizarAprendiz);
// 4. ELIMINAR SOLICITUD
router.delete('/solicitud/:id', async (req, res) => {
    try {
        const id = req.params.id.trim(); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        const resultado = await cba_aprendiz.findByIdAndDelete(id);

        if (!resultado) {
            return res.status(404).json({ error: "no encontrado en la BD o ya fue eliminado." });
        }

        res.json({ mensaje: "eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error completo en DELETE:", error); 
        res.status(500).json({ error: "No se pudo eliminar el aprendiz" });
    }
});    

module.exports = router;
