import React, { useState, useEffect } from 'react';
import { ref, onValue, remove } from '../../firebase';
import '../../assets/scss/_03-Componentes/_ContentManager.scss';

const ContentManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar posts desde Firebase
  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const postsData = snapshot.val() || {};
      const postsArray = Object.keys(postsData).map(key => ({
        id: key,
        ...postsData[key]
      })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(postsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Eliminar contenido
  const deleteContent = async (contentId, type) => {
    if (window.confirm(`¿Estás seguro de eliminar este ${type}?`)) {
      try {
        await remove(ref(db, `${type}/${contentId}`));
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  if (loading) return <div className="loading-content">Cargando contenido...</div>;

  return (
    <div className="content-manager">
      <h2>Gestión de Contenido</h2>
      
      <div className="content-tabs">
        <button className="active">Publicaciones</button>
        <button>Historias</button>
        <button>Comentarios</button>
      </div>
      
      <div className="content-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="content-item">
              <div className="content-info">
                <div className="author">
                  <img 
                    src={post.userAvatar || '/img/default-avatar.png'} 
                    alt={post.userName} 
                  />
                  <span>{post.userName}</span>
                </div>
                <p className="timestamp">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
                {post.text && <p className="content-text">{post.text}</p>}
              </div>
              
              <div className="content-actions">
                <button 
                  onClick={() => deleteContent(post.id, 'posts')}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-content">No hay contenido para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default ContentManager;