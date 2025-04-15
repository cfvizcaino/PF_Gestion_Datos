import React from "react";
import PersonaForm from "../forms/PersonaForm";

const CrearPersona = () => {
  return (
    <div className="page-container">
      <h2>Crear Persona</h2>
      <p className="page-description">
        Complete el formulario para registrar una nueva persona en el sistema.
      </p>
      <PersonaForm submitButtonText="Crear Persona" />
    </div>
  );
};

export default CrearPersona;