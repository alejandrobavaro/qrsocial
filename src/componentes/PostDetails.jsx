import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShareModal from '../ShareModal';
import '../../assets/scss/_03-Componentes/_PostDetails.scss';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Datos de demostración
        const demoPost = {
          id: postId,
          user: {
            id: 101,
            name: "María González",
            avatar: "/img/users/maria.jpg",
            relation: "Novia"
          },
          imageUrl: "/img/posts/wedding-dress.jpg",
          caption: "¡Finalmente encontré el vestido perfecto! No puedo esperar para que Carlos lo vea. #Emocionada #BodaPerfecta",
          likes: 42,
          comments: [
            {
              id: 1011,
              user: {
                id: 102,
                name: "Carlos Mendez",
                avatar: "/img/users/carlos.jpg"
              },
              text: "Estoy seguro que te ves hermosa, no puedo esperar para verte ❤️"
            },
            {
              id: 1012,
              user: {
                id: 103,
                name: "Ana López",
                avatar: "/img/users/ana.jpg"
              },
              text: "¡Es precioso! Perfecto para ti."
            }
          ],
          timestamp: "2023-06-15T14:30:00Z"
        };
        
        setPost(demoPost);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleLike = () => setIsLiked(!isLiked);
  const toggleSave = () => setIsSaved(!isSaved);
  const handleBack = () => navigate(-1);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const updatedPost = {
        ...post,
        comments: [
          ...post.comments,
          {
            id: Date.now(),
            user: {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.image
            },
            text: newComment
          }
        ]
      };
      setPost(updatedPost);
      setNewComment('');
    }
  };

  if (isLoading) return <div className="loading">Cargando publicación...</div>;
  if (!post) return <div className="error">Publicación no encontrada</div>;

  return (
    <div className="post-details">
      <div className="post-header">
        <button onClick={handleBack} className="back-btn">←</button>
        <h2 className="post-title">Publicación</h2>
      </div>

      <div className="post-content">
        <div className="image-container">
          <img 
            src={post.imageUrl} 
            alt={post.caption || 'Publicación'} 
            className="post-image"
          />
        </div>

        <div className="details-section">
          <div className="author-info">
            <img 
              src={post.user.avatar || '/img/default-avatar.png'} 
              alt={post.user.name}
              className="author-avatar"
            />
            <div>
              <span className="author-name">{post.user.name}</span>
              <span className="author-relation">{post.user.relation}</span>
            </div>
          </div>

          <div className="full-caption">
            <span className="author-name">{post.user.name}</span>
            <p>{post.caption}</p>
          </div>

          <div className="comments-container">
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <img 
                    src={comment.user.avatar || '/img/default-avatar.png'} 
                    alt={comment.user.name}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <span className="comment-author">{comment.user.name}</span>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No hay comentarios aún</p>
            )}
          </div>

          <div className="post-actions">
            <div className="action-group">
              <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
                {isLiked ? '❤️' : '♡'}
              </button>
              <button className="action-btn">💬</button>
              <button 
                onClick={() => setShowShareModal(true)} 
                className="action-btn"
              >
                ↗️
              </button>
            </div>
            <button onClick={toggleSave} className="action-btn">
              {isSaved ? '🔖' : '📑'}
            </button>
          </div>

          <div className="likes-count">
            {post.likes + (isLiked ? 1 : 0)} me gusta
          </div>

          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añade un comentario..."
                className="comment-input"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()}
                className="comment-submit"
              >
                Publicar
              </button>
            </form>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          post={post} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default PostDetails;