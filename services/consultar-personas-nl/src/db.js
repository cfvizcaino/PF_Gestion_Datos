const { Pool } = require('pg');

// Configurar la conexión con PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'gestion_datos',
  port: process.env.DB_PORT || 5432,
});

// Inicializar pgvector cuando se conecte
const initPgVector = async () => {
  const client = await pool.connect();
  try {
    // Verificar si la extensión pgvector está instalada
    const existsResult = await client.query(
      `SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
      );`
    );
    
    // Si no existe, instalarla
    if (!existsResult.rows[0].exists) {
      console.log('Instalando extensión pgvector...');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('Extensión pgvector instalada correctamente');
    }
    
    // Verificar si existe la tabla de embeddings
    const tableExists = await client.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'persona_embeddings'
      );`
    );
    
    // Si no existe la tabla de embeddings, crearla
    if (!tableExists.rows[0].exists) {
      console.log('Creando tabla de embeddings...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS persona_embeddings (
          id SERIAL PRIMARY KEY,
          nro_documento VARCHAR(20) NOT NULL,
          content TEXT NOT NULL,
          embedding vector(1536) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (nro_documento) REFERENCES personas(nro_documento) ON DELETE CASCADE
        );
      `);
      console.log('Tabla de embeddings creada correctamente');
      
      // Crear índice para búsqueda por similitud
      await client.query(`
        CREATE INDEX IF NOT EXISTS persona_embeddings_idx ON persona_embeddings 
        USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
      `);
      console.log('Índice para búsqueda vectorial creado correctamente');
    }
    
    console.log('pgvector inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar pgvector:', error);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initPgVector
};