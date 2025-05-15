const express = require('express');
const app = express();
const personasRoutes = require('./routes/personasRoutes');

app.use(express.json({ limit: '50mb' }));

// Root path handler - provides API information
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Personas CRUD Service API',
    endpoints: {
      crear: 'POST /crear',
      modificar: 'PUT /modificar/:nro_documento',
      borrar: 'DELETE /borrar/:nro_documento'
    }
  });
});

// Rutas 
app.use('/crear', personasRoutes);
app.use('/crear/', personasRoutes);
app.use('/modificar', personasRoutes);
app.use('/modificar/', personasRoutes);
app.use('/borrar', personasRoutes);
app.use('/borrar/', personasRoutes);

// GET handlers for documentation/feedback
app.get('/crear', (req, res) => {
  res.status(405).json({ 
    error: 'Method Not Allowed', 
    message: 'Endpoint requires POST method, not GET',
    example: {
      method: 'POST',
      contentType: 'application/json',
      body: {
        primer_nombre: 'Juan',
        segundo_nombre: 'Carlos',
        apellidos: 'Pérez',
        fecha_nacimiento: '1990-01-01',
        genero: 'M',
        correo_electronico: 'email@example.com',
        celular: '3001234567',
        tipo_documento: 'CC',
        nro_documento: '1234567890'
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      crear: 'POST /crear',
      modificar: 'PUT /modificar/:nro_documento',
      borrar: 'DELETE /borrar/:nro_documento',
      health: 'GET /health'
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servicio CRUD de Personas escuchando en el puerto ${PORT}`);
});