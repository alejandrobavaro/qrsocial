// =============================================
// CONTEXTO DE AUTENTICACIÓN - AuthContext
// =============================================

/**
 * PROPS Y COMUNICACIÓN:
 * - Provee estado de autenticación a toda la app
 * - Se conecta con: LoginPage, Header, ProfilePage
 * - Persiste datos en localStorage
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. CREACIÓN DEL CONTEXTO
// ------------------------
// Crea el contexto que será consumido por useAuth()
export const AuthContext = createContext();

// 2. COMPONENTE PROVIDER
// ----------------------
// Envuelve la aplicación y provee los valores de autenticación
export const AuthProvider = ({ children }) => {
  // ========== ESTADOS PRINCIPALES ==========
  // currentUser: Datos del usuario logueado (null si no hay sesión)
  // eventData: Información del evento (boda)
  // loading: Estado de carga inicial
  const [currentUser, setCurrentUser] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== EFECTO INICIAL ==========
  // Al montar el componente, verifica si hay usuario en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('qrSocialUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout(); // Limpia datos corruptos
      }
    }
    setLoading(false);
  }, []);

  // ========== FUNCIONES DE AUTENTICACIÓN ==========

  /**
   * loginWithQR - Autentica mediante código QR
   * @param {string} qrData - Código escaneado
   * @returns {boolean} - True si autenticación exitosa
   * 
   * Flujo:
   * 1. Busca en invitados.json el código QR
   * 2. Si encuentra, formatea datos y guarda en estado
   * 3. Retorna éxito/fallo
   */
  const loginWithQR = async (qrData) => {
    try {
      const response = await fetch('/invitados.json');
      const data = await response.json();
      
      let guest = null;
      // Busca en todos los grupos de invitados
      for (const group of data.grupos) {
        guest = group.invitados.find(inv => 
          inv.codigo_qr_contenido === qrData // Usa codigo_qr_contenido del JSON
        );
        if (guest) break;
      }

      // Acceso especial para pruebas
      if (!guest && data.config?.acceso_prueba?.usuario_prueba?.codigo_qr_contenido === qrData) {
        guest = data.config.acceso_prueba.usuario_prueba;
      }

      if (guest) {
        const userData = formatUserData(guest);
        localStorage.setItem('qrSocialUser', JSON.stringify(userData));
        setCurrentUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en loginWithQR:", error);
      return false;
    }
  };

  /**
   * loginAsGuest - Autentica usuario manual/demo
   * @param {Object} userData - Datos del usuario
   * 
   * Uso:
   * - En LoginPage para acceso manual
   * - En desarrollo para usuarios demo
   */
  const loginAsGuest = (userData) => {
    // Estandariza propiedad de imagen (avatar/image)
    const normalizedUser = {
      ...userData,
      avatar: userData.avatar || userData.image || '/img/default-avatar.png'
    };
    localStorage.setItem('qrSocialUser', JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);
  };

  /**
   * formatUserData - Normaliza datos de invitado
   * @param {Object} guest - Datos del invitado
   * @returns {Object} - Datos normalizados
   */
  const formatUserData = (guest) => ({
    id: guest.id,
    name: guest.nombre,
    lastName: guest.apellido || '',
    avatar: guest.imagen || '/img/default-avatar.png', // Estandarizado a 'avatar'
    role: guest.role || 'guest',
    relation: guest.relacion || 'Invitado',
    bio: guest.bio || ''
  });

  /**
   * logout - Cierra sesión
   * Limpia localStorage y estado
   */
  const logout = () => {
    localStorage.removeItem('qrSocialUser');
    setCurrentUser(null);
  };

  // ========== PROVIDER ==========
  // Provee todos los valores y funciones al árbol de componentes
  return (
    <AuthContext.Provider value={{
      // Estados
      currentUser,
      eventData,
      loading,
      
      // Funciones
      loginWithQR,
      loginAsGuest,
      logout,
      
      // Atajo para verificación
      isAuthenticated: !!currentUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. HOOK PERSONALIZADO
// ---------------------
// Permite acceder al contexto desde cualquier componente
export const useAuth = () => useContext(AuthContext);