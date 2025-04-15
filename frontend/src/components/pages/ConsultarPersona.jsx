import React, { useState } from "react";
import PersonaForm from "../forms/PersonaForm";
import SearchForm from "../forms/SearchForm";

const ConsultarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = (searchData) => {
    // This would connect to your backend in the real implementation
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      // Simulate finding a result
      setSearchResult({
        primerNombre: "Ana",
        segundoNombre: "María",
        apellidos: "González López",
        fechaNacimiento: "1985-08-22",
        genero: "Femenino",
        correoElectronico: "anamaria@example.com",
        celular: "3109876543",
        tipoDocumento: "Cédula",
        numeroDocumento: "9876543210"
      });
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="page-container">
      <h2>Consultar Datos Personales</h2>
      <p className="page-description">
        Busque la persona por número de documento para consultar sus datos.
      </p>
      
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Buscando...</div>}
      {error && <div className="error-message">{error}</div>}
      
      {searchResult && (
        <>
          <h3>Datos de {searchResult.primerNombre} {searchResult.apellidos}</h3>
          <PersonaForm initialData={searchResult} readOnly={true} />
        </>
      )}
    </div>
  );
};

export default ConsultarPersona;