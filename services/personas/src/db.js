const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'postgres-db',
  database: process.env.DB_NAME || 'gestion_datos',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Implementar función de reconexión
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      const client = await pool.connect();
      console.log('✅ Conexión a PostgreSQL establecida correctamente');
      client.release();
      return;
    } catch (err) {
      console.error(`❌ Intento de conexión fallido (${retries} intentos restantes):`, err.message);
      retries -= 1;
      // Esperar antes de reintentar
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Iniciar conexión con reintentos
connectWithRetry();

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

module.exports = pool;