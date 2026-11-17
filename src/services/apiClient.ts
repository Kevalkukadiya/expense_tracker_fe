import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { tokenStorage } from '../utils/tokenStorage';
import type { ApiErrorResponse } from '../types/auth';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      tokenStorage.clearAll();
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverData = error.response?.data as ApiErrorResponse | undefined;

    if (serverData?.message) {
      return serverData.message;
    }

    if (serverData?.error) {
      return serverData.error;
    }

    if (serverData?.errors && typeof serverData.errors === 'object') {
      const messages = Object.entries(serverData.errors)
        .map(([field, err]) => {
          const text = Array.isArray(err) ? err.join(', ') : err;
          return `${field}: ${text}`;
        })
        .join('; ');
      if (messages) return messages;
    }

    if (error.response?.status === 400) {
      return 'Bad request. Please verify your submitted information.';
    }
    if (error.response?.status === 401) {
      return 'Invalid credentials or session expired. Please log in again.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.response?.status === 409) {
      return 'An account with this email already exists.';
    }
    if (error.response?.status && error.response.status >= 500) {
      return 'Server error occurred. Please try again later.';
    }

    if (error.code === 'ERR_NETWORK') {
      return `Unable to reach the backend server at ${API_BASE_URL}. Please ensure your backend is running.`;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};
