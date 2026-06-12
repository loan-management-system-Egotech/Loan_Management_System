import { useContext } from 'react';
import AuthContext from './authContextDef';

// Custom hook to easily use the Auth context anywhere
export const useAuth = () => {
  return useContext(AuthContext);
};
