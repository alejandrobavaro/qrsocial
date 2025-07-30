// =============================================
// COMPONENTE: LoginPage - Versión Mejorada
// =============================================
/**
 * PROPÓSITO:
 * - Manejar autenticación mediante QR o acceso manual
 * - Validar usuarios contra lista de invitados.json
 * - Proporcionar acceso demo en desarrollo
 * 
 * COMUNICACIÓN:
 * - AuthContext: Para funciones de autenticación
 * - QrLogin: Componente hijo para escaneo QR
 * - React Router: Para navegación
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QrLogin from './auth/QrLogin';
import { BsQrCode, BsPeople } from 'react-icons/bs';
import Swal from 'sweetalert2';
import '../assets/scss/_03-Componentes/_LoginPage.scss';

const LoginPage = () => {
  // ============ SECCIÓN 1: ESTADOS Y CONTEXTO ============
  const { currentUser, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  
  // Estados del componente
  const [showQrLogin, setShowQrLogin] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ============ SECCIÓN 2: EFECTOS ============
  // Redirige si el usuario ya está autenticado
  useEffect(() => {
    if (currentUser) {
      Swal.fire({
        title: `¡Bienvenido a QR Social, ${currentUser.name}!`,
        text: 'Ya estás logueado correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 3000,
        timerProgressBar: true,
        didClose: () => navigate('/feed')
      });
    }
  }, [currentUser, navigate]);

  // ============ SECCIÓN 3: MANEJADORES ============
  // Acceso demo para desarrollo
  const handleQuickAccess = () => {
    const demoUser = {
      id: 'dev-guest-001',
      name: 'Invitado Demo',
      lastName: '',
      avatar: '/img/09-perfiles/feli.jpg',
      role: 'guest',
      relation: 'Invitado',
      bio: 'Usuario de demostración'
    };
    loginAsGuest(demoUser);
  };

  // Autenticación manual
  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validación básica
      if (!guestName.trim()) {
        setError("Por favor ingresa tu nombre completo");
        return;
      }

      // Modo desarrollo - acceso demo
      if (process.env.NODE_ENV === 'development' && guestName.trim().toLowerCase() === "invitado demo") {
        handleQuickAccess();
        return;
      }

      // Buscar en invitados.json
      const response = await fetch('/invitados.json');
      const data = await response.json();
      
      // Buscar coincidencia exacta de nombre y apellido
      const guest = data.grupos.flatMap(g => g.invitados).find(inv => {
        const nombreCompleto = `${inv.nombre} ${inv.apellido}`.toLowerCase().trim();
        return nombreCompleto === guestName.toLowerCase().trim();
      });

      if (guest) {
        loginAsGuest({
          id: guest.id,
          name: guest.nombre,
          lastName: guest.apellido,
          avatar: guest.imagen || '/img/default-avatar.png',
          role: 'guest',
          relation: guest.relacion || 'Invitado',
          bio: guest.bio || ''
        });
      } else {
        setError("Invitado no encontrado. Verifica que escribiste tu nombre completo exactamente como aparece en la invitación.");
      }
    } catch (err) {
      console.error("Error al verificar invitado:", err);
      setError("Ocurrió un error al verificar. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // ============ SECCIÓN 4: RENDERIZADO ============
  if (currentUser) {
    return (
      <div className="loading-session">
        <p>Redirigiendo a tu sesión...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Encabezado con logo */}
        <div className="login-header">
          <img src="/img/02-logos/logoqrsocial11a.png" alt="QR Social" className="logo" />
          <p className="subtitle">Red social privada para tu evento</p>
        </div>

        {/* Selector de método de acceso */}
        <div className="method-selector">
          <button 
            className={`tab ${showQrLogin ? 'active' : ''}`}
            onClick={() => setShowQrLogin(true)}
          >
            <BsQrCode /> QR
          </button>
          <button 
            className={`tab ${!showQrLogin ? 'active' : ''}`}
            onClick={() => setShowQrLogin(false)}
          >
            <BsPeople /> Manual
          </button>
        </div>

        {/* Contenido dinámico según método seleccionado */}
        <div className="auth-content">
          {showQrLogin ? (
            <QrLogin onSwitchToGuest={() => setShowQrLogin(false)} />
          ) : (
            <form onSubmit={handleGuestLogin} className="guest-form">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="name-input"
                aria-label="Ingresa tu nombre completo"
              />
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isLoading}
                aria-label="Ingresar a la aplicación"
              >
                {isLoading ? 'Verificando...' : 'Ingresar'}
              </button>
              {error && <p className="error-msg">{error}</p>}
              <p className="login-hint">Ingresa tu nombre y apellido exactamente como aparece en tu invitación</p>
            </form>
          )}
        </div>

        {/* Sección de desarrollo (solo visible en dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="dev-options">
            <button 
              onClick={handleQuickAccess} 
              className="demo-btn"
              aria-label="Acceso rápido para desarrollo"
            >
              Acceso Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;