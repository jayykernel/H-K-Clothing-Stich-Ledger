import { z } from 'zod';

export const RoleEnum = z.enum(['ADMIN', 'MANAGER', 'MERCHANDISER', 'OPERATOR', 'VIEWER']);
export type Role = z.infer<typeof RoleEnum>;

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: RoleEnum.default('VIEWER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
