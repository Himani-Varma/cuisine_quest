import { useContext } from 'react';
import { AuthContextObj } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContextObj);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext');
  }
  return context;
};

export default useAuth;
