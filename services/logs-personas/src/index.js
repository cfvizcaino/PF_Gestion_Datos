const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// Ruta para consultar logs
app.get('/', async (req, res) => {
  try {
    const { 
      desde, 
      hasta, 
      operacion, 
      nro_documento 
    } = req.query;
    
    let query = 'SELECT * FROM logs';
    const params = [];
    const conditions = [];
    
    // Construir condiciones de filtro
    if (desde) {
      params.push(desde);
      conditions.push(`fecha >= $${params.length}`);
    }
    
    if (hasta) {
      params.push(hasta);
      conditions.push(`fecha <= $${params.length}`);
    }
    
    if (operacion) {
      params.push(operacion);
      conditions.push(`operacion = $${params.length}`);
    }
    
    if (nro_documento) {
      params.push(nro_documento);
      conditions.push(`nro_documento = $${params.length}`);
    }
    
    // Añadir condiciones a la consulta
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Ordenar por fecha descendente
    query += ' ORDER BY fecha DESC';
    
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Servicio LOGS escuchando en el puerto ${PORT}`);
});