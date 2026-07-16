const mongoose = require("mongoose");
const Contenido = require("../models/contenido");

// Obtener todos los contenidos
const obtenerContenidos = async (req, res) => {
    console.log("obteniendo los contenidos")
    try {
        const contenidos = await Contenido.find();
        return res.status(200).json(contenidos);
    } catch (error) {
        console.error("❌ Error al obtener contenidos:", error);
        return res.status(500).json({
            error: "Error interno del servidor."
        });
    }
};

// Obtener un contenido por ID
const obtenerContenidoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "El ID no es válido."
            });
        }

        const contenido = await Contenido.findById(id);

        if (!contenido) {
            return res.status(404).json({
                error: "Contenido no encontrado."
            });
        }

        return res.status(200).json(contenido);

    } catch (error) {
        console.error("❌ Error al obtener contenido:", error);
        return res.status(500).json({
            error: "Error interno del servidor."
        });
    }
};

// Crear contenido
const crearContenido = async (req, res) => {
    try {
        const nuevoContenido = await Contenido.create(req.body);

        return res.status(201).json({
            mensaje: "Contenido creado correctamente.",
            datos: nuevoContenido
        });

    } catch (error) {
        console.error("❌ Error al crear contenido:", error);

        return res.status(400).json({
            error: error.message
        });
    }
};

// Actualizar contenido
const actualizarContenido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "El ID no es válido."
            });
        }

        const contenido = await Contenido.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contenido) {
            return res.status(404).json({
                error: "Contenido no encontrado."
            });
        }

        return res.status(200).json({
            mensaje: "Contenido actualizado correctamente.",
            datos: contenido
        });

    } catch (error) {
        console.error("❌ Error al actualizar contenido:", error);

        return res.status(500).json({
            error: "Error interno del servidor."
        });
    }
};

// Eliminar contenido
const eliminarContenido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "El ID no es válido."
            });
        }

        const contenido = await Contenido.findByIdAndDelete(id);

        if (!contenido) {
            return res.status(404).json({
                error: "Contenido no encontrado."
            });
        }

        return res.status(200).json({
            mensaje: "Contenido eliminado correctamente."
        });

    } catch (error) {
        console.error("❌ Error al eliminar contenido:", error);

        return res.status(500).json({
            error: "Error interno del servidor."
        });
    }
};

module.exports = {
    obtenerContenidos,
    obtenerContenidoPorId,
    crearContenido,
    actualizarContenido,
    eliminarContenido
};