import React, { useState } from "react";
import "../../styles/forms.css";

const PersonaForm = ({
  initialData = {},
  readOnly = false,
  submitButtonText = "Guardar",
  onSubmit,
  disableNumeroDocumento = false // <-- Agrega esto
}) => {
  const [formData, setFormData] = useState({
    primerNombre: initialData.primerNombre || "",
    segundoNombre: initialData.segundoNombre || "",
    apellidos: initialData.apellidos || "",
    fechaNacimiento: initialData.fechaNacimiento || "",
    genero: initialData.genero || "",
    correoElectronico: initialData.correoElectronico || "",
    celular: initialData.celular || "",
    numeroDocumento: initialData.numeroDocumento || "",
    tipoDocumento: initialData.tipoDocumento || "",
    foto: null
  });
  
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "foto" && files && files[0]) {
      // Handle file selection (photo preview)
      const file = files[0];
      setFormData({...formData, foto: file});
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({...formData, [name]: value});
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar el formulario aquí si es necesario
    
    // Si hay una función onSubmit proporcionada por el padre, llamarla con los datos del formulario
    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="persona-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="primerNombre">Primer Nombre:</label>
        <input
          id="primerNombre"
          name="primerNombre"
          type="text"
          value={formData.primerNombre}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.primerNombre ? "error" : ""}
          maxLength={30}
          required
        />
        {errors.primerNombre && <span className="error-message">{errors.primerNombre}</span>}
        <small>Solo letras, máximo 30 caracteres</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="segundoNombre">Segundo Nombre:</label>
        <input
          id="segundoNombre"
          name="segundoNombre"
          type="text"
          value={formData.segundoNombre}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.segundoNombre ? "error" : ""}
          maxLength={30}
        />
        {errors.segundoNombre && <span className="error-message">{errors.segundoNombre}</span>}
        <small>Solo letras, máximo 30 caracteres</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="apellidos">Apellidos:</label>
        <input
          id="apellidos"
          name="apellidos"
          type="text"
          value={formData.apellidos}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.apellidos ? "error" : ""}
          maxLength={60}
          required
        />
        {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}
        <small>Solo letras, máximo 60 caracteres</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          id="fechaNacimiento"
          name="fechaNacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.fechaNacimiento ? "error" : ""}
          required
        />
        {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="genero">Género:</label>
        <select
          id="genero"
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.genero ? "error" : ""}
          required
        >
          <option value="">Seleccionar...</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="No binario">No binario</option>
          <option value="Prefiero no reportar">Prefiero no reportar</option>
        </select>
        {errors.genero && <span className="error-message">{errors.genero}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="correoElectronico">Correo electrónico:</label>
        <input
          id="correoElectronico"
          name="correoElectronico"
          type="email"
          value={formData.correoElectronico}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.correoElectronico ? "error" : ""}
          required
        />
        {errors.correoElectronico && <span className="error-message">{errors.correoElectronico}</span>}
        <small>Ingrese un correo electrónico válido</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="celular">Celular:</label>
        <input
          id="celular"
          name="celular"
          type="tel"
          value={formData.celular}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.celular ? "error" : ""}
          maxLength={10}
          pattern="[0-9]{10}"
          required
        />
        {errors.celular && <span className="error-message">{errors.celular}</span>}
        <small>Ingrese 10 dígitos numéricos</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="tipoDocumento">Tipo de documento:</label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          value={formData.tipoDocumento}
          onChange={handleChange}
          disabled={readOnly}
          className={errors.tipoDocumento ? "error" : ""}
          required
        >
          <option value="">Seleccionar...</option>
          <option value="Tarjeta de identidad">Tarjeta de identidad</option>
          <option value="Cédula">Cédula</option>
        </select>
        {errors.tipoDocumento && <span className="error-message">{errors.tipoDocumento}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="numeroDocumento">Nro. Documento:</label>
        <input
          id="numeroDocumento"
          name="numeroDocumento"
          type="text"
          value={formData.numeroDocumento}
          onChange={handleChange}
          disabled={readOnly || disableNumeroDocumento}
          className={errors.numeroDocumento ? "error" : ""}
          maxLength={10}
          pattern="[0-9]{1,10}"
          required
        />
        {errors.numeroDocumento && <span className="error-message">{errors.numeroDocumento}</span>}
        <small>Ingrese máximo 10 dígitos numéricos</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="foto">Foto:</label>
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={readOnly}
          className={errors.foto ? "error" : ""}
        />
        {errors.foto && <span className="error-message">{errors.foto}</span>}
        <small>Tamaño máximo: 2MB</small>
        
        {(photoPreview || (readOnly && initialData.foto)) && (
          <div className="photo-preview">
            <img
              src={
                photoPreview
                  ? photoPreview
                  : `data:image/jpeg;base64,${initialData.foto}`
              }
              alt="Vista previa"
            />
          </div>
        )}
      </div>
      
      {!readOnly && (
        <div className="form-actions">
          <button type="submit" className="btn-primary">{submitButtonText}</button>
          <button type="reset" className="btn-secondary">Limpiar</button>
        </div>
      )}
    </form>
  );
};

export default PersonaForm;