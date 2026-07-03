import { useState, useEffect } from 'react';
import { getTables, createTable, updateTable, deleteTable } from '../../api/tables';
import ErrorMessage from '../../components/ErrorMessage';

export default function ManageTables() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: '' });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await getTables();
      setTables(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTable({
        tableNumber: Number(newTable.tableNumber),
        capacity: Number(newTable.capacity),
      });
      setNewTable({ tableNumber: '', capacity: '' });
      fetchTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (table) => {
    setEditing(table._id);
    setEditForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      isActive: table.isActive,
    });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await updateTable(id, {
        tableNumber: Number(editForm.tableNumber),
        capacity: Number(editForm.capacity),
        isActive: editForm.isActive === 'true' || editForm.isActive === true,
      });
      setEditing(null);
      fetchTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this table?')) return;
    try {
      await deleteTable(id);
      fetchTables();
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
      <h1>Manage Tables</h1>
      <ErrorMessage message={error} onClose={() => setError('')} />

      <form onSubmit={handleCreate} className="inline-form">
        <h3>Add New Table</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Table Number</label>
            <input
              type="number"
              min="1"
              value={newTable.tableNumber}
              onChange={(e) =>
                setNewTable({ ...newTable, tableNumber: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              min="1"
              value={newTable.capacity}
              onChange={(e) =>
                setNewTable({ ...newTable, capacity: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Table
          </button>
        </div>
      </form>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Table #</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id}>
                {editing === table._id ? (
                  <>
                    <td>
                      <input
                        type="number"
                        name="tableNumber"
                        min="1"
                        value={editForm.tableNumber}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="capacity"
                        min="1"
                        value={editForm.capacity}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <select
                        name="isActive"
                        value={editForm.isActive}
                        onChange={handleEditChange}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => saveEdit(table._id)} className="btn btn-sm btn-primary">
                        Save
                      </button>
                      <button onClick={() => setEditing(null)} className="btn btn-sm">
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{table.tableNumber}</td>
                    <td>{table.capacity}</td>
                    <td>
                      <span className={`badge badge-${table.isActive ? 'confirmed' : 'cancelled'}`}>
                        {table.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => startEdit(table)} className="btn btn-sm">
                        Edit
                      </button>
                      {table.isActive && (
                        <button onClick={() => handleDeactivate(table._id)} className="btn btn-sm btn-danger">
                          Deactivate
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
