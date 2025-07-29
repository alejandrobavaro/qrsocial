import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import '../assets/scss/_03-Componentes/_AdminPage.scss';

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard de Administración</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Invitados Confirmados</h3>
            <p className="stat-value">85</p>
          </div>
          <div className="stat-card">
            <h3>Publicaciones</h3>
            <p className="stat-value">124</p>
          </div>
          <div className="stat-card">
            <h3>Fotos Compartidas</h3>
            <p className="stat-value">236</p>
          </div>
          <div className="stat-card">
            <h3>Comentarios</h3>
            <p className="stat-value">189</p>
          </div>
        </div>
        
        <div className="recent-activity">
          <h2>Actividad Reciente</h2>
          <div className="activity-list">
            {/* Lista de actividad reciente */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;