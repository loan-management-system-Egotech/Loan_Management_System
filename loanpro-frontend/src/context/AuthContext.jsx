import { useState, useEffect, useCallback } from 'react';
import AuthContext from './authContextDef';
import {
  apiPost,
  setSession,
  clearSession,
  getStoredUser,
  getToken,
} from '../api/apiClient';

// Real authentication provider backed by the Spring Boot API.
// The user object shape returned by the backend is: { id, name, email, role }
// where role is "CUSTOMER" or "ADMIN".
export const AuthProvider = ({ children }) => {
  // Initialise synchronously from localStorage so a page refresh keeps the
  // session and ProtectedRoute does not bounce a logged-in user to /login.
  const [user, setUser] = useState(() => getStoredUser());

  const login = useCallback(async (email, password) => {
    const data = await apiPost('/auth/login', { email, password });
    setSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ fullName, email, password, confirmPassword }) => {
    const data = await apiPost('/auth/register', {
      fullName,
      email,
      password,
      confirmPassword,
    });
    // The backend issues a JWT on registration, so the user is logged in too.
    setSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // When the API client detects an expired/invalid session (a 401 on a
  // protected endpoint) it dispatches `auth:unauthorized`. Drop the user so
  // ProtectedRoute redirects to /login.
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const isAuthenticated = !!user && !!getToken();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
