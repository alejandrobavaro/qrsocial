import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShareModal from './ShareModal';
import '../assets/scss/_03-Componentes/_Post.scss';

const Post = ({ post, currentUserId, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePostClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="instagram-post">
      <div className="post-header">
        <div className="author-info">
          <img 
            src={post.user.avatar || '/img/default-avatar.png'} 
            alt={post.user.name} 
            className="author-avatar"
          />
          <span className="author-name">{post.user.name}</span>
          <span className="author-relation">{post.user.relation}</span>
        </div>
        <button className="options-btn">⋯</button>
      </div>

      <div className="post-image-container" onClick={handlePostClick}>
        <img 
          src={post.imageUrl} 
          alt={post.caption || 'Publicación'} 
          className="post-image"
          loading="lazy"
        />
      </div>

      <div className="post-actions">
        <div className="left-actions">
          <button onClick={handleLike} className={`action-btn ${isLiked ? 'liked' : ''}`}>
            {isLiked ? '❤️' : '♡'}
          </button>
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="action-btn"
          >
            💬
          </button>
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

      <div className="post-caption" onClick={toggleCaption}>
        <span className="author-name">{post.user.name}</span>
        {isExpanded || post.caption.length < 100 
          ? post.caption 
          : `${post.caption.substring(0, 97)}...`}
        {post.caption.length > 100 && (
          <span className="read-more">
            {isExpanded ? ' ver menos' : ' ver más'}
          </span>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments && post.comments.length > 0 ? (
            post.comments.slice(0, 2).map(comment => (
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
          {post.comments?.length > 2 && (
            <button 
              onClick={() => navigate(`/post/${post.id}`)}
              className="view-all-comments"
            >
              Ver todos los comentarios
            </button>
          )}
        </div>
      )}

      {showShareModal && (
        <ShareModal 
          post={post} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default Post;