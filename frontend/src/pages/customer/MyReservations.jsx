import { useState, useEffect } from 'react';
import { getMyReservations, cancelReservation } from '../../api/reservations';
import ErrorMessage from '../../components/ErrorMessage';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await getMyReservations();
      setReservations(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await cancelReservation(id);
      fetchReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Reservations</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations yet.</p>
        </div>
      ) : (
        <div className="reservation-list">
          {reservations.map((res) => (
            <div key={res._id} className={`reservation-card ${res.status}`}>
              <div className="reservation-info">
                <h3>Table {res.table?.tableNumber}</h3>
                <p>Date: {res.date}</p>
                <p>Time: {res.timeSlot}</p>
                <p>Guests: {res.guests}</p>
                <span className={`badge badge-${res.status}`}>{res.status}</span>
              </div>
              {res.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(res._id)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
