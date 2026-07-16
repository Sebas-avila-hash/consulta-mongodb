const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const middlewareRevision = (req, res, next) => {
    const horaActual = new Date().toLocaleDateString();
    console.log(`[${horaActual}] Peticion entrante: ${req.method} a la ruta ${req.url}`);
    next();
};

app.use(middlewareRevision);
app.post('/api/v1/contenidos-test', (req, res) => {
    res.status(200).json({ mensaje: "¡La ruta directa funciona!", body: req.body });
});

const healthRoutes = require('./src/routes/salud');
app.use('/api/v1/salud', healthRoutes);

const aprendizRoutes = require('./src/routes/aprendiz');
app.use('/api/v1/aprendices', aprendizRoutes);
const contenidoRoutes = require("./src/routes/contenido");
app.use('/api/v1/contenidos', contenidoRoutes);
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB conectado");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
})
.catch(err => {
    console.error("❌ Error al conectar con MongoDB");
    console.error(err);
});