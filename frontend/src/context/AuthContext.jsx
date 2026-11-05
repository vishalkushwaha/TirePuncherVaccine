import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tpv_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tpv_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Validate current token with /api/auth/me
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .then(userData => {
          setUser(userData);
          localStorage.setItem('tpv_user', JSON.stringify(userData));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to login');
    }
    
    const data = await res.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('tpv_token', data.access_token);
    localStorage.setItem('tpv_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tpv_token');
    localStorage.removeItem('tpv_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        isOwner: user?.role === 'owner',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

