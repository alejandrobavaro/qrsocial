// =============================================
// COMPONENTE PRINCIPAL APP - Versión Instagram
// =============================================

/**
 * Propósito:
 * - Configurar el enrutamiento principal de la aplicación
 * - Proveer el contexto de autenticación a toda la app
 * - Definir la estructura base del layout
 * - Manejar rutas públicas y protegidas
 * 
 * Estructura:
 * 1. Configuración del Router
 * 2. Proveedor de Autenticación
 * 3. Layout Principal (Header + Main + Footer)
 * 4. Sistema de Rutas
 */

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './assets/scss/_01-General/_App.scss';

// Componentes de Layout
import Header from './componentes/Header';
import Footer from './componentes/Footer';

// Páginas Públicas
import LandingPage from './componentes/LandingPage';
import LoginPage from './componentes/LoginPage';

// Páginas Protegidas (Usuario)
import FeedPage from './componentes/user/FeedPage';
import ProfilePage from './componentes/user/ProfilePage';

// Páginas de Administración
import AdminLayout from './componentes/admin/AdminLayout';
import GuestManager from './componentes/admin/GuestManager';
import ContentManager from './componentes/admin/ContentManager';
import DataExporter from './componentes/admin/DataExporter';

// Contexto de Autenticación
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    // 1. Configuración del Router con futuras funcionalidades
    <Router future={{
      v7_startTransition: true, // Habilita transiciones suaves
      v7_relativeSplatPath: true // Mejora en manejo de rutas
    }}>
      
      {/* 2. Proveedor del contexto de autenticación */}
      <AuthProvider>
        
        {/* 3. Estructura base del layout */}
        <div className="instagram-app">
          
          {/* Header de la aplicación */}
          <Header />
          
          {/* Contenido principal */}
          <main className="app-main-content">
            
            {/* 4. Sistema de rutas */}
            <Routes>
              {/* ===== RUTAS PÚBLICAS ===== */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* ===== RUTAS PROTEGIDAS (Usuario) ===== */}
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile/current" element={<ProfilePage />} />
              
              {/* ===== RUTAS DE ADMINISTRACIÓN ===== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<GuestManager />} />
                <Route path="guests" element={<GuestManager />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="export" element={<DataExporter />} />
              </Route>
              
              {/* Ruta comodín para manejar 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer de la aplicación */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;