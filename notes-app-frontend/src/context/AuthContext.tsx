import React, { createContext, useState, useEffect,type ReactNode } from 'react';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Định nghĩa props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export const AuthProvider = ({ children, apolloClient }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Sau khi login, reset store để đảm bảo các query cũ được xóa
    // và các query mới sẽ được thực hiện với token mới
    apolloClient.resetStore();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // Dòng này thay thế cho việc xóa header của axios
    // Nó sẽ xóa toàn bộ cache của Apollo và buộc các query phải chạy lại
    // Khi các query chạy lại, authLink sẽ thấy không có token và gửi request không có header Authorization
    apolloClient.resetStore();
  };

  const value = {
    isAuthenticated: !!token,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};