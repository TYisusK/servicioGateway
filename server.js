const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

const port = 8014;

// Crea una aplicación express
const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Configura rutas para servir archivos estáticos
app.use('/usuarios/uploads', express.static(path.join(__dirname, '../usuarios/uploads')));
app.use('/productos/uploads', express.static(path.join(__dirname, '../productos/uploads')));
app.use('/usuarios/web', express.static(path.join(__dirname, '../usuarios/web')));
app.use('/productos/web', express.static(path.join(__dirname, '../productos/web')));

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

// Configuración del gateway con opciones avanzadas
const server = gateway({
    keepAlive: true,
    timeout: 5000,
    retry: {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000
    },
    routes: [
        {
            method: 'POST',
            prefix: '/usuarios',
            target: 'http://localhost:3011',
        },
        {
            method: ['GET', 'POST', 'PUT', 'DELETE'],
            prefix: '/productos',
            target: 'http://localhost:3012',
        }
    ]
});

// Inicia el gateway
server.start(port).then(server => {
    console.log('Gateway ejecutándose en el puerto: ' + port);
}).catch(err => {
    console.error('Error al iniciar el gateway:', err);
});
