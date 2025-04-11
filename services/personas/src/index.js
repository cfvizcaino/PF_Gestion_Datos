const express = require('express');
const app = express();
const personasRoutes = require('./routes/personasRoutes');

// Nota: CORS está siendo manejado por Nginx, por lo que no es necesario aquí
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Manejo de las peticiones OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    
    next();
});
*/

//Middleware
app.use(express.json());

//Rutas
app.use('/', personasRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servicio de personas escuchando en el puerto ${PORT}`);
});