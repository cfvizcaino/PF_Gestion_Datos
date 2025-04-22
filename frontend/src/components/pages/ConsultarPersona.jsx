import React, { useState } from "react";
import PersonaForm from "../forms/PersonaForm";
import SearchForm from "../forms/SearchForm";
import axios from "axios";

const ConsultarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSearch = async (searchData) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    
    try {
      // Llamar a la API para buscar la persona por número de documento
      const response = await axios.get(`/api/personas/consultar${searchData.numeroDocumento}`);
      
      // Transformar la respuesta al formato esperado por el componente PersonaForm
      const personaData = {
        primerNombre: response.data.primer_nombre,
        segundoNombre: response.data.segundo_nombre || "",
        apellidos: response.data.apellidos,
        fechaNacimiento: response.data.fecha_nacimiento
          ? response.data.fecha_nacimiento.slice(0, 10)
          : "",
        genero: response.data.genero,
        correoElectronico: response.data.correo_electronico,
        celular: response.data.celular,
        tipoDocumento: response.data.tipo_documento,
        numeroDocumento: response.data.nro_documento,
        foto: response.data.foto || null, // <-- añade esto para la foto
      };
      
      setSearchResult(personaData);
      setError(null);
    } catch (error) {
      console.error("Error al buscar persona:", error);
      setError(error.response?.status === 404 
        ? "No se encontró ninguna persona con ese número de documento" 
        : "Error al buscar la persona");
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <h2>Consultar Datos Personales</h2>
      <p className="page-description">
        Busque la persona por número de documento para consultar sus datos.
      </p>
      
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Buscando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
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