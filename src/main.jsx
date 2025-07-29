/**
 * PUNTO DE ENTRADA PRINCIPAL - main.jsx
 * 
 * Responsabilidades:
 * 1. Montar la aplicación React en el DOM
 * 2. Proveer el contexto de autenticación
 * 3. Habilitar React StrictMode
 * 
 * Estructura:
 * - Renderiza AuthProvider como padre de toda la app
 * - Usa createRoot para renderizado concurrente
 */

import React from 'react';
import { createRoot } from 'react-dom/client'; // Método moderno de renderizado

// Componente principal
import App from './App';

// Contexto de autenticación
import { AuthProvider } from './context/AuthContext';

// ======================
// CONFIGURACIÓN DEL RENDERIZADO
// ======================
const container = document.getElementById('root'); // Contenedor en el HTML
const root = createRoot(container); // Crea raíz de renderizado

/**
 * Renderizado principal
 * - StrictMode ayuda a detectar problemas
 * - AuthProvider envuelve toda la aplicación
 */
root.render(
  <React.StrictMode> {/* Habilita verificaciones adicionales */}
    <AuthProvider> {/* Provee contexto de autenticación */}
      <App /> {/* Componente raíz de la aplicación */}
    </AuthProvider>
  </React.StrictMode>
);