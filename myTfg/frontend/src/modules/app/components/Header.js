import { useState } from "react";
import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFlag,
  faUserGroup,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/Header.css";

const menuItems = [
  { label: "Prioridades", icon: faFlag, path: "/priorities" },
  { label: "Residentes", icon: faUserGroup, path: "/staff" }
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top bg-white border App-header shadow-sm">
      {/* Logo + Botón menú */}
      <div className="logo d-flex align-items-center">
        <button className="menu-button me-3" onClick={handleOpenDrawer}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          MedShift
        </Link>
      </div>

      {/* Links desktop */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul className="navbar-nav">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link className="nav-link d-flex align-items-center" to={item.path}>
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Drawer móvil */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleCloseDrawer}>
        <div className="drawer-content p-3" style={{ width: 250 }}>
          {/* Encabezado con logo grande y botón cerrar */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2
              className="text-primary mb-0"
              style={{ cursor: "pointer" }}
              onClick={handleCloseDrawer}
            >
              MedShift
            </h2>
            <button
              onClick={handleCloseDrawer}
              style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "1.5rem" }}
            >
              &times;
            </button>
          </div>

          {/* Lista de items */}
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={handleCloseDrawer}
                component={Link}
                to={item.path}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  );
};

export default Header;
