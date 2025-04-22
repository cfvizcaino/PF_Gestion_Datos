import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/crear", label: "Crear Personas" },
    { path: "/modificar", label: "Modificar Datos Personales" },
    { path: "/consultar", label: "Consultar Datos Personales" },
    { path: "/consulta-nl", label: "Consultar Datos personales – Lenguaje Natural" },
    { path: "/eliminar", label: "Borrar Personas" },
    { path: "/logs", label: "Consultar log" },
  ];

  return (
    <nav className="sidebar">
      <ul className="menu">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Inicio</Link>
        </li>
        {menuItems.map((item) => (
          <li 
            key={item.path} 
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;