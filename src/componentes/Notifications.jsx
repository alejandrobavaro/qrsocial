import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BsBell, BsBellFill } from 'react-icons/bs';
import '../assets/scss/_03-Componentes/_Notifications.scss';

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Simulación de notificaciones en tiempo real
  useEffect(() => {
    // En una implementación real, usarías WebSockets o Firebase Realtime Database
    const mockNotifications = [
      {
        id: '1',
        type: 'like',
        userId: 'user2',
        userName: 'Carlos López',
        postId: 'post1',
        timestamp: new Date(Date.now() - 10000).toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'comment',
        userId: 'user3',
        userName: 'Ana Martínez',
        postId: 'post1',
        text: '¡Qué bonita foto!',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        read: false
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simular nueva notificación cada 30 segundos (solo para demo)
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'like' : 'comment',
        userId: `user${Math.floor(Math.random() * 5) + 1}`,
        userName: ['Juan', 'María', 'Pedro', 'Laura', 'Sofía'][Math.floor(Math.random() * 5)],
        postId: `post${Math.floor(Math.random() * 3) + 1}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({...n, read: true}))
    );
    setUnreadCount(0);
  };

  return (
    <div className="notifications-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
      >
        {unreadCount > 0 ? (
          <>
            <BsBellFill className="bell-icon" />
            <span className="badge">{unreadCount}</span>
          </>
        ) : (
          <BsBell className="bell-icon" />
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>Notificaciones</h4>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="mark-all-read"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <img 
                    src={`/img/avatars/${notification.userId}.jpg` || '/img/default-avatar.png'} 
                    alt={notification.userName} 
                    className="notification-avatar"
                  />
                  <div className="notification-content">
                    <p>
                      <strong>{notification.userName}</strong> {notification.type === 'like' ? 'le gusta tu publicación' : 'comentó: ' + notification.text}
                    </p>
                    <small>{new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-notifications">No hay notificaciones</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;