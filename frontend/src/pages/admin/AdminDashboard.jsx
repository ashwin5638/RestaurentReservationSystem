import { useState, useEffect } from 'react';
import { getAllReservations, cancelReservation, updateReservation } from '../../api/reservations';
import { getTables } from '../../api/tables';
import ErrorMessage from '../../components/ErrorMessage';

const TIME_SLOTS = [
  '12:00-13:30',
  '13:30-15:00',
  '18:00-19:30',
  '19:30-21:00',
  '21:00-22:30',
];

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;
      const [resRes, tablesRes] = await Promise.all([
        getAllReservations(params),
        getTables(),
      ]);
      setReservations(resRes.data.data);
      setTables(tablesRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate, filterStatus]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await cancelReservation(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (res) => {
    setEditing(res._id);
    setEditForm({
      table: res.table?._id || '',
      date: res.date,
      timeSlot: res.timeSlot,
      guests: res.guests,
      status: res.status,
    });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await updateReservation(id, editForm);
      setEditing(null);
      fetchData();
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
    <div className="page-container admin-page">
      <h1>Admin Dashboard</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="filters">
        <div className="form-group">
          <label>Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state"><p>No reservations found.</p></div>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Table</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res._id}>
                  {editing === res._id ? (
                    <>
                      <td>{res.user?.name}</td>
                      <td>{res.user?.email}</td>
                      <td>
                        <select
                          name="table"
                          value={editForm.table}
                          onChange={handleEditChange}
                        >
                          {tables.map((t) => (
                            <option key={t._id} value={t._id}>
                              Table {t.tableNumber} (Cap: {t.capacity})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={editForm.date}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <select
                          name="timeSlot"
                          value={editForm.timeSlot}
                          onChange={handleEditChange}
                        >
                          {TIME_SLOTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="guests"
                          min="1"
                          value={editForm.guests}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => saveEdit(res._id)} className="btn btn-sm btn-primary">
                          Save
                        </button>
                        <button onClick={() => setEditing(null)} className="btn btn-sm">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{res.user?.name}</td>
                      <td>{res.user?.email}</td>
                      <td>Table {res.table?.tableNumber}</td>
                      <td>{res.date}</td>
                      <td>{res.timeSlot}</td>
                      <td>{res.guests}</td>
                      <td>
                        <span className={`badge badge-${res.status}`}>
                          {res.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => startEdit(res)} className="btn btn-sm">
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancel(res._id)}
                          className="btn btn-sm btn-danger"
                          disabled={res.status === 'cancelled'}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
