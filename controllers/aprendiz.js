const mongoose = require('mongoose');
// Importamos el modelo con la ruta correcta que usas en tus rutas
const CbaAprendiz = require('../models/cba_aprendiz'); 

exports.actualizarEstado = async (req, res) => {
    try {
        const id = req.params.id.trim();
        const { nuevoEstado } = req.body;

        // 1. Validar que nos envíen el estado
        if (!nuevoEstado) {
            return res.status(400).json({ 
                error: "El campo 'nuevoEstado' es requerido en el cuerpo de la petición." 
            });
        }

        // 2. Validar si el formato del ID de MongoDB es válido (Evita que la app falle)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "El formato del ID no es válido" });
        }

        // 3. Consultar si el aprendiz existe
        const aprendiz = await CbaAprendiz.findById(id);

        if (!aprendiz) {
            return res.status(404).json({ 
                error: `No se encontró ningún aprendiz con el ID: ${id}` 
            });
        }

        // 4. Condición de negocio: Prohibido modificar si ya está 'finalizado'
        if (aprendiz.estado === 'finalizado') {
            return res.status(403).json({ 
                error: "Acción prohibida: El aprendiz ya cuenta con el estado 'finalizado' y su registro no puede ser modificado." 
            });
        }

        // 5. Validar que el nuevo estado sea permitido
        const estadosValidos = ['pendiente', 'procesado', 'finalizado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({
                error: `Estado no válido. Los estados permitidos son: ${estadosValidos.join(', ')}`
            });
        }

        // 6. Actualizar únicamente el campo 'estado'
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