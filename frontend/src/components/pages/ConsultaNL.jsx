import React, { useState } from "react";

const ConsultaNL = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call to RAG system
    setTimeout(() => {
      setResult({
        answer: "Pedro Pérez es el empleado más joven registrado. Nació el 15 de marzo de 2000 y tiene 25 años.",
        confidence: 0.92,
        sources: ["Registro de empleados", "Base de datos de personal"]
      });
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="page-container">
      <h2>Consulta en Lenguaje Natural</h2>
      <p className="page-description">
        Realice preguntas en lenguaje natural sobre los datos de las personas registradas.
        El sistema utilizará RAG (Retrieval Augmented Generation) para responder.
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
            <button type="submit" className="btn-primary">Consultar</button>
          </div>
        </form>
        
        {isLoading && <div className="loading">Procesando consulta...</div>}
        
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