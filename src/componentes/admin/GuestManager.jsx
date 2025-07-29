import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from '../../firebase';
import '../../assets/scss/_03-Componentes/_GuestManager.scss';

const GuestManager = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar invitados desde Firebase
  useEffect(() => {
    const guestsRef = ref(db, 'guests');
    const unsubscribe = onValue(guestsRef, (snapshot) => {
      const guestsData = snapshot.val() || {};
      const guestsArray = Object.keys(guestsData).map(key => ({
        id: key,
        ...guestsData[key]
      }));
      setGuests(guestsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Actualizar estado de invitado
  const updateGuestStatus = async (guestId, status) => {
    try {
      await update(ref(db, `guests/${guestId}`), { status });
    } catch (error) {
      console.error("Error updating guest:", error);
    }
  };

  // Filtrar invitados por término de búsqueda
  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-guests">Cargando lista de invitados...</div>;

  return (
    <div className="guest-manager">
      <div className="manager-header">
        <h2>Gestión de Invitados</h2>
        <input
          type="text"
          placeholder="Buscar invitado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="guests-table-container">
        <table className="guests-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Confirmación</th>
              <th>Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map(guest => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td>{guest.email || '-'}</td>
                <td>{guest.confirmed ? 'Confirmado' : 'Pendiente'}</td>
                <td>{guest.accessed ? 'Sí' : 'No'}</td>
                <td className="actions-cell">
                  <button 
                    onClick={() => updateGuestStatus(guest.id, { confirmed: true })}
                    className="btn-confirm"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => updateGuestStatus(guest.id, { confirmed: false })}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestManager;