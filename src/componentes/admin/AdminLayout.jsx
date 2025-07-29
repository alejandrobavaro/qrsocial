import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/scss/_03-Componentes/_AdminLayout.scss';

const AdminLayout = () => {
  const { currentUser } = useAuth();

  // Verificar si el usuario es administrador
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Acceso restringido</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <Link to="/" className="btn-home">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Panel de Administración</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="nav-item">
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/guests" className="nav-item">
            <span>Invitados</span>
          </Link>
          <Link to="/admin/content" className="nav-item">
            <span>Contenido</span>
          </Link>
          <Link to="/admin/export" className="nav-item">
            <span>Exportar Datos</span>
          </Link>
        </nav>
      </aside>
      
      <main className="admin-main">
        <Outlet /> {/* Aquí se renderizarán las páginas hijas */}
      </main>
    </div>
  );
};

export default AdminLayout;