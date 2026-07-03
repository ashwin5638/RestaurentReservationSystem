export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="alert alert-error">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="alert-close">
          &times;
        </button>
      )}
    </div>
  );
}
