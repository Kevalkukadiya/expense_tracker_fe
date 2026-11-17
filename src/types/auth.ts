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

export interface AuthTokens {
  access?: string;
  refresh?: string;
}

export interface ApiSuccessResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: {
    user?: UserProfile;
    tokens?: AuthTokens;
    access?: string;
    refresh?: string;
  };
  // SimpleJWT login returns these at the top level
  access?: string;
  refresh?: string;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile;
}

export interface ApiErrorResponse {
  message?: string | Array<string | Record<string, string | string[]>>;
  error?: string | number;
  errors?: Record<string, string | string[]> | null;
  status_code?: number;
  status?: boolean | string;
  detail?: string;
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
