// =============================================
// COMPONENTE HEADER - Versión Completa
// =============================================

/**
 * Propósito:
 * - Barra de navegación superior con estilo Instagram
 * - Mantener todas las funcionalidades originales
 * - Mostrar opciones según estado de autenticación
 * - Incluir: Logo, búsqueda, navegación, perfil y logout
 * 
 * Integraciones:
 * - AuthContext: Para datos de usuario y logout
 * - React Router: Para navegación
 * - React Icons: Para iconos visuales
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BsHouseDoor,  // Icono Inicio
  BsSearch,     // Icono Buscar
  BsPlusSquare, // Icono Crear
  BsHeart,      // Icono Notificaciones
  BsPerson,     // Icono Perfil
  BsQrCode,     // Icono QR
  BsPeople,     // Icono Invitados
  BsGear,       // Icono Admin
  BsBoxArrowRight // Icono Logout
} from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import "../assets/scss/_03-Componentes/_Header.scss";

const Header = () => {
  // ============ ESTADOS Y HOOKS ============
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // ============ MANEJADORES DE EVENTOS ============
  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // ============ RENDERIZADO ============
  return (
    <header className="instagram-header">
      <div className="header-container">
        {/* Logo */}
        <Link to={currentUser ? "/feed" : "/"} className="header-logo">
          <h1>QR Social</h1>
        </Link>

        {/* Barra de búsqueda (solo desktop) */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar" 
            className="search-input"
          />
        </div>

        {/* Contenido según autenticación */}
        {currentUser ? (
          /* Usuario autenticado */
          <div className="nav-container">
            {/* Iconos de navegación principal */}
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

            {/* Avatar y menú desplegable */}
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

              {/* Menú desplegable */}
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link 
                    to="/profile/current" 
                    className="dropdown-item"
                  >
                    <BsPerson /> Mi perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item"
                  >
                    <BsBoxArrowRight /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Usuario no autenticado */
          <div className="auth-options">
            <button 
              onClick={() => navigate("/login")} 
              className="auth-btn primary-btn"
            >
              <BsQrCode /> Ingresar con QR
            </button>
            <button 
              onClick={() => navigate("/login?guest=true")} 
              className="auth-btn secondary-btn"
            >
              <BsPeople /> Acceso Invitado
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;