import React, { useState } from "react";

const LogSearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoOperacion: "",
    tipoDocumento: "",
    numeroDocumento: ""
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };
  
  return (
    <form className="log-search-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha desde:</label>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            value={searchData.fechaInicio}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="fechaFin">Fecha hasta:</label>
          <input
            id="fechaFin"
            name="fechaFin"
            type="date"
            value={searchData.fechaFin}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipoOperacion">Tipo de operación:</label>
          <select
            id="tipoOperacion"
            name="tipoOperacion"
            value={searchData.tipoOperacion}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="crear">Crear</option>
            <option value="modificar">Modificar</option>
            <option value="consultar">Consultar</option>
            <option value="eliminar">Eliminar</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="tipoDocumento">Tipo de documento:</label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            value={searchData.tipoDocumento}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="Tarjeta de identidad">Tarjeta de identidad</option>
            <option value="Cédula">Cédula</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="numeroDocumento">Número de documento:</label>
          <input
            id="numeroDocumento"
            name="numeroDocumento"
            type="text"
            value={searchData.numeroDocumento}
            onChange={handleChange}
            placeholder="(Opcional)"
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">Buscar Logs</button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setSearchData({
            fechaInicio: "",
            fechaFin: "",
            tipoOperacion: "",
            tipoDocumento: "",
            numeroDocumento: ""
          })}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default LogSearchForm;