import React, { useState } from "react";
import LogSearchForm from "../forms/LogSearchForm";
import axios from "axios";

const ConsultarLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (params) => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/personas/logs');
      setLogs(response.data);
    } catch (error) {
      setLogs([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="page-container">
      <h2>Consultar Log de Operaciones</h2>
      <p className="page-description">
        Busque registros de operaciones por fecha, tipo de operación y/o documento.
      </p>
      <LogSearchForm onSearch={handleSearch} />
      {isLoading && <div className="loading">Buscando logs...</div>}
      {logs.length > 0 && (
        <div className="logs-results">
          <h3>Resultados ({logs.length} registros encontrados)</h3>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Operación</th>
                <th>Documento</th>
                <th>Usuario</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.fecha).toLocaleString()}</td>
                  <td className={`operation-${log.operacion}`}>
                    {log.operacion.charAt(0).toUpperCase() + log.operacion.slice(1)}
                  </td>
                  <td>{log.tipo_documento} {log.nro_documento}</td>
                  <td>{log.usuario}</td>
                  <td>
                    <button className="btn-small" onClick={() => alert(JSON.stringify(log.detalles, null, 2))}>
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && logs.length === 0 && (
        <div className="no-results">
          No se encontraron registros para los criterios de búsqueda especificados.
        </div>
      )}
    </div>
  );
};

export default ConsultarLog;