import React, { useState } from "react";
import SearchForm from "../forms/SearchForm";

const EliminarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleSearch = (searchData) => {
    setIsLoading(true);
    setMessage(null);
    setConfirmDelete(false);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResult({
        primerNombre: "Carlos",
        segundoNombre: "",
        apellidos: "Martínez Sánchez",
        fechaNacimiento: "1978-11-30",
        tipoDocumento: searchData.tipoDocumento,
        numeroDocumento: searchData.numeroDocumento
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDelete = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: `Se ha eliminado a ${searchResult.primerNombre} ${searchResult.apellidos} del sistema correctamente.`
      });
      setSearchResult(null);
      setConfirmDelete(false);
      setIsLoading(false);
    }, 1500);
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