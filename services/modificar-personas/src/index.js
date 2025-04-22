const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json({ limit: '50mb' }));

// Ruta para actualizar una persona por número de documento
app.put('/:nro_documento', async (req, res) => {
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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servicio MODIFICAR escuchando en el puerto ${PORT}`);
});