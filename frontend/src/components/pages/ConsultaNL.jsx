import React, { useState } from "react";
import axios from "axios";

const ConsultaNL = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Enviando consulta:', query);

      const response = await axios.post('/api/services/gemini/query', {
        prompt: query
      }, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data && response.data.response) {
        setResult({
          answer: response.data.response,
          confidence: 0.92,
          sources: ["Base de datos de personal"]
        });
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      setError(
        error.response?.data?.error || 
        error.message || 
        "Error al procesar la consulta"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <h2>Consulta en Lenguaje Natural</h2>
      <p className="page-description">
        Realice preguntas en lenguaje natural sobre los datos de las personas registradas.
        El sistema utilizará IA para responder.
      </p>
      
      <div className="nl-query-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="query">Pregunta:</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: ¿Cuál es el empleado más joven registrado?"
              className="query-input"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? 'Procesando...' : 'Consultar'}
            </button>
          </div>
        </form>
        
        {isLoading && (
          <div className="loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Procesando consulta...</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        {result && (
          <div className="query-result">
            <h3>Respuesta:</h3>
            <div className="answer">{result.answer}</div>
            
            <div className="result-metadata">
              <div className="confidence">
                <span>Confianza:</span> {(result.confidence * 100).toFixed(1)}%
              </div>
              
              <div className="sources">
                <h4>Fuentes:</h4>
                <ul>
                  {result.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaNL;