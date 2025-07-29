// =============================================
// PÁGINA DE PERFIL - ProfilePage
// =============================================

/**
 * Propósito:
 * - Mostrar perfil completo del usuario con diseño similar a Instagram
 * - Mostrar galería de publicaciones en grid
 * - Permitir edición básica de la biografía
 * - Mostrar relación con los novios (específico para boda)
 * 
 * Integraciones:
 * - AuthContext: Para datos del usuario actual
 * - React Router: Para manejo de parámetros y navegación
 * - Post: Componente de publicaciones (no usado directamente aquí pero relacionado)
 * - Fetch API: Para cargar datos demo del perfil y publicaciones
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/scss/_03-Componentes/_ProfilePage.scss';

const ProfilePage = () => {
  // Estados del componente
  const { username } = useParams(); // Obtiene el username de la URL
  const { currentUser } = useAuth(); // Usuario actual desde el contexto
  const [profileUser, setProfileUser] = useState(null); // Datos del perfil mostrado
  const [userPosts, setUserPosts] = useState([]); // Publicaciones del usuario
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [isEditing, setIsEditing] = useState(false); // Modo edición de biografía
  const [tempBio, setTempBio] = useState(''); // Biografía temporal durante edición

  // Efecto para cargar datos del perfil y publicaciones
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Carga en paralelo los datos del perfil y las publicaciones
        const [profileResponse, postsResponse] = await Promise.all([
          fetch('/demo-profile.json').then(res => res.json()),
          fetch('/11-postdemo.json').then(res => res.json())
        ]);
        
        // Filtra posts del usuario actual o del perfil visitado
        const filteredPosts = postsResponse.filter(
          post => post.user.id === (username === 'current' ? currentUser.id : parseInt(username))
        );
        
        // Actualiza estados
        setProfileUser(profileResponse);
        setUserPosts(filteredPosts);
        setTempBio(profileResponse.bio || '');
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [username, currentUser]);

  /**
   * Maneja el guardado de la biografía editada
   * (En una implementación real, aquí se haría una petición al backend)
   */
  const handleSaveBio = () => {
    setProfileUser({ ...profileUser, bio: tempBio });
    setIsEditing(false);
  };

  // Estados de carga y error
  if (isLoading) return <div className="loading-profile">Cargando perfil...</div>;
  if (!profileUser) return <div className="error-profile">Perfil no encontrado</div>;

  // Verifica si el perfil mostrado es del usuario actual
  const isCurrentUser = username === 'current' || currentUser?.id === parseInt(username);

  return (
    <div className="profile-page">
      {/* Sección superior con avatar y estadísticas */}
      <div className="profile-header">
        {/* Contenedor del avatar */}
        <div className="profile-avatar-container">
          <img 
            src={profileUser.avatar || '/img/default-avatar.png'} 
            alt={profileUser.name} 
            className="profile-avatar"
          />
        </div>
        
        {/* Estadísticas: publicaciones, seguidores, seguidos */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-count">{userPosts.length}</span>
            <span className="stat-label">publicaciones</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{profileUser.followers || 0}</span>
            <span className="stat-label">seguidores</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">{profileUser.following || 0}</span>
            <span className="stat-label">siguiendo</span>
          </div>
        </div>
      </div>

      {/* Información del usuario: nombre, biografía, relación */}
      <div className="profile-info">
        <h1 className="profile-name">{profileUser.name}</h1>
        
        {/* Editor de biografía (solo para usuario actual) */}
        {isEditing ? (
          <div className="bio-editor">
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              maxLength="150"
              className="bio-input"
              placeholder="Escribe tu biografía..."
            />
            <div className="bio-actions">
              <button onClick={handleSaveBio} className="save-btn">
                Guardar
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="profile-bio">
              {profileUser.bio || 'No hay biografía aún.'}
              {isCurrentUser && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="edit-bio-btn"
                  aria-label="Editar biografía"
                >
                  ✏️
                </button>
              )}
            </p>
          </>
        )}
        
        {/* Relación con los novios (específico para boda) */}
        <p className="profile-relation">
          {profileUser.relation || 'Invitado/a'}
        </p>
      </div>

      {/* Botones de acción (diferentes para usuario actual vs otros) */}
      <div className="profile-actions">
        {isCurrentUser ? (
          // Acciones para perfil propio
          <>
            <Link to="/settings" className="action-btn edit-profile">
              Editar perfil
            </Link>
            <button className="action-btn view-archive">
              Ver archivo
            </button>
          </>
        ) : (
          // Acciones para perfiles ajenos
          <>
            <button className="action-btn follow">
              {profileUser.isFollowing ? 'Siguiendo ✓' : 'Seguir'}
            </button>
            <button className="action-btn message">
              Mensaje
            </button>
          </>
        )}
      </div>

      {/* Galería de publicaciones */}
      <div className="profile-posts">
        {userPosts.length > 0 ? (
          <div className="posts-grid">
            {userPosts.map(post => (
              <Link 
                key={post.id} 
                to={`/post/${post.id}`} 
                className="post-thumbnail"
                aria-label={`Publicación de ${post.user.name}`}
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.caption || 'Publicación'} 
                  loading="lazy"
                />
                {/* Overlay con interacciones al hover */}
                <div className="post-overlay">
                  <span>♥ {post.likes || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Mensaje cuando no hay publicaciones
          <div className="no-posts">
            <p>{isCurrentUser ? 'Aún no has publicado nada.' : 'No hay publicaciones aún.'}</p>
            {isCurrentUser && (
              <Link to="/create-post" className="create-post-btn">
                Crear primera publicación
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;