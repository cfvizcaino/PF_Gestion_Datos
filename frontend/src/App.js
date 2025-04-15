import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import CrearPersona from "./components/pages/CrearPersona";
import ModificarPersona from "./components/pages/ModificarPersona";
import ConsultarPersona from "./components/pages/ConsultarPersona";
import ConsultaNL from "./components/pages/ConsultaNL";
import EliminarPersona from "./components/pages/EliminarPersona";
import ConsultarLog from "./components/pages/ConsultarLog";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear" element={<CrearPersona />} />
          <Route path="/modificar" element={<ModificarPersona />} />
          <Route path="/consultar" element={<ConsultarPersona />} />
          <Route path="/consulta-nl" element={<ConsultaNL />} />
          <Route path="/eliminar" element={<EliminarPersona />} />
          <Route path="/logs" element={<ConsultarLog />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h2>Bienvenido al Sistema de Gestión de Datos Personales</h2>
      <p>Seleccione una opción del menú para comenzar.</p>
    </div>
  );
}

export default App;
