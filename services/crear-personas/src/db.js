const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'postgres-db',
  database: process.env.DB_NAME || 'gestion_datos',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;