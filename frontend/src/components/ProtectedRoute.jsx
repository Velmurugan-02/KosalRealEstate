import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f4f6f9',
        color: '#d96b00',
        fontWeight: 600
      }}>
        Loading Kosal CRM...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
