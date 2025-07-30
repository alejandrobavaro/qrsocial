// ===============================
// Componente Header
// Muestra el encabezado con navegación, logo y botones de acceso
// Se comunica con: AuthContext para saber si hay usuario logueado
// Redirige con useNavigate según el estado de autenticación
// ===============================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ===============================
// Importación de iconos
// ===============================
import {
  BsHouseDoor,
  BsSearch,
  BsPlusSquare,
  BsHeart,
  BsPerson,
  BsQrCode,
  BsPeople,
  BsGear,
  BsBoxArrowRight
} from "react-icons/bs";

// ===============================
// Contexto de autenticación
// ===============================
import { useAuth } from "../context/AuthContext";

// ===============================
// Estilos del header
// ===============================
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  // ===============================
  // Hooks de estado y navegación
  // ===============================
  const { currentUser, logout } = useAuth(); // contexto de autenticación
  const navigate = useNavigate(); // redirección entre rutas
  const [showDropdown, setShowDropdown] = useState(false); // menú avatar

  // ===============================
  // Función para cerrar sesión
  // ===============================
  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  // ===============================
  // Alterna visibilidad del menú del avatar
  // ===============================
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // ===============================
  // Render del componente Header
  // ===============================
  return (
    <header className="instagram-header">
      <div className="header-container">

        {/* ========= LOGO + LINK AL FEED ========= */}
        <Link to={currentUser ? "/feed" : "/"} className="header-logo">
          <img
            src="/img/02-logos/logoqrsocial11a.png"
            alt="QR Social"
            className="logo-img"
          />
        </Link>

        {/* ========= BARRA DE BÚSQUEDA (solo desktop) ========= */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar" 
            className="search-input"
          />
        </div>

        {/* ========= USUARIO AUTENTICADO ========= */}
        {currentUser ? (
          <div className="nav-container">

            {/* ======== NAV CON ICONOS ======== */}
            <nav className="main-nav">
              <Link to="/feed" className="nav-icon">
                <BsHouseDoor />
              </Link>

              <Link to="/search" className="nav-icon mobile-only">
                <BsSearch />
              </Link>

              <Link to="/create" className="nav-icon">
                <BsPlusSquare />
              </Link>

              <Link to="/notifications" className="nav-icon">
                <BsHeart />
              </Link>

              {currentUser.role === "admin" && (
                <Link to="/admin" className="nav-icon">
                  <BsGear />
                </Link>
              )}
            </nav>

            {/* ======== AVATAR + DROPDOWN ======== */}
            <div className="user-section">
              <div
                className="user-avatar-container"
                onClick={toggleDropdown}
              >
                <img 
                  src={currentUser.avatar || "/img/default-avatar.png"}
                  alt={currentUser.name}
                  className="user-avatar"
                />
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile/current" className="dropdown-item">
                    <BsPerson /> Mi perfil
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <BsBoxArrowRight /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========= USUARIO NO AUTENTICADO ========= */
          <div className="auth-options">
            <button 
              onClick={() => navigate("/login")} 
              className="auth-btn primary-btn"
            >
              <BsQrCode /> QR Personal 
            </button>
            {/* <button 
              onClick={() => navigate("/login?guest=true")} 
              className="auth-btn secondary-btn"
            >
              <BsPeople /> Manual
            </button> */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
