import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/layout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;