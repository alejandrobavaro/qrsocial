// =============================================
// COMPONENTE LOGIN PAGE - Versión Completa
// =============================================

/**
 * PROPÓSITO PRINCIPAL:
 * - Página de autenticación para usuarios
 * - Ofrece dos métodos de acceso: QR y manual
 * - Incluye accesos rápidos para desarrollo
 * - Estilo visual consistente con Instagram
 * - 100% responsive (mobile-first)
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import QrLogin from './auth/QrLogin';
import '../assets/scss/_03-Componentes/_LoginPage.scss';

const LoginPage = () => {
  // ============ 1. HOOKS Y ESTADOS ============
  // Contexto de autenticación
  const { loginAsGuest } = useAuth();
  
  // Estados del componente
  const [showQrLogin, setShowQrLogin] = useState(true); // Controla qué formulario mostrar
  const [guestName, setGuestName] = useState(''); // Almacena nombre de invitado
  const [error, setError] = useState(null); // Maneja mensajes de error
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // ============ 2. MANEJADORES PRINCIPALES ============

  /**
   * 2.1 handleQuickAccess - Acceso rápido para desarrollo
   * @param {string} role - Tipo de usuario (admin/guest/super)
   * Crea un usuario demo y lo autentica
   */
  const handleQuickAccess = (role) => {
    const demoUsers = {
      admin: {
        id: 'dev-admin-001',
        name: 'Admin Demo',
        lastName: '',
        image: '/img/default-avatar.png',
        role: 'admin',
        relation: 'Organizador'
      },
      guest: {
        id: 'dev-guest-001',
        name: 'Invitado Demo',
        lastName: '',
        image: '/img/default-avatar.png',
        role: 'guest',
        relation: 'Invitado'
      },
      super: {
        id: 'dev-super-001',
        name: 'Modo Dios',
        lastName: '',
        image: '/img/default-avatar.png',
        role: 'super_admin',
        relation: 'Desarrollador'
      }
    };
    loginAsGuest(demoUsers[role]);
  };

  /**
   * 2.2 handleGuestLogin - Autenticación manual
   * @param {Event} e - Evento del formulario
   * Valida y autentica al invitado manualmente
   */
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 2.2.1 Validación básica
      if (!guestName.trim()) {
        setError("Por favor ingresa tu nombre completo");
        return;
      }

      // 2.2.2 Simulación de verificación (en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        const userData = {
          id: `temp-${Date.now()}`,
          name: guestName.trim(),
          lastName: '',
          image: '/img/default-avatar.png',
          role: 'guest',
          relation: 'Invitado Manual'
        };
        loginAsGuest(userData);
        return;
      }

      // 2.2.3 Lógica de producción (verificación real)
      const response = await fetch('/invitados.json');
      const data = await response.json();
      
      let guest = null;
      for (const group of data.grupos) {
        guest = group.invitados.find(inv => 
          `${inv.nombre} ${inv.apellido}`.toLowerCase() === guestName.trim().toLowerCase()
        );
        if (guest) break;
      }

      if (!guest && guestName.trim().toLowerCase() === "invitado prueba") {
        guest = data.config?.acceso_prueba?.usuario_prueba;
      }

      if (guest) {
        const userData = {
          id: guest.id,
          name: guest.nombre,
          lastName: guest.apellido,
          image: guest.imagen || '/img/default-avatar.png',
          role: guest.role || 'guest',
          relation: guest.relacion || 'Invitado'
        };
        loginAsGuest(userData);
      } else {
        setError("Invitado no encontrado. Verifica tu nombre.");
      }
    } catch (err) {
      console.error("Error en autenticación:", err);
      setError("Error al verificar. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============ 3. RENDERIZADO ============
  return (
    <div className="instagram-login">
      {/* 3.1 Contenedor Principal */}
      <div className="login-container">
        
        {/* 3.2 Encabezado con Logo */}
        <div className="login-header">
          <h1 className="app-logo">QR Social</h1>
          {process.env.NODE_ENV === 'development' && (
            <span className="dev-badge">MODO DESARROLLO</span>
          )}
        </div>

        {/* 3.3 Selector de Método de Autenticación */}
        <div className="auth-method-selector">
          <button
            className={`method-tab ${showQrLogin ? 'active' : ''}`}
            onClick={() => setShowQrLogin(true)}
          >
            Escanear QR
          </button>
          <button
            className={`method-tab ${!showQrLogin ? 'active' : ''}`}
            onClick={() => setShowQrLogin(false)}
          >
            Acceso Manual
          </button>
        </div>

        {/* 3.4 Contenido Dinámico según Método */}
        <div className="auth-content">
          {showQrLogin ? (
            // 3.4.1 Componente QR Login
            <div className="qr-auth">
              <QrLogin />
              <p className="auth-instruction">
                Escanea el código QR de tu invitación
              </p>
            </div>
          ) : (
            // 3.4.2 Formulario Manual
            <form onSubmit={handleGuestLogin} className="manual-auth">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nombre completo como en la invitación"
                className="auth-input"
                required
              />
              <button 
                type="submit" 
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Ingresar'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          )}
        </div>

        {/* 3.5 Sección de Desarrollo (solo en dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-access-section">
            <h3 className="dev-section-title">Accesos Rápidos</h3>
            <div className="dev-buttons">
              <button 
                onClick={() => handleQuickAccess('guest')} 
                className="dev-button guest"
              >
                Invitado Demo
              </button>
              <button 
                onClick={() => handleQuickAccess('admin')} 
                className="dev-button admin"
              >
                Admin Demo
              </button>
              <button 
                onClick={() => handleQuickAccess('super')} 
                className="dev-button super"
              >
                Modo Dios
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3.6 Pie de Página */}
      <div className="login-footer">
        <p>Sistema exclusivo para invitados del evento</p>
      </div>
    </div>
  );
};

export default LoginPage;