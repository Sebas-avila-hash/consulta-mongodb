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
const CONNECT_RETRY_MS = 30 * 1000;

function getMongoUri() {
    return process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;
}

async function connectToDatabase() {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
        console.warn("⚠️ No se encontró una URI de MongoDB. Se omite la conexión.");
        return;
    }

    const now = Date.now();
    if (isConnected) {
        return;
    }
    if (now - lastConnectAttempt < CONNECT_RETRY_MS) {
        return;
    }

    lastConnectAttempt = now;

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 5,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ MongoDB conectado");
    } catch (err) {
        isConnected = false;
        console.error("❌ Error al conectar con MongoDB:", err.message);
    }
}

mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('❌ Error de conexión de Mongoose:', err.message);
});

// Aseguramos la conexión en cada petición antes de procesar rutas.
app.use((req, res, next) => {
    connectToDatabase().catch((err) => console.error('Error connectToDatabase (async):', err.message));
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

function startServer() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor local escuchando en el puerto ${PORT}`);
    });
}

if (process.env.NODE_ENV !== 'production' && require.main === module) {
    startServer();
}

// EXPORTACIÓN OBLIGATORIA PARA VERCEL
module.exports = app;