const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const cba_aprendiz = require('../../models/cba_aprendiz');
const { actualizarEstado, obtenerAprendices, actualizarAprendiz } = require('../../controllers/aprendiz');
router.patch('/solicitud/:id',actualizarEstado);

// 1. CREAR SOLICITUD
router.post('/solicitud', async (req, res) => {
    try {
       
        const nuevoAprendiz = new cba_aprendiz(req.body);
        const resultado = await nuevoAprendiz.save();
        res.status(201).json({
            mensaje: "Solicitud creada",
            id_generado: resultado._id,
            datosGuardados: resultado
        });
    } catch (error) {

        console.error("❌ ERROR DETALLADO EN POST:", error);
        res.status(500).json({ 
            error: "Error crítico al guardar la solicitud",
            detalleError: error.message, // <-- Esto nos dirá exactamente qué falló
            objetoError: error // <-- Y esto nos dará toda la estructura del error
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
