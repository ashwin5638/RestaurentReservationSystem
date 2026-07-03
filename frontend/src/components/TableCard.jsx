export default function TableCard({ table, onSelect, selected }) {
  return (
    <button
      className={`table-card ${selected ? 'table-card-selected' : ''}`}
      onClick={() => onSelect(table._id)}
      disabled={!table.isActive && table.isActive !== undefined}
    >
      <h3>Table {table.tableNumber}</h3>
      <p>Capacity: {table.capacity} guests</p>
      {table.isActive === false && <span className="badge badge-inactive">Inactive</span>}
    </button>
  );
}
