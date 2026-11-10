import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authControllerLogin, authControllerSignup, authControllerMe } from '@/src/api/generated/api';
import { getErrorMessage } from '@/src/api/customFetch';
import type { UserInfoDto } from '@/src/api/generated/schemas';

interface AuthContextType {
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, playerName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          const res = await authControllerMe();
          setUser(res?.user ?? null);
        }
      } catch {
        await AsyncStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authControllerLogin({ email, password });
    await AsyncStorage.setItem('auth_token', res?.token ?? '');
    setUser(res?.user ?? null);
  }, []);

  const signup = useCallback(async (email: string, password: string, playerName: string) => {
    const res = await authControllerSignup({ email, password, name: playerName, playerName });
    await AsyncStorage.setItem('auth_token', res?.token ?? '');
    setUser(res?.user ?? null);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
