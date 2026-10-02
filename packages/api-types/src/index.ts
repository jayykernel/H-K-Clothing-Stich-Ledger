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

// Style DTOs
export interface StyleDTO {
  id: string;
  styleNumber: string;
  styleName: string;
  fabricType: string;
  gsm: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStyleInput {
  styleNumber: string;
  styleName: string;
  fabricType: string;
  gsm: number;
}

export interface UpdateStyleInput {
  styleName?: string;
  fabricType?: string;
  gsm?: number;
}

// Fabric DTOs
export interface FabricDTO {
  id: string;
  styleId: string;
  serialNumber: string;
  color: string;
  pricePerKg: string; // Decimal as string to preserve precision
  createdAt: string;
  updatedAt: string;
}

export interface CreateFabricInput {
  styleId: string;
  serialNumber: string;
  color: string;
  pricePerKg: number;
}

export interface UpdateFabricInput {
  color?: string;
  pricePerKg?: number;
}

// Component DTOs
export interface ComponentDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComponentInput {
  name: string;
  description?: string;
}

export interface UpdateComponentInput {
  name?: string;
  description?: string;
}
