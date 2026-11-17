import { apiClient } from './apiClient';
import type {
  RegisterRequestPayload,
  LoginRequestPayload,
  ApiSuccessResponse,
} from '../types/auth';

export const AUTH_ENDPOINTS = {
  REGISTER: import.meta.env.VITE_AUTH_REGISTER_PATH || 'user/auth/register/',
  LOGIN: import.meta.env.VITE_AUTH_LOGIN_PATH || 'user/auth/login/',
  PROFILE: import.meta.env.VITE_AUTH_PROFILE_PATH || '/auth/me',
};

export const authService = {
  async register(payload: RegisterRequestPayload): Promise<ApiSuccessResponse> {
    const response = await apiClient.post<ApiSuccessResponse>(
      AUTH_ENDPOINTS.REGISTER,
      payload
    );
    return response.data;
  },

  async login(payload: LoginRequestPayload): Promise<ApiSuccessResponse> {
    const response = await apiClient.post<ApiSuccessResponse>(
      AUTH_ENDPOINTS.LOGIN,
      payload
    );
    return response.data;
  },

  async getProfile(): Promise<ApiSuccessResponse> {
    const response = await apiClient.get<ApiSuccessResponse>(
      AUTH_ENDPOINTS.PROFILE
    );
    return response.data;
  },
};
