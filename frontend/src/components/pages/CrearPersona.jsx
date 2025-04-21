import React, { useState } from "react";
import PersonaForm from "../forms/PersonaForm";
import axios from "axios";

const CrearPersona = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setMessage(null);

      // Preparar los datos para la API siguiendo la estructura del backend
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
      };

      // Llamar a la API para crear la persona
      const response = await axios.post('/api/personas/', personaData);
      
      setMessage({
        type: "success",
        text: "Persona creada exitosamente"
      });
      
      console.log("Persona creada:", response.data);
    } catch (error) {
      console.error("Error al crear persona:", error);
      let errorMsg = "Error al crear la persona";
      // Detectar error de cédula duplicada
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data.error === "string" &&
        (
          error.response.data.error.includes("duplicate key") ||
          error.response.data.error.includes("ya existe") ||
          error.response.data.error.includes("unique constraint")
        )
      ) {
        errorMsg = "La cédula ya se encuentra registrada";
      }
      setMessage({
        type: "error",
        text: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Crear Persona</h2>
      <p className="page-description">
        Complete el formulario para registrar una nueva persona en el sistema.
      </p>

      {isLoading && <div className="loading">Guardando datos...</div>}

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {!isLoading && (
        <PersonaForm submitButtonText="Crear Persona" onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default CrearPersona;