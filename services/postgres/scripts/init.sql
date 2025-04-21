-- Habilitar la extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla para almacenar datos personales
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(30) NOT NULL,
    segundo_nombre VARCHAR(30),
    apellidos VARCHAR(60) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    celular CHAR(10) NOT NULL,
    nro_documento CHAR(10) NOT NULL UNIQUE,
    tipo_documento VARCHAR(20) NOT NULL,
    foto BYTEA,
    embedding VECTOR(1536) -- Para almacenar embeddings generados por el LLM
);

-- Tabla para registrar logs
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    operacion VARCHAR(20) NOT NULL,
    nro_documento CHAR(10),
    tipo_documento VARCHAR(20),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario VARCHAR(50),
    detalles JSONB
);

-- Índice de similitud para búsquedas vectoriales (para el RAG)
CREATE INDEX ON personas USING hnsw (embedding vector_cosine_ops);