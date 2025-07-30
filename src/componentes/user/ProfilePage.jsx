// =============================================
// PÁGINA DE PERFIL - Versión con Datos Demo
// =============================================

/**
 * SECCIÓN 1: IMPORTS Y CONFIGURACIÓN
 * - useParams: Obtiene parámetros de URL (username)
 * - useAuth: Acceso a datos de autenticación
 * - Link: Para navegación interna
 * - SCSS: Estilos del componente
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../assets/scss/_03-Componentes/_ProfilePage.scss';

const ProfilePage = () => {
  /**
   * SECCIÓN 2: ESTADOS Y HOOKS
   * - username: ID del perfil desde la URL
   * - currentUser: Usuario logueado (contexto)
   * - profileUser: Datos del perfil mostrado
   * - userPosts: Publicaciones del usuario
   * - isLoading: Estado de carga
   * - isEditing: Modo edición de biografía
   * - tempBio: Biografía temporal durante edición
   */
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState('');

  /**
   * SECCIÓN 3: CARGA DE DATOS
   * - Carga datos del perfil y publicaciones
   * - Usa datos demo cuando no hay información real
   */
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // 1. Cargar datos de invitados reales
        const guestsResponse = await fetch('/invitados.json');
        const guestsData = await guestsResponse.json();
        
        // 2. Cargar datos demo
        const demoResponse = await fetch('/demo-profile.json');
        const demoData = await demoResponse.json();
        
        // 3. Buscar usuario en invitados reales
        let foundUser = null;
        for (const group of guestsData.grupos) {
          foundUser = group.invitados.find(inv => 
            username === 'current' ? inv.id === currentUser?.id : inv.id === parseInt(username)
          );
          if (foundUser) break;
        }

        // 4. Si no se encuentra, buscar en datos demo
        if (!foundUser) {
          foundUser = demoData.profiles.find(p => 
            username === 'current' ? p.id === currentUser?.id : p.id === parseInt(username)
          );
        }

        // 5. Si es perfil actual pero no está en ningún archivo
        if (!foundUser && username === 'current' && currentUser) {
          foundUser = {
            id: currentUser.id,
            nombre: currentUser.name,
            apellido: currentUser.lastName || '',
            imagen: currentUser.avatar,
            relacion: currentUser.relation || 'Invitado/a',
            bio: currentUser.bio || ''
          };
        }

        // 6. Cargar publicaciones
        let posts = [];
        if (foundUser?.posts) {
          posts = [...foundUser.posts];
        } else {
          // Usar publicaciones demo si no hay propias
          const postsResponse = await fetch('/11-postdemo.json');
          const postsData = await postsResponse.json();
          posts = postsData.filter(post => post.user.id === (foundUser?.id || 0));
          
          // Si no hay posts, usar los default
          if (posts.length === 0) {
            posts = [...demoData.defaultPosts];
          }
        }

        // 7. Actualizar estado
        if (foundUser) {
          setProfileUser({
            id: foundUser.id,
            name: foundUser.nombre,
            lastName: foundUser.apellido,
            avatar: foundUser.imagen || '/img/09-perfiles/default-avatar.jpg',
            relation: foundUser.relacion,
            bio: foundUser.bio || ''
          });
          setUserPosts(posts);
          setTempBio(foundUser.bio || '');
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [username, currentUser]);

  /**
   * SECCIÓN 4: MANEJADORES
   * - handleSaveBio: Guarda la biografía editada
   */
  const handleSaveBio = () => {
    setProfileUser({ ...profileUser, bio: tempBio });
    setIsEditing(false);
  };

  // SECCIÓN 5: ESTADOS DE CARGA Y ERROR
  if (isLoading) return <div className="loading-profile">Cargando perfil...</div>;
  if (!profileUser) return <div className="error-profile">Perfil no encontrado</div>;

  // Verifica si es el perfil del usuario actual
  const isCurrentUser = username === 'current' || currentUser?.id === profileUser?.id;

  /**
   * SECCIÓN 6: RENDERIZADO
   * - Header con avatar y estadísticas
   * - Información del usuario
   * - Botones de acción
   * - Grid de publicaciones
   */
  return (
    <div className="profile-page">
      {/* Sección superior con avatar y stats */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            src={profileUser.avatar} 
            alt={profileUser.name} 
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/09-perfiles/default-avatar.jpg';
            }}
          />
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-count">{userPosts.length}</span>
            <span className="stat-label">publicaciones</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">0</span>
            <span className="stat-label">seguidores</span>
          </div>
          <div className="stat-item">
            <span className="stat-count">0</span>
            <span className="stat-label">siguiendo</span>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="profile-info">
        <h1 className="profile-name">{profileUser.name} {profileUser.lastName}</h1>
        
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
        )}
        
        <p className="profile-relation">
          {profileUser.relation || 'Invitado/a'}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="profile-actions">
        {isCurrentUser ? (
          <>
            <Link to="/settings" className="action-btn edit-profile">
              Editar perfil
            </Link>
            <button className="action-btn view-archive">
              Ver archivo
            </button>
          </>
        ) : (
          <>
            <button className="action-btn follow">
              Seguir
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
                aria-label={`Publicación de ${profileUser.name}`}
              >
                <img 
                  src={`/11-postdemo/${post.imageUrl.split('/').pop()}`} 
                  alt={post.caption || 'Publicación'} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/11-postdemo/default-1.jpg';
                  }}
                />
                <div className="post-overlay">
                  <span>♥ {post.likes || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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