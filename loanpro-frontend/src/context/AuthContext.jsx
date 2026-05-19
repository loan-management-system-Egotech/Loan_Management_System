import { useState } from 'react';
import AuthContext from './authContextDef';


// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // State to hold our user data. If it's null, they are logged out.
  const [user, setUser] = useState(null);

  // Fake login function (Later, you will swap this with a real API call)
  const login = async (email) => {
    // Simulating an API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // We create a fake user object and save it to state
        const fakeUser = {
          name: "Nimal Perera",
          email: email,
          role: "customer" // You could change this to "admin" to test admin views!
        };
        setUser(fakeUser);
        resolve(true);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};