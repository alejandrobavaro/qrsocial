import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Stories from '../Stories';
import Post from '../Post';
import PostForm from '../PostForm';
import '../../assets/scss/_03-Componentes/_FeedPage.scss';

const FeedPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Intenta cargar desde demo-posts.json
        const response = await fetch('/demo-posts.json');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar las publicaciones');
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('La respuesta no es JSON');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error loading posts:", err);
        
        // Datos de demostración alternativos
        const demoPosts = [
          {
            id: 1,
            user: {
              id: 101,
              name: "María González",
              avatar: "/img/users/maria.jpg",
              relation: "Novia"
            },
            imageUrl: "/img/posts/wedding-dress.jpg",
            caption: "¡Finalmente encontré el vestido perfecto! No puedo esperar para que Carlos lo vea.",
            likes: 42,
            comments: [
              {
                id: 1011,
                user: {
                  id: 102,
                  name: "Carlos Mendez",
                  avatar: "/img/users/carlos.jpg"
                },
                text: "Estoy seguro que te ves hermosa ❤️"
              }
            ],
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            user: {
              id: 102,
              name: "Carlos Mendez",
              avatar: "/img/users/carlos.jpg",
              relation: "Novio"
            },
            imageUrl: "/img/posts/venue.jpg",
            caption: "El lugar de la ceremonia ya está listo. ¡Quedó exactamente como lo imaginamos!",
            likes: 38,
            comments: [],
            timestamp: new Date().toISOString()
          }
        ];
        
        setPosts(demoPosts);
        setError("Usando datos de demostración");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleNewPost = (newPost) => {
    if (!currentUser) return;
    
    setPosts([{
      id: Date.now(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.image,
        relation: currentUser.relation || "Invitado/a"
      },
      imageUrl: newPost.imageUrl,
      caption: newPost.caption,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    }, ...posts]);
  };

  if (!currentUser) return null;

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="feed-page">
      <header className="feed-header">
        <h1 className="feed-title">QR Social</h1>
      </header>

      <section className="stories-section">
        <Stories userId={currentUser.id} />
      </section>

      <main className="feed-main">
        {error && (
          <div className="demo-alert">
            <p>{error}</p>
            <small>Estás viendo datos de demostración</small>
          </div>
        )}
        
        <PostForm onSubmit={handleNewPost} />
        
        <div className="posts-list">
          {posts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              currentUserId={currentUser.id}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))}
        </div>
        
        {posts.length <= 1 && (
          <div className="tutorial-box">
            <h3>¿Cómo empezar?</h3>
            <ol>
              <li>Haz clic en "+" para crear una nueva publicación</li>
              <li>Sube una foto del evento</li>
              <li>Agrega una descripción y comparte</li>
              <li>Interactúa con las publicaciones de otros invitados</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedPage;