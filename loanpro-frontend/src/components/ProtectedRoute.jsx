import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If there is no user logged in, redirect them to the login page!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they ARE logged in, let them through to the child routes
  return <Outlet />;
};

export default ProtectedRoute;