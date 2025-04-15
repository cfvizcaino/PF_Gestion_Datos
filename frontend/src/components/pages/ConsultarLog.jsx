import React, { useState } from "react";
import LogSearchForm from "../forms/LogSearchForm";

const ConsultarLog = () => {
  const [searchParams, setSearchParams] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoOperacion: "",
    numeroDocumento: ""
  });
  
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = (params) => {
    setIsLoading(true);
    setSearchParams(params);
    
    // Simulate API call
    setTimeout(() => {
      setLogs([
        {
          id: "log1",
          operacion: "crear",
          numeroDocumento: "1234567890",
          tipoDocumento: "Cédula",
          fecha: "2023-04-12T14:30:45",
          usuario: "admin",
          detalles: { persona: { primerNombre: "Juan", apellidos: "Pérez" } }
        },
        {
          id: "log2",
          operacion: "consultar",
          numeroDocumento: "1234567890",
          tipoDocumento: "Cédula",
          fecha: "2023-04-13T10:15:22",
          usuario: "user1",
          detalles: { }
        },
        {
          id: "log3",
          operacion: "modificar",
          numeroDocumento: "1234567890",
          tipoDocumento: "Cédula",
          fecha: "2023-04-14T09:45:12",
          usuario: "admin",
          detalles: { cambios: { correoElectronico: "nuevo@email.com" } }
        }
      ]);
      setIsLoading(false);
    }, 1000);
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
                  <td>{log.tipoDocumento} {log.numeroDocumento}</td>
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
      
      {!isLoading && logs.length === 0 && searchParams.fechaInicio && (
        <div className="no-results">
          No se encontraron registros para los criterios de búsqueda especificados.
        </div>
      )}
    </div>
  );
};

export default ConsultarLog;