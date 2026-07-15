const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Usado para validar los ObjectIds
const cba_aprendiz = require('../../models/cba_aprendiz');
const aprendizController = require('../../controllers/aprendiz'); // Tu controlador con actualizarEstado

// Endpoint PATCH solicitado
router.patch('/actualizar-estado/:id', aprendizController.actualizarEstado);

// 1. CREAR SOLICITUD
router.post('/solicitud', async (req, res) => {
    try {
        const nuevasolicitud = new producto(req.body);
        //const resultado= new 

        const nuevoAprendiz = new cba_aprendiz(nuevasolicitud);
        const resultado = await nuevoAprendiz.save();

        res.status(201).json({
            mensaje: "Solicitud creada",
            id_generado: resultado._id,
            datosGuardados: resultado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error crítico al guardar la solicitud" });
    }
});

// 2. OBTENER TODOS LOS APRENDICES
router.get('/', async (req, res) => {
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

// 3. ACTUALIZAR SOLICITUD
router.put('/solicitud/:id', async (req, res) => {
    try {
        const id = req.params.id.trim(); 
        console.log("El id limpio que se va a buscar es:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        const datosNuevos = req.body;
        
        const resultado = await cba_aprendiz.findByIdAndUpdate(
            id, 
            { $set: datosNuevos },
            { new: true } 
        );

        if (!resultado) {
            return res.status(404).json({ error: "no encontrado en la BD" });
        }

        res.json({
            mensaje: "actualizado correctamente", 
            datos: resultado
        });
    } catch (error) {
        console.error("❌ Error completo en PUT:", error);
        res.status(500).json({ error: "No se pudo actualizar" });
    }
});

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