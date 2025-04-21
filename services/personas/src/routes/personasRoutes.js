const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/ping', (req, res) => {
    console.log('Ping request received');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        ok: true,
        message: 'Pong'
    });
});

// Añadir esta ruta para diagnóstico de la BD
router.get('/db-status', async (req, res) => {
  try {
    const client = await pool.connect();
    
    // Verificar conexión básica
    const dbResult = await client.query('SELECT NOW() as time, version() as version');
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Verificar extensión pgvector
    const pgvectorResult = await client.query(`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `);
    
    client.release();
    
    res.status(200).json({
      status: 'OK',
      timestamp: dbResult.rows[0].time,
      version: dbResult.rows[0].version,
      pgvector_enabled: pgvectorResult.rowCount > 0,
      tables: tablesResult.rows.map(row => row.table_name)
    });
  } catch (error) {
    console.error('Error al verificar estado de la BD:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Usa rutas relativas a la base '/personas' definida en index.js
router.post('/', async (req, res) => {
  try {
    const {
      primer_nombre,
      segundo_nombre,
      apellidos,
      fecha_nacimiento,
      genero,
      correo_electronico,
      celular,
      nro_documento,
      tipo_documento,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO personas (
        primer_nombre, segundo_nombre, apellidos, fecha_nacimiento, genero,
        correo_electronico, celular, nro_documento, tipo_documento
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        primer_nombre,
        segundo_nombre,
        apellidos,
        fecha_nacimiento,
        genero,
        correo_electronico,
        celular,
        nro_documento,
        tipo_documento,
      ]
    );

    res.status(201).json({
      message: 'Persona creada exitosamente',
      persona: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Usa rutas relativas a la base '/personas' definida en index.js
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM personas ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Usa rutas relativas a la base '/personas' definida en index.js
router.get('/:nro_documento', async (req, res) => {
  try {
    const { nro_documento } = req.params;

    const result = await pool.query(
      `SELECT * FROM personas WHERE nro_documento = $1`,
      [nro_documento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    const persona = result.rows[0];
    if (persona.foto) {
      persona.foto = Buffer.from(persona.foto).toString('base64');
    }

    res.status(200).json(persona);
  } catch (error) {
    console.error('Error al consultar persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;