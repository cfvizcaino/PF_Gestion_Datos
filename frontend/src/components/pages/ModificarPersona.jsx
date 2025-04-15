import React, { useState } from "react";
import PersonaForm from "../forms/PersonaForm";
import SearchForm from "../forms/SearchForm";

const ModificarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = (searchData) => {
    // This would connect to your backend in the real implementation
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResult({
        primerNombre: "Juan",
        segundoNombre: "Carlos",
        apellidos: "Rodríguez Pérez",
        fechaNacimiento: "1990-05-15",
        genero: "Masculino",
        correoElectronico: "juancarlos@example.com",
        celular: "3001234567",
        tipoDocumento: "Cédula",
        numeroDocumento: "1234567890"
      });
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="page-container">
      <h2>Modificar Datos Personales</h2>
      <p className="page-description">
        Busque la persona por número de documento para modificar sus datos.
      </p>
      
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Buscando...</div>}
      
      {searchResult && (
        <>
          <h3>Modificar datos de {searchResult.primerNombre} {searchResult.apellidos}</h3>
          <PersonaForm initialData={searchResult} submitButtonText="Actualizar Datos" />
        </>
      )}
    </div>
  );
};

export default ModificarPersona;