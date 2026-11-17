import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './constants';
import type { UserProfile } from '../types/auth';

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const tokenStorage = {
  getToken: (): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (err) {
      console.error('Failed to save auth token to localStorage', err);
    }
  },

  removeToken: (): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (err) {
      console.error('Failed to remove auth token from localStorage', err);
    }
  },

  getUser: (): UserProfile | null => {
    if (!isBrowser()) return null;
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? (JSON.parse(data) as UserProfile) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: UserProfile): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user to localStorage', err);
    }
  },

  removeUser: (): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (err) {
      console.error('Failed to remove user from localStorage', err);
    }
  },

  clearAll: (): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (err) {
      console.error('Failed to clear auth storage', err);
    }
  },
};
