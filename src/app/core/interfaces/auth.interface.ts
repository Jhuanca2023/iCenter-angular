export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: AuthUserLegacy;
  token: string;
  refreshToken?: string;
}

export interface AuthUserLegacy {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
