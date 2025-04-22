import React, { useState } from "react";

const SearchForm = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
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
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="tipoDocumento">Tipo de documento:</label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          value={searchData.tipoDocumento}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar...</option>
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
          maxLength={10}
          pattern="[0-9]{1,10}"
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn-primary">Buscar</button>
      </div>
    </form>
  );
};

export default SearchForm;