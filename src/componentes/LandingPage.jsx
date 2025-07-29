// =============================================
// COMPONENTE LANDING PAGE - Versión Instagram
// =============================================

/**
 * Propósito:
 * - Página de inicio para usuarios no autenticados
 * - Mostrar características clave de la aplicación
 * - Proporcionar opciones de acceso (login/registro)
 * - Redirigir usuarios autenticados al feed principal
 * 
 * Integraciones:
 * - AuthContext: Para verificar estado de autenticación
 * - React Router: Para navegación programática
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/scss/_03-Componentes/_LandingPage.scss';

const LandingPage = () => {
  // ============ HOOKS Y CONTEXTO ============
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ============ EFECTO DE REDIRECCIÓN ============
  /**
   * Efecto que redirige al feed si el usuario está autenticado
   * Dependencias: currentUser, navigate
   */
  useEffect(() => {
    if (currentUser) {
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  // ============ RENDERIZADO ============
  return (
    <div className="instagram-landing">
      {/* Sección Hero */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1>QR Social</h1>
          <p>Comparte y disfruta momentos especiales con tus invitados</p>
          
          <div className="auth-options">
            <button 
              onClick={() => navigate('/login')} 
              className="auth-btn primary"
            >
              Iniciar sesión
            </button>
            <button 
              onClick={() => navigate('/login?guest=true')} 
              className="auth-btn secondary"
            >
              Acceder como invitado
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
       src="/img/02-logos/logoqrsocial2b.png" 
            alt="Experiencia QR Social" 
          />
        </div>
      </section>

      {/* Sección de Características */}
      <section className="features-section">
        <h2>Características principales</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Comparte fotos</h3>
            <p>Sube imágenes del evento en tiempo real</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Interactúa</h3>
            <p>Comenta y reacciona a las publicaciones</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacidad</h3>
            <p>Solo invitados pueden ver el contenido</p>
          </div>
        </div>
      </section>

      {/* Sección de Demo */}
      <section className="demo-section">
        <h2>Así funciona</h2>
        <div className="demo-container">
          <img 
                src="/img/02-logos/logoqrsocial2b.png" 
            alt="Demo de la aplicación" 
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;