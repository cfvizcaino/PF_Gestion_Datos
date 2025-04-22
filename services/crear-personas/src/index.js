const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json({ limit: '50mb' }));

// Ruta para crear una persona
app.post('/', async (req, res) => {
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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servicio CREAR escuchando en el puerto ${PORT}`);
});