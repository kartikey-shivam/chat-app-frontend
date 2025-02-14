"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  login: (jwt: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const storedJwt = Cookies.get('jwt');
    const storedUser = localStorage.getItem('user');
    
    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (jwt: string, user: User) => {
    setJwt(jwt);
    setUser(user);
    Cookies.set('jwt', jwt, { secure: true, sameSite: 'strict' });
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    Cookies.remove('jwt');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);