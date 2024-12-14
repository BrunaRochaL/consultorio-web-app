import { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { path: "/pacientes", icon: "bi-people", label: "Pacientes" },
  { path: "/consultas", icon: "bi-calendar", label: "Consultas" },
  { path: "/relatorios", icon: "bi-file-text", label: "Relatórios" },
  { path: "/configuracoes", icon: "bi-gear", label: "Configurações" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar bg-light ${isCollapsed ? "collapsed" : ""}`}>
      <Nav className="flex-column">
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i
              className={`bi ${
                isCollapsed
                  ? "bi-chevron-double-right"
                  : "bi-chevron-double-left"
              }`}
            ></i>
          </button>
        </div>
        {menuItems.map((item) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <i className={`bi ${item.icon}`}></i>
            <span className="menu-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
