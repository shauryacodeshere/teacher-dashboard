import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      // In a real app we'd decode token or fetch profile to verify, but here we just store user data on login
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (jwtData, userData) => {
    setToken(jwtData);
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
