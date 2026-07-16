const mongoose = require('mongoose');
const CbaAprendiz = require('../models/cba_aprendiz'); 

// 1. OBTENER APRENDICES (Traer todos los registros de forma segura)
const obtenerAprendices = async (req, res) => {
    try {
        const aprendices = await CbaAprendiz.find().populate('contenido');
        return res.status(200).json(aprendices);
    } catch (error) {
        console.error("❌ Error en GET /aprendices:", error);
        return res.status(500).json({ 
            error: "Error interno del servidor al consultar los aprendices." 
        });
    }
};

// 2. ACTUALIZAR APRENDIZ (PUT/PATCH general)
const actualizarAprendiz = async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                error: "El cuerpo de la petición no puede estar vacío para realizar una actualización." 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido." });
        }

        const aprendiz = await CbaAprendiz.findById(id);

        if (!aprendiz) {
            return res.status(404).json({ 
                error: `No se encontró ningún aprendiz con el ID: ${id}` 
            });
        }

        if (aprendiz.estado === 'finalizado') {
            return res.status(403).json({ 
                error: "Acción prohibida: El aprendiz ya cuenta con el estado 'finalizado' y su registro no puede ser modificado." 
            });
        }

        if (req.body.estado) {
            const estadosValidos = ['pendiente', 'procesado', 'finalizado'];
            if (!estadosValidos.includes(req.body.estado)) {
                return res.status(400).json({
                    error: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}`
                });
            }
        }

        const aprendizActualizado = await CbaAprendiz.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            mensaje: "Aprendiz actualizado con éxito.",
            datos: aprendizActualizado
        });

    } catch (error) {
        console.error("❌ Error en PUT-PATCH /actualizar-aprendiz:", error);
        return res.status(500).json({ 
            error: "Error interno del servidor al procesar la actualización del aprendiz." 
        });
    }
};

// 3. ACTUALIZAR ESTADO (PATCH específico)
const actualizarEstado = async (req, res) => {
    try {
        const id = req.params.id.trim();
        const { nuevoEstado } = req.body;

        if (!nuevoEstado) {
            return res.status(400).json({ 
                error: "El campo 'nuevoEstado' es requerido en el cuerpo de la petición." 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        const aprendiz = await CbaAprendiz.findById(id);

        if (!aprendiz) {
            return res.status(404).json({ 
                error: `No se encontró ningún aprendiz con el ID: ${id}` 
            });
        }

        if (aprendiz.estado === 'finalizado') {
            return res.status(403).json({ 
                error: "Acción prohibida: El aprendiz ya cuenta con el estado 'finalizado' y su registro no puede ser modificado." 
            });
        }

        const estadosValidos = ['pendiente', 'procesado', 'finalizado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({
                error: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}`
            });
        }

        const aprendizActualizado = await CbaAprendiz.findByIdAndUpdate(
            id,
            { $set: { estado: nuevoEstado } },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            mensaje: "Estado del aprendiz actualizado con éxito.",
            datos: aprendizActualizado
        });

    } catch (error) {
        console.error("❌ Error en PATCH /actualizar-estado:", error);
        return res.status(500).json({ 
            error: "Error interno del servidor al procesar la actualización del estado." 
        });
    }
};
module.exports = {
    obtenerAprendices,
    actualizarAprendiz,
    actualizarEstado
};