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

  // Backend may return the token in a few different places
  const getAccessToken = (response: ApiSuccessResponse): string | null => {
    if (response.access) return response.access;
    if (response.token) return response.token;
    if (response.access_token) return response.access_token;
    if (response.data?.tokens?.access) return response.data.tokens.access;
    if (response.data?.access) return response.data.access;
    return null;
  };

  const getUserFromResponse = (response: ApiSuccessResponse): UserProfile | null => {
    if (response.user) return response.user;
    if (response.data?.user) return response.data.user;
    return null;
  };

  const login = async (credentials: LoginRequestPayload): Promise<ApiSuccessResponse> => {
    const response = await authService.login(credentials);

    const authToken = getAccessToken(response);
    if (authToken) {
      tokenStorage.setToken(authToken);
      setToken(authToken);
    }

    const userProfile = getUserFromResponse(response);
    if (userProfile) {
      tokenStorage.setUser(userProfile);
      setUser(userProfile);
    }

    return response;
  };

  const register = async (userData: RegisterRequestPayload): Promise<ApiSuccessResponse> => {
    const response = await authService.register(userData);

    const authToken = getAccessToken(response);
    if (authToken) {
      tokenStorage.setToken(authToken);
      setToken(authToken);
    }

    const userProfile = getUserFromResponse(response);
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
