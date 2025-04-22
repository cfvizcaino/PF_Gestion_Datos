import React, { useState } from "react";
import SearchForm from "../forms/SearchForm";
import axios from "axios";

const EliminarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleSearch = async (searchData) => {
    setIsLoading(true);
    setMessage(null);
    setConfirmDelete(false);
    
    try {
      const response = await axios.get(`/api/personas/consultar${searchData.numeroDocumento}`);
      
      // Transformar la respuesta al formato esperado por el componente
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
        numeroDocumento: response.data.nro_documento
      };
      
      setSearchResult(personaData);
    } catch (error) {
      console.error("Error al buscar persona:", error);
      setMessage({
        type: "error",
        text: error.response?.status === 404
          ? "No se encontró ninguna persona con ese número de documento"
          : "Error al buscar la persona"
      });
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setIsLoading(true);
    
    try {
      // Llamar a la API para eliminar la persona
      await axios.delete(`/api/personas/borrar${searchResult.numeroDocumento}`);
      
      setMessage({
        type: "success",
        text: `Se ha eliminado a ${searchResult.primerNombre} ${searchResult.apellidos} del sistema correctamente.`
      });
      setSearchResult(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error al eliminar persona:", error);
      setMessage({
        type: "error",
        text: "Error al eliminar la persona del sistema."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <h2>Borrar Personas</h2>
      <p className="page-description">
        Busque la persona por número de documento para eliminarla del sistema.
      </p>
      
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Procesando...</div>}
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}
      
      {searchResult && !confirmDelete && (
        <div className="search-result-card">
          <h3>Persona encontrada:</h3>
          <p>
            <strong>Nombre:</strong> {searchResult.primerNombre} {searchResult.segundoNombre} {searchResult.apellidos}<br />
            <strong>Documento:</strong> {searchResult.tipoDocumento} {searchResult.numeroDocumento}<br />
            <strong>Fecha de nacimiento:</strong> {new Date(searchResult.fechaNacimiento).toLocaleDateString()}
          </p>
          
          <button 
            className="btn-danger" 
            onClick={() => setConfirmDelete(true)}
          >
            Eliminar esta persona
          </button>
        </div>
      )}
      
      {confirmDelete && (
        <div className="confirm-delete">
          <h3>Confirmar eliminación</h3>
          <p>
            ¿Está seguro que desea eliminar a <strong>{searchResult.primerNombre} {searchResult.apellidos}</strong> del sistema?
            <br />
            Esta acción no se puede deshacer.
          </p>
          
          <div className="confirm-actions">
            <button className="btn-danger" onClick={handleDelete}>
              Sí, eliminar
            </button>
            <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarPersona;