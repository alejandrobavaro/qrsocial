// =============================================
// CONTEXTO DE AUTENTICACIÓN - AuthContext
// =============================================

/**
 * Propósito:
 * - Gestionar el estado global de autenticación
 * - Manejar login por QR y manual
 * - Persistir sesión en localStorage
 * 
 * Integraciones:
 * - React Context API
 * - localStorage para persistencia
 * - Fetch API para cargar datos de invitados
 */

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Creación del Contexto
export const AuthContext = createContext();

// 2. Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  // Estados del contexto
  const [currentUser, setCurrentUser] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efecto para cargar usuario al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('qrSocialUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  /**
   * Función para login con QR
   * @param {string} qrData - Código QR escaneado
   * @returns {boolean} - True si autenticación exitosa
   */
  const loginWithQR = async (qrData) => {
    try {
      const response = await fetch('/invitados.json');
      const data = await response.json();
      
      let guest = null;
      for (const group of data.grupos) {
        guest = group.invitados.find(inv => 
          inv.qr_data?.codigo === qrData || 
          inv.qr_data?.hash === qrData
        );
        if (guest) break;
      }

      if (!guest && qrData === data.config?.acceso_prueba?.usuario_prueba?.qr_data?.codigo) {
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
   * Función para login manual
   * @param {Object} userData - Datos del usuario
   */
  const loginAsGuest = (userData) => {
    localStorage.setItem('qrSocialUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // Función para formatear datos de usuario
  const formatUserData = (guest) => ({
    id: guest.id,
    name: guest.nombre,
    lastName: guest.apellido,
    image: guest.imagen || '/img/default-avatar.png',
    role: guest.role || 'guest',
    relation: guest.relacion || 'Invitado'
  });

  // Función para logout
  const logout = () => {
    localStorage.removeItem('qrSocialUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      eventData,
      loading,
      loginWithQR,
      loginAsGuest,
      logout,
      isAuthenticated: !!currentUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);