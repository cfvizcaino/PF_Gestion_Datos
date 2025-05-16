const express = require('express');
const { pool, initPgVector } = require('./db');
const { 
  updateAllEmbeddings, 
  searchPersonas, 
  generateNaturalLanguageResponse 
} = require('./embeddings');
require('dotenv').config();

const app = express();
app.use(express.json());

// Inicializar pgvector al arrancar
(async () => {
  try {
    await initPgVector();
    console.log('pgvector inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar pgvector:', error);
  }
})();

// Endpoint para realizar una consulta en lenguaje natural
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'La consulta es requerida' });
    }
    
    console.log(`Procesando consulta: "${query}"`);
    
    // Generar respuesta
    const response = await generateNaturalLanguageResponse(query);
    
    // Registrar consulta en logs
    try {
      await pool.query(
        `INSERT INTO logs (operacion, usuario, detalles)
         VALUES ($1, $2, $3)`,
        [
          'consultar_nl',
          'usuario',
          JSON.stringify({ query, response })
        ]
      );
    } catch (logError) {
      console.error('Error al registrar log:', logError);
      // Continuar incluso si falla el log
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error en consulta de lenguaje natural:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para forzar la actualización de todos los embeddings
app.post('/update-embeddings', async (req, res) => {
  try {
    const result = await updateAllEmbeddings();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar embeddings:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para búsqueda semántica
app.get('/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'La consulta es requerida' });
    }
    
    const results = await searchPersonas(query, limit ? parseInt(limit) : 5);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error en búsqueda semántica:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    instance: process.env.HOSTNAME || 'local'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Servicio CONSULTAR-NL escuchando en el puerto ${PORT}`);
});