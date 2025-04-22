const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// Consultar una persona por número de documento
app.get('/:nro_documento', async (req, res) => {
  try {
    const { nro_documento } = req.params;
    console.log(`Buscando persona con documento: ${nro_documento}`);

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

    // Registrar consulta en logs
    await pool.query(
      `INSERT INTO logs (operacion, nro_documento, tipo_documento, usuario, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'consultar',
        persona.nro_documento,
        persona.tipo_documento,
        'admin',
        JSON.stringify({ consulta_por: 'documento' })
      ]
    );

    res.status(200).json(persona);
  } catch (error) {
    console.error('Error al consultar persona:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Listar todas las personas
app.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, primer_nombre, segundo_nombre, apellidos, 
              fecha_nacimiento, genero, correo_electronico, 
              celular, tipo_documento, nro_documento 
       FROM personas 
       ORDER BY id DESC`
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener personas:', error);
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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servicio CONSULTAR escuchando en el puerto ${PORT}`);
});