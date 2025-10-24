
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    const storedUser = localStorage.getItem('agriglobal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    // In a real app, this would be an API call.
    // Here, we'll use hardcoded credentials for the demo.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'GAS1234') {
          const userData: User = { username: 'admin' };
          localStorage.setItem('agriglobal_user', JSON.stringify(userData));
          setUser(userData);
          resolve();
        } else {
          reject(new Error('Usuario o contraseña incorrectos.'));
        }
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    localStorage.removeItem('agriglobal_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
