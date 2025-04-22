// filepath: c:\Users\57304\Documents\PF_Gestion_Datos\services\borrar-personas\src\db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'gestion_datos',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;