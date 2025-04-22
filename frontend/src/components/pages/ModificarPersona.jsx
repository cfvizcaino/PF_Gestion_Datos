import React, { useState } from "react";
import PersonaForm from "../forms/PersonaForm";
import SearchForm from "../forms/SearchForm";
import axios from "axios";

const ModificarPersona = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const handleSearch = async (searchData) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
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
        foto: response.data.foto || null,
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
  
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setMessage(null);

    // Convierte la foto a base64 si existe
    const fotoBase64 = await fileToBase64(formData.foto);

    const personaData = {
      primer_nombre: formData.primerNombre,
      segundo_nombre: formData.segundoNombre,
      apellidos: formData.apellidos,
      fecha_nacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      correo_electronico: formData.correoElectronico,
      celular: formData.celular,
      tipo_documento: formData.tipoDocumento,
      nro_documento: formData.numeroDocumento,
      foto: fotoBase64, // <-- Aquí sí se envía la foto
    };

    try {
      // Llamar a la API para actualizar la persona
      const response = await axios.put(`/api/personas/modificar/${formData.numeroDocumento}`, personaData);
      
      setMessage({
        type: "success",
        text: "Datos actualizados correctamente"
      });
      
      console.log("Persona actualizada:", response.data);
    } catch (error) {
      console.error("Error al actualizar persona:", error);
      let msg = "Error al actualizar los datos personales";
      if (error.response?.status === 404) {
        msg = "No se encontró ninguna persona con ese número de documento";
      }
      setMessage({
        type: "error",
        text: msg
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Convierte un File a base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="page-container">
      <h2>Modificar Datos Personales</h2>
      <p className="page-description">
        Busque la persona por número de documento para modificar sus datos.
      </p>
      
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && <div className="loading">Procesando...</div>}
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}
      
      {searchResult && !isLoading && (
        <>
          <h3>Modificar datos de {searchResult.primerNombre} {searchResult.apellidos}</h3>
          <PersonaForm 
            initialData={searchResult} 
            submitButtonText="Actualizar Datos" 
            onSubmit={handleSubmit}
            disableNumeroDocumento={true}
          />
        </>
      )}
    </div>
  );
};

export default ModificarPersona;