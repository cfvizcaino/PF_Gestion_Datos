const express = require('express');
const router = express.Router();
const pool = require('../db');

// CREAR PERSONA
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

    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : null;

    const result = await pool.query(
      `INSERT INTO personas (
        primer_nombre, segundo_nombre, apellidos, fecha_nacimiento, genero,
        correo_electronico, celular, nro_documento, tipo_documento, foto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        primer_nombre, segundo_nombre, apellidos, fecha_nacimiento, genero,
        correo_electronico, celular, nro_documento, tipo_documento, fotoBuffer
      ]
    );

    // Registrar log
    await pool.query(
      `INSERT INTO logs (operacion, nro_documento, tipo_documento, usuario, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'crear',
        nro_documento,
        tipo_documento,
        'admin',
        JSON.stringify({ persona: result.rows[0] })
      ]
    );

    res.status(201).json({
      message: 'Persona creada exitosamente',
      persona: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear persona:', error);
    
    // Detectar error de cédula duplicada
    if (
      error.code === '23505' || 
      (error.message && error.message.includes('duplicate key'))
    ) {
      return res.status(400).json({ 
        error: 'Ya existe una persona con ese número de documento' 
      });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// MODIFICAR PERSONA
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
        'admin',
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

// BORRAR PERSONA
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
        'admin',
        JSON.stringify({ persona: personaEliminada })
      ]
    );

    res.status(200).json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;