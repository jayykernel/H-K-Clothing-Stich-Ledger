export type Role = 'ADMIN' | 'MANAGER' | 'MERCHANDISER' | 'OPERATOR' | 'VIEWER';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
