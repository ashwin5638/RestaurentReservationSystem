import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/my-reservations'} replace />;
  }

  return children;
}
