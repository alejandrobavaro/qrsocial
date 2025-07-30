// =============================================
// COMPONENTE STORIES - Historias Temporales
// =============================================

/**
 * SECCIÓN 1: IMPORTS Y CONFIGURACIÓN INICIAL
 * - useAuth: Para obtener usuario actual
 * - StoriesCarousel: Componente para visualización ampliada
 * - SCSS: Estilos específicos del componente
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StoriesCarousel from './StoriesCarousel';
import '../assets/scss/_03-Componentes/_Stories.scss';

const Stories = ({ userId }) => {
  /**
   * SECCIÓN 2: ESTADOS DEL COMPONENTE
   * - stories: Listado de stories disponibles
   * - selectedStory: Story seleccionada para ver en detalle
   * - viewedStories: IDs de stories ya vistas por el usuario
   */
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewedStories, setViewedStories] = useState([]);

  // Obtenemos usuario actual del contexto
  const { currentUser } = useAuth();

  /**
   * SECCIÓN 3: EFECTOS
   * - Carga inicial de stories desde demo-stories.json
   */
  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await fetch('/demo-stories.json');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error("Error loading stories:", error);
      }
    };

    loadStories();
  }, []);

  /**
   * SECCIÓN 4: MANEJADORES DE EVENTOS
   * - handleStoryOpen: Abre una story en el carrusel
   * - handleCloseCarousel: Cierra el carrusel
   */
  const handleStoryOpen = (story) => {
    setSelectedStory(story);
    if (!viewedStories.includes(story.id)) {
      setViewedStories([...viewedStories, story.id]);
    }
  };

  const handleCloseCarousel = () => {
    setSelectedStory(null);
  };

  /**
   * SECCIÓN 5: RENDERIZADO
   * - Contenedor principal de stories
   * - Story del usuario actual (para crear nueva)
   * - Listado de stories de otros usuarios
   * - Carrusel (solo cuando hay story seleccionada)
   */
  return (
    <div className="stories-wrapper">
      <div className="stories-container">
        {/* Story del usuario actual */}
        <div className="story-item current-user">
          <div className="story-avatar-wrapper">
            <img 
              src={currentUser?.avatar || '/img/default-avatar.png'} 
              alt="Tu historia" 
              className="story-avatar"
            />
            <button className="add-story-btn">+</button>
          </div>
          <span className="story-username">Tu historia</span>
        </div>

        {/* Stories de otros usuarios */}
        {stories.map(story => (
          <div 
            key={story.id} 
            className={`story-item ${viewedStories.includes(story.id) ? 'viewed' : ''}`}
            onClick={() => handleStoryOpen(story)}
          >
            <div className="story-avatar-wrapper">
              <img 
                src={story.user.avatar} 
                alt={story.user.name} 
                className="story-avatar"
              />
            </div>
            <span className="story-username">{story.user.name}</span>
          </div>
        ))}
      </div>

      {/* Carrusel para story seleccionada */}
      {selectedStory && (
        <StoriesCarousel 
          story={selectedStory} 
          onClose={handleCloseCarousel}
          markAsViewed={() => {
            if (!viewedStories.includes(selectedStory.id)) {
              setViewedStories([...viewedStories, selectedStory.id]);
            }
          }}
        />
      )}
    </div>
  );
};

export default Stories;