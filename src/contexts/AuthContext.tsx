import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, cpf: string) => {
    // Simulação de login - em produção, isso seria uma chamada à API
    const foundUser = mockUsers.find(
      u => u.email === email && u.cpf === cpf
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: RegisterData) => {
    // Simulação de registro - em produção, isso seria uma chamada à API
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      cpf: userData.cpf,
      department: userData.department,
      position: userData.position,
      points: 0,
      level: 1,
      badges: [],
      createdAt: new Date()
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};