import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className={`navbar ${isAdmin ? 'navbar-admin' : ''}`}>
      <div className="navbar-brand">
        <Link to={isAdmin ? '/admin' : '/'}>
          {isAdmin ? 'Admin Panel' : 'La Maison'}
        </Link>
      </div>
      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : isAdmin ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/tables">Tables</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/book">Book a Table</Link>
            <Link to="/my-reservations">My Reservations</Link>
          </>
        )}
        {user && (
          <>
            <span className="navbar-user">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
