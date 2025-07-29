// =============================================
// COMPONENTE STORIES - Historias Temporales
// =============================================

/**
 * Propósito:
 * - Mostrar historias de usuarios en formato circular (similar a Instagram)
 * - Permitir ver historias con un click
 * - Mostrar estado visto/no visto con borde de color
 * 
 * Integraciones:
 * - AuthContext: Para datos del usuario actual
 * - StoriesCarousel: Para visualización completa de stories
 * - demo-stories.json: Datos de ejemplo para las stories
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StoriesCarousel from './StoriesCarousel';
import '../assets/scss/_03-Componentes/_Stories.scss';

const Stories = ({ userId }) => {
  // Estados del componente
  const [stories, setStories] = useState([]); // Almacena las stories cargadas
  const [selectedStory, setSelectedStory] = useState(null); // Story seleccionada para ver
  const [viewedStories, setViewedStories] = useState([]); // IDs de stories ya vistas

  // Obtenemos el usuario actual del contexto de autenticación
  const { currentUser } = useAuth();

  // Efecto para cargar las stories de ejemplo al montar el componente
  useEffect(() => {
    const loadStories = async () => {
      try {
        // Cargamos las stories desde el archivo JSON demo
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
   * Maneja la apertura de una story
   * @param {Object} story - Story seleccionada
   */
  const handleStoryOpen = (story) => {
    setSelectedStory(story); // Establece la story seleccionada
    // Marca como vista si no lo estaba
    if (!viewedStories.includes(story.id)) {
      setViewedStories([...viewedStories, story.id]);
    }
  };

  // Cierra el carrusel de stories
  const handleCloseCarousel = () => {
    setSelectedStory(null);
  };

  return (
    <div className="stories-container">
      {/* Story del usuario actual (para crear nueva) */}
      <div className="story-item current-user">
        <div className="story-avatar-wrapper">
          <img 
            src={currentUser?.image || '/img/default-avatar.png'} 
            alt="Tu historia" 
            className="story-avatar"
          />
          {/* Botón para añadir nueva story */}
          <button className="add-story-btn">+</button>
        </div>
        <span className="story-username">Tu historia</span>
      </div>

      {/* Listado de stories de otros usuarios */}
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

      {/* Carrusel para ver story seleccionado (se muestra solo cuando hay una story seleccionada) */}
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