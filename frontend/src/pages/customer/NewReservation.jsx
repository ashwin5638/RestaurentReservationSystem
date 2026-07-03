import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAvailability, createReservation } from '../../api/reservations';
import ErrorMessage from '../../components/ErrorMessage';

const TIME_SLOTS = [
  '12:00-13:30',
  '13:30-15:00',
  '18:00-19:30',
  '19:30-21:00',
  '21:00-22:30',
];

export default function NewReservation() {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [guests, setGuests] = useState(2);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedTable('');
    setAvailableTables([]);
  }, [date, timeSlot, guests]);

  const handleSearch = async () => {
    if (!date || !timeSlot) return;
    setError('');
    setSearching(true);
    try {
      const res = await checkAvailability({ date, timeSlot, guests });
      setAvailableTables(res.data.data);
      if (res.data.data.length === 0) {
        setError(
          'No tables available for this slot and guest count. Make sure tables are seeded in the database (run `npm run seed` in the backend).'
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable) {
      setError('Please select a table');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createReservation({
        table: selectedTable,
        date,
        timeSlot,
        guests,
      });
      setSuccess('Reservation created successfully!');
      setTimeout(() => navigate('/my-reservations'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>New Reservation</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />
      {success && <div className="alert alert-success">{success}</div>}

      <div className="reservation-form">
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="btn btn-secondary"
          disabled={!date || !timeSlot || searching}
        >
          {searching ? 'Searching...' : 'Check Availability'}
        </button>

        {availableTables.length > 0 && (
          <form onSubmit={handleSubmit} className="table-selection">
            <h3>Available Tables</h3>
            <div className="table-grid">
              {availableTables.map((table) => (
                <button
                  key={table._id}
                  type="button"
                  className={`table-card ${
                    selectedTable === table._id ? 'table-card-selected' : ''
                  }`}
                  onClick={() => setSelectedTable(table._id)}
                >
                  <h3>Table {table.tableNumber}</h3>
                  <p>Capacity: {table.capacity} guests</p>
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedTable || loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
