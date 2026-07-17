const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de revisión
const middlewareRevision = (req, res, next) => {
    const horaActual = new Date().toLocaleDateString();
    console.log(`[${horaActual}] Peticion entrante: ${req.method} a la ruta ${req.url}`);
    next();
};
app.use(middlewareRevision);

// --- OPTIMIZACIÓN PARA MONGODB (SERVERLESS) ---
let isConnected = false;
let lastConnectAttempt = 0;
const CONNECT_RETRY_MS = 30 * 1000; // esperar 30s entre intentos fallidos

async function connectToDatabase() {
    if (!process.env.MONGO_URI) {
        console.warn("⚠️ MONGO_URI no está definido. No se establecerá la conexión con MongoDB.");
        return;
    }
    // evitar reintentos continuos si acaba de fallar
    const now = Date.now();
    if (isConnected) {
        return;
    }
    if (now - lastConnectAttempt < CONNECT_RETRY_MS) {
        // Demasiado pronto para reintentar
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("✅ MongoDB conectado");
    } catch (err) {
        lastConnectAttempt = Date.now();
        isConnected = false;
        console.error("❌ Error al conectar con MongoDB", err);
    }
}

// Aseguramos la conexión en cada petición antes de procesar rutas
app.use(async (req, res, next) => {
    // No bloquear la petición si la DB no responde rápidamente
    connectToDatabase().catch(err => console.error('Error connectToDatabase (async):', err));
    next();
});
// ----------------------------------------------

// Manejo global para evitar que excepciones no capturadas terminen el proceso
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

// Rutas
app.post('/api/v1/contenidos-test', (req, res) => {
    res.status(200).json({ mensaje: "¡La ruta directa funciona!", body: req.body });
});

const healthRoutes = require('./src/routes/salud');
app.use('/api/v1/salud', healthRoutes);

const aprendizRoutes = require('./src/routes/aprendiz');
app.use('/api/v1/aprendices', aprendizRoutes);

const contenidoRoutes = require("./src/routes/contenido");
app.use('/api/v1/contenidos', contenidoRoutes);

// Solo iniciamos el puerto en desarrollo local. En Vercel, Vercel se encarga de todo.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor local escuchando en el puerto ${PORT}`);
    });
}

// EXPORTACIÓN OBLIGATORIA PARA VERCEL
module.exports = app;