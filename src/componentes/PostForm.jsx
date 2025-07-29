// =============================================
// COMPONENTE POST FORM - Versión Instagram
// =============================================

/**
 * Propósito:
 * - Permitir crear nuevas publicaciones
 * - Subir imágenes desde dispositivo o cámara
 * - Añadir descripción a la publicación
 * 
 * Props:
 * - onSubmit: Función para manejar el envío del formulario
 */

import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/scss/_03-Componentes/_PostForm.scss';

const PostForm = ({ onSubmit }) => {
  // ============ ESTADOS DEL COMPONENTE ============
  const { currentUser } = useAuth();
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const fileInputRef = useRef(null);

  // ============ MANEJADORES DE EVENTOS ============
  
  /**
   * Maneja la selección de imagen desde dispositivo
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Maneja la captura desde la cámara
   */
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Aquí implementar lógica para capturar foto
      // Se omite por simplicidad pero deberías:
      // 1. Mostrar vista previa de la cámara
      // 2. Capturar foto
      // 3. Convertir a base64 y setear en imagePreview
      // 4. Detener el stream
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      onSubmit({
        imageUrl: imagePreview,
        caption,
        timestamp: new Date().toISOString()
      });
      
      setCaption('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
    }, 1500);
  };

  // ============ RENDERIZADO ============
  return (
    <div className="instagram-post-form">
      <form onSubmit={handleSubmit}>
        {/* Selector de imagen */}
        <div className="image-selector">
          {imagePreview ? (
            <div className="image-preview-container">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview"
              />
              <button 
                type="button" 
                className="remove-image"
                onClick={() => setImagePreview(null)}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="upload-options">
              <label className="upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden-input"
                  required
                />
                <span>Subir desde dispositivo</span>
              </label>
              <button 
                type="button" 
                className="camera-btn"
                onClick={() => setShowCameraOptions(!showCameraOptions)}
              >
                Usar cámara
              </button>
              {showCameraOptions && (
                <div className="camera-options">
                  <button type="button" onClick={handleCameraCapture}>
                    Tomar foto
                  </button>
                  <button type="button" onClick={() => setShowCameraOptions(false)}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campo de descripción */}
        <div className="caption-field">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escribe una descripción..."
            maxLength="2200"
          />
          <div className="char-counter">
            {caption.length}/2200
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={!imagePreview || isUploading}
          className="submit-btn"
        >
          {isUploading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;