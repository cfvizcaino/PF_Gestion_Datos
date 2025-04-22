const express = require('express');
const app = express();
const personasRoutes = require('./routes/personasRoutes');

app.use(express.json({ limit: '50mb' }));

// Rutas 
app.use('/crear', personasRoutes);
app.use('/modificar', personasRoutes);
app.use('/borrar', personasRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servicio CRUD de Personas escuchando en el puerto ${PORT}`);
});