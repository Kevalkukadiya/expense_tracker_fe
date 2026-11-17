export interface RegisterRequestPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  currency: string;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface UserProfile {
  id?: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
  status_code?: number;
}

export type RegisterFormData = RegisterRequestPayload;
export type LoginFormData = LoginRequestPayload;

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<ApiSuccessResponse>;
  register: (data: RegisterFormData) => Promise<ApiSuccessResponse>;
  logout: () => void;
}
