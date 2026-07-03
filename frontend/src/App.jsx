import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import NewReservation from './pages/customer/NewReservation';
import MyReservations from './pages/customer/MyReservations';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageTables from './pages/admin/ManageTables';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/book'} /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/book'} /> : <Register />}
          />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <RoleRoute role="customer">
                  <NewReservation />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute>
                <RoleRoute role="customer">
                  <MyReservations />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute role="admin">
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <ProtectedRoute>
                <RoleRoute role="admin">
                  <ManageTables />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
