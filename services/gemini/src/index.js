const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pool } = require('pg');

const app = express();

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configuración CORS más permisiva
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Función para obtener estadísticas detalladas de la base de datos
async function getDbStats() {
  const client = await pool.connect();
  try {
    const stats = {};
    
    // Total de personas registradas
    const totalUsers = await client.query('SELECT COUNT(*) as total FROM personas');
    stats.totalUsuarios = totalUsers.rows[0].total;

    // Últimos usuarios registrados
    const lastUsers = await client.query(`
      SELECT 
        primer_nombre, 
        apellidos, 
        fecha_nacimiento,
        genero,
        correo_electronico
      FROM personas 
      ORDER BY id DESC 
      LIMIT 5
    `);
    stats.ultimosRegistros = lastUsers.rows;

    // Estadísticas de edad
    const ageStats = await client.query(`
      SELECT 
        MIN(DATE_PART('year', AGE(fecha_nacimiento))) as edad_minima,
        MAX(DATE_PART('year', AGE(fecha_nacimiento))) as edad_maxima,
        ROUND(AVG(DATE_PART('year', AGE(fecha_nacimiento)))::numeric, 2) as edad_promedio,
        MODE() WITHIN GROUP (ORDER BY DATE_PART('year', AGE(fecha_nacimiento))) as edad_mas_comun
      FROM personas
    `);
    stats.estadisticasEdad = ageStats.rows[0];

    // Distribución por género
    const genderStats = await client.query(`
      SELECT 
        genero, 
        COUNT(*) as cantidad,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM personas))::numeric, 2) as porcentaje
      FROM personas 
      GROUP BY genero
      ORDER BY cantidad DESC
    `);
    stats.distribucionGenero = genderStats.rows;

    // Distribución por rango de edad
    const ageRangeStats = await client.query(`
      SELECT 
        CASE 
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) < 18 THEN 'Menores de 18'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 18 AND 30 THEN '18-30'
          WHEN DATE_PART('year', AGE(fecha_nacimiento)) BETWEEN 31 AND 50 THEN '31-50'
          ELSE 'Mayores de 50'
        END as rango_edad,
        COUNT(*) as cantidad
      FROM personas 
      GROUP BY rango_edad
      ORDER BY rango_edad
    `);
    stats.distribucionEdad = ageRangeStats.rows;

    return stats;
  } finally {
    client.release();
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error middleware:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        details: err.message
    });
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta principal para consultas
app.post('/query', async (req, res) => {
    try {
        console.log('Recibida petición POST /query');
        console.log('Body:', req.body);
        
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido' });
        }

        // Obtener estadísticas actuales
        const stats = await getDbStats();
        
        // Crear contexto para Gemini
        const context = `
          Eres un asistente especializado en analizar datos de un sistema de registro de personas.
          Tienes acceso a las siguientes estadísticas actualizadas del sistema:

          1. Total de usuarios registrados: ${stats.totalUsuarios}

          2. Últimos registros:
          ${JSON.stringify(stats.ultimosRegistros, null, 2)}

          3. Estadísticas de edad:
          - Edad mínima: ${stats.estadisticasEdad.edad_minima} años
          - Edad máxima: ${stats.estadisticasEdad.edad_maxima} años
          - Edad promedio: ${stats.estadisticasEdad.edad_promedio} años
          - Edad más común: ${stats.estadisticasEdad.edad_mas_comun} años

          4. Distribución por género:
          ${stats.distribucionGenero.map(g => 
            `- ${g.genero}: ${g.cantidad} personas (${g.porcentaje}%)`
          ).join('\n')}

          5. Distribución por rango de edad:
          ${stats.distribucionEdad.map(r => 
            `- ${r.rango_edad}: ${r.cantidad} personas`
          ).join('\n')}

          Por favor, responde la siguiente pregunta de manera clara y concisa, usando estos datos específicos:
          ${prompt}
        `;

        // Generar respuesta con Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(context);
        const response = await result.response;

        res.json({ 
            response: response.text(),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error procesando consulta:', error);
        res.status(500).json({ 
            error: 'Error procesando la consulta',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servicio Gemini escuchando en puerto ${PORT} - ${new Date().toISOString()}`);
});