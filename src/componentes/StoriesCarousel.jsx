// =============================================
// COMPONENTE STORIES CAROUSEL - Visualizador
// =============================================

/**
 * Propósito:
 * - Mostrar una story en pantalla completa
 * - Manejar navegación entre items de la story
 * - Controlar tiempo de visualización automático
 * - Mostrar barra de progreso para cada item
 * 
 * Integraciones:
 * - Se llama desde el componente Stories
 * - Recibe la story seleccionada como prop
 */

import React, { useState, useEffect, useRef } from 'react';
import '../assets/scss/_03-Componentes/_StoriesCarousel.scss';

const StoriesCarousel = ({ story, onClose, markAsViewed }) => {
  // Estados del componente
  const [currentItemIndex, setCurrentItemIndex] = useState(0); // Índice del item actual
  const [progress, setProgress] = useState(0); // Progreso de la barra (0-100)
  const progressInterval = useRef(null); // Referencia para el intervalo de progreso

  // Efecto para manejar el progreso de visualización
  useEffect(() => {
    markAsViewed(); // Marcamos como vista al abrir
    startProgressTimer(); // Iniciamos el timer
    
    return () => {
      clearInterval(progressInterval.current); // Limpiamos al desmontar
    };
  }, [currentItemIndex]);

  // Función para iniciar el timer de progreso
  const startProgressTimer = () => {
    clearInterval(progressInterval.current); // Limpiamos cualquier intervalo previo
    setProgress(0); // Reseteamos el progreso
    
    // Calculamos la duración del item actual (default 5s)
    const duration = story.items[currentItemIndex].duration || 5;
    const intervalDuration = (duration * 1000) / 100; // Dividimos en 100 pasos
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          handleNext(); // Pasamos al siguiente al completar
          return 0;
        }
        return prev + 1;
      });
    }, intervalDuration);
  };

  // Navega al siguiente item
  const handleNext = () => {
    if (currentItemIndex < story.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      onClose(); // Cerramos si no hay más items
    }
  };

  // Navega al item anterior
  const handlePrev = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  // Maneja clicks en la pantalla (navegación izquierda/derecha)
  const handleScreenClick = (e) => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    
    if (clickX < screenWidth / 3) {
      handlePrev(); // Click en tercio izquierdo: retroceder
    } else if (clickX > (screenWidth / 3) * 2) {
      handleNext(); // Click en tercio derecho: avanzar
    }
  };

  return (
    <div className="stories-carousel-overlay">
      {/* Barras de progreso (una por cada item) */}
      <div className="progress-bars">
        {story.items.map((_, index) => (
          <div key={index} className="progress-bar-container">
            <div 
              className={`progress-bar ${index === currentItemIndex ? 'active' : ''}`}
              style={{ 
                width: index === currentItemIndex ? `${progress}%` : 
                       index < currentItemIndex ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Botón de cerrar */}
      <button className="close-btn" onClick={onClose}>×</button>
      
      {/* Contenido del story (imagen o video) */}
      <div className="story-content" onClick={handleScreenClick}>
        {story.items[currentItemIndex].type === 'image' ? (
          <img 
            src={story.items[currentItemIndex].url} 
            alt={`Story de ${story.user.name}`} 
            className="story-media"
          />
        ) : (
          <video 
            src={story.items[currentItemIndex].url} 
            className="story-media"
            autoPlay
            muted
            loop={false}
          />
        )}
        
        {/* Info del usuario en la parte superior */}
        <div className="story-user-info">
          <img 
            src={story.user.avatar} 
            alt={story.user.name} 
            className="user-avatar"
          />
          <span className="username">{story.user.name}</span>
          <span className="timestamp">hace 2h</span>
        </div>
      </div>
    </div>
  );
};

export default StoriesCarousel;