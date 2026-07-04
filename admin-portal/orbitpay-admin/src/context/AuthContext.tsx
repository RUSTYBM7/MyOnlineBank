import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@orbitpay.com',
  password: 'admin123',
  name: 'Sarah Mitchell',
  role: 'superadmin' as const,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('orbitpay_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const userData: User = {
        id: 'admin_001',
        name: DEMO_ADMIN.name,
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role,
      };
      setUser(userData);
      localStorage.setItem('orbitpay_admin_user', JSON.stringify(userData));
      setLoading(false);
      return;
    }

    setLoading(false);
    setError('Invalid credentials. Please try again.');
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orbitpay_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
