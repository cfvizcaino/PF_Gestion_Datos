const { OpenAI } = require('openai');
const { pool } = require('./db');

// Inicializar OpenAI con la API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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', // Obtener de variables de entorno
});

// Función para generar embeddings usando OpenAI
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error al generar embedding:', error);
    throw error;
  }
}

// Función para actualizar los embeddings de todas las personas
async function updateAllEmbeddings() {
  const client = await pool.connect();
  try {
    console.log('Iniciando actualización de embeddings...');
    
    // Obtener todas las personas
    const personasResult = await client.query(`
      SELECT * FROM personas ORDER BY id
    `);
    
    for (const persona of personasResult.rows) {
      // Crear texto descriptivo de la persona
      const personaText = `
        Nombre: ${persona.primer_nombre} ${persona.segundo_nombre || ''} ${persona.apellidos}
        Documento: ${persona.tipo_documento} ${persona.nro_documento}
        Fecha de nacimiento: ${new Date(persona.fecha_nacimiento).toLocaleDateString()}
        Género: ${persona.genero === 'M' ? 'Masculino' : 'Femenino'}
        Correo: ${persona.correo_electronico}
        Celular: ${persona.celular}
      `;
      
      // Generar embedding
      const embedding = await generateEmbedding(personaText);
      
      // Verificar si ya existe un embedding para esta persona
      const existingEmbedding = await client.query(`
        SELECT id FROM persona_embeddings WHERE nro_documento = $1
      `, [persona.nro_documento]);
      
      if (existingEmbedding.rows.length > 0) {
        // Actualizar embedding existente
        await client.query(`
          UPDATE persona_embeddings 
          SET content = $1, embedding = $2, created_at = CURRENT_TIMESTAMP 
          WHERE nro_documento = $3
        `, [personaText, embedding, persona.nro_documento]);
      } else {
        // Crear nuevo embedding
        await client.query(`
          INSERT INTO persona_embeddings (nro_documento, content, embedding)
          VALUES ($1, $2, $3)
        `, [persona.nro_documento, personaText, embedding]);
      }
      
      console.log(`Embedding actualizado para ${persona.primer_nombre} ${persona.apellidos}`);
    }
    
    console.log('Todos los embeddings han sido actualizados correctamente');
    return { message: 'Embeddings actualizados', count: personasResult.rows.length };
  } catch (error) {
    console.error('Error al actualizar embeddings:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Función para realizar búsqueda semántica de personas
async function searchPersonas(query, limit = 5) {
  try {
    // Generar embedding para la consulta
    const queryEmbedding = await generateEmbedding(query);
    
    // Realizar búsqueda por similitud usando el producto punto
    const result = await pool.query(`
      WITH similarity_search AS (
        SELECT 
          pe.nro_documento,
          pe.content,
          p.primer_nombre,
          p.segundo_nombre,
          p.apellidos,
          p.fecha_nacimiento,
          p.genero,
          p.tipo_documento,
          1 - (pe.embedding <=> $1) AS similarity
        FROM 
          persona_embeddings pe
          JOIN personas p ON pe.nro_documento = p.nro_documento
        ORDER BY 
          similarity DESC
        LIMIT $2
      )
      SELECT * FROM similarity_search WHERE similarity > 0.7
    `, [queryEmbedding, limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error en búsqueda semántica:', error);
    throw error;
  }
}

// Función para generar una respuesta a una consulta en lenguaje natural
async function generateNaturalLanguageResponse(query) {
  try {
    // Buscar personas relevantes a la consulta
    const relevantPersonas = await searchPersonas(query, 5);
    
    if (relevantPersonas.length === 0) {
      return {
        answer: "No encontré información relevante para responder a tu pregunta.",
        confidence: 0.1,
        sources: []
      };
    }
    
    // Preparar contexto para OpenAI con la información encontrada
    let context = "Información de las personas más relevantes:\n\n";
    const sources = [];
    
    relevantPersonas.forEach(persona => {
      context += persona.content + "\n\n";
      sources.push(`${persona.primer_nombre} ${persona.apellidos} (${persona.tipo_documento}: ${persona.nro_documento})`);
    });
    
    // Generar respuesta usando OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente especializado en responder preguntas sobre personas basándote únicamente en la información proporcionada. Responde de manera concisa y precisa." },
        { role: "user", content: `Basándote en la siguiente información:\n\n${context}\n\nResponde a esta pregunta: ${query}` }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    // Calcular confianza basada en la similitud promedio
    const avgConfidence = relevantPersonas.reduce((sum, p) => sum + p.similarity, 0) / relevantPersonas.length;
    
    return {
      answer: response.choices[0].message.content.trim(),
      confidence: avgConfidence,
      sources: sources
    };
  } catch (error) {
    console.error('Error al generar respuesta en lenguaje natural:', error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  updateAllEmbeddings,
  searchPersonas,
  generateNaturalLanguageResponse
};