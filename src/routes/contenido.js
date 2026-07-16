const express = require("express");
const router = express.Router();

const {
    crearContenido,
    obtenerContenidos,
    obtenerContenidoPorId,
    actualizarContenido,
    eliminarContenido
} = require("../../controllers/contenido");

router.get("/", obtenerContenidos);
router.get("/:id", obtenerContenidoPorId);
router.post("/", crearContenido);
router.put("/:id", actualizarContenido);
router.delete("/:id", eliminarContenido);

module.exports = router;