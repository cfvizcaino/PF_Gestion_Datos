// filepath: c:\Users\57304\Documents\PF_Gestion_Datos\services\borrar-personas\src\index.js
const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// Implementa SOLO la ruta DELETE /:nro_documento
app.delete('/:nro_documento', async (req, res) => {
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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Servicio BORRAR escuchando en el puerto ${PORT}`);
});