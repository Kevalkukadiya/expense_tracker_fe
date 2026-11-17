import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  AuthContextType,
  UserProfile,
  RegisterRequestPayload,
  LoginRequestPayload,
  ApiSuccessResponse,
} from '../types/auth';
import { authService } from '../services/authService';
import { tokenStorage } from '../utils/tokenStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = tokenStorage.getToken();
    const savedUser = tokenStorage.getUser();

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequestPayload): Promise<ApiSuccessResponse> => {
    const response = await authService.login(credentials);

    const authToken = response.token || response.access_token;
    if (authToken) {
      tokenStorage.setToken(authToken);
      setToken(authToken);
    }

    const userProfile = response.user;
    if (userProfile) {
      tokenStorage.setUser(userProfile);
      setUser(userProfile);
    }

    return response;
  };

  const register = async (userData: RegisterRequestPayload): Promise<ApiSuccessResponse> => {
    const response = await authService.register(userData);

    const authToken = response.token || response.access_token;
    if (authToken) {
      tokenStorage.setToken(authToken);
      setToken(authToken);
    }

    const userProfile = response.user;
    if (userProfile) {
      tokenStorage.setUser(userProfile);
      setUser(userProfile);
    }

    return response;
  };

  const logout = (): void => {
    tokenStorage.clearAll();
    setToken(null);
    setUser(null);
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
