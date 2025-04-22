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
      foto
    } = req.body;

    // Convierte la foto de base64 a Buffer si existe
    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : null;

    const result = await pool.query(
      `INSERT INTO personas (
        primer_nombre, segundo_nombre, apellidos, fecha_nacimiento, genero,
        correo_electronico, celular, nro_documento, tipo_documento, foto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
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
        fotoBuffer // Añade la foto al query
      ]
    );

    // Insertar log
    await pool.query(
      `INSERT INTO logs (operacion, nro_documento, tipo_documento, usuario, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'crear',
        nro_documento,
        tipo_documento,
        'admin', // O el usuario real si tienes autenticación
        JSON.stringify({ persona: result.rows[0] })
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

router.get('/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY fecha DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// THEN place parameterized routes
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

// Eliminar persona por número de documento
router.delete('/:nro_documento', async (req, res) => {
  try {
    const { nro_documento } = req.params;

    // Buscar la persona antes de eliminarla (para log)
    const result = await pool.query(
      `SELECT * FROM personas WHERE nro_documento = $1`,
      [nro_documento]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    const personaEliminada = result.rows[0];

    // Eliminar la persona
    await pool.query(
      `DELETE FROM personas WHERE nro_documento = $1`,
      [nro_documento]
    );

    // Insertar log de eliminación
    await pool.query(
      `INSERT INTO logs (operacion, nro_documento, tipo_documento, usuario, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'eliminar',
        personaEliminada.nro_documento,
        personaEliminada.tipo_documento,
        'admin', // O el usuario real si tienes autenticación
        JSON.stringify({ persona: personaEliminada })
      ]
    );

    res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar persona por número de documento
router.put('/:nro_documento', async (req, res) => {
  try {
    const { nro_documento } = req.params;
    const {
      primer_nombre,
      segundo_nombre,
      apellidos,
      fecha_nacimiento,
      genero,
      correo_electronico,
      celular,
      tipo_documento,
      foto
    } = req.body;

    // Verificar si la persona existe
    const checkResult = await pool.query(
      `SELECT * FROM personas WHERE nro_documento = $1`,
      [nro_documento]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    const personaAntes = checkResult.rows[0];

    // Convertir la foto a Buffer si existe
    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : personaAntes.foto;

    // Actualizar la persona
    const result = await pool.query(
      `UPDATE personas SET 
        primer_nombre = $1, 
        segundo_nombre = $2, 
        apellidos = $3, 
        fecha_nacimiento = $4, 
        genero = $5, 
        correo_electronico = $6, 
        celular = $7, 
        tipo_documento = $8,
        foto = $9
      WHERE nro_documento = $10 RETURNING *`,
      [
        primer_nombre,
        segundo_nombre,
        apellidos,
        fecha_nacimiento,
        genero,
        correo_electronico,
        celular,
        tipo_documento,
        fotoBuffer,
        nro_documento
      ]
    );

    // Registrar en log
    await pool.query(
      `INSERT INTO logs (operacion, nro_documento, tipo_documento, usuario, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'modificar',
        nro_documento,
        tipo_documento,
        'admin', // O el usuario real si tienes autenticación
        JSON.stringify({ 
          antes: personaAntes,
          despues: result.rows[0] 
        })
      ]
    );

    res.status(200).json({
      message: 'Persona actualizada correctamente',
      persona: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;