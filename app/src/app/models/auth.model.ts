export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}