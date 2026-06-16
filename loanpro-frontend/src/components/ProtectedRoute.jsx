import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Guards routes. With no `allowedRoles`, just requires a logged-in user.
// With `allowedRoles`, also requires the user's role to be in the list
// (e.g. ['ADMIN']) — otherwise the user is sent back to their dashboard.
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(String(user.role).toUpperCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
