import React, { useState } from 'react';
import '../assets/scss/_03-Componentes/_ShareModal.scss';

const ShareModal = ({ post, onClose }) => {
  // Estados del componente
  const [copied, setCopied] = useState(false); // Controla el estado de "copiado"
  
  // Generar URL única para el post basada en la ubicación actual
  const shareUrl = `${window.location.origin}/post/${post.id}`;

  /**
   * Maneja la acción de copiar al portapapeles
   * - Copia la URL de la publicación
   * - Muestra feedback visual ("¡Copiado!")
   * - Resetea el estado después de 2 segundos
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // Render del componente
  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado del modal */}
        <div className="modal-header">
          <h3>Compartir publicación</h3>
        </div>
        
        {/* Contenedor de la URL */}
        <div className="share-url-container">
          <p className="share-instruction">Comparte este enlace:</p>
          <div className="share-url">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              onClick={(e) => e.target.select()}
              aria-label="URL para compartir"
            />
            <button 
              onClick={handleCopy}
              className={`copy-btn ${copied ? 'copied' : ''}`}
              aria-live="polite"
            >
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </button>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="modal-actions">
          <button onClick={onClose} className="close-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;