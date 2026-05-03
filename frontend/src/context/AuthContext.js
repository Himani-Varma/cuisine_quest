import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

export const AuthContextObj = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.getCurrentUser();
          setUser(data.user);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const { data } = await authAPI.register({ username, email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContextObj.Provider value={{ user, setUser, loading, error, login, register, logout }}>
      {children}
    </AuthContextObj.Provider>
  );
};

export default AuthContext;
