// Re-export everything from auth, costing and order modules
export * from './auth';
export * from './costing';
export * from './order';

import { z } from 'zod';

// Style validation
export const createStyleSchema = z.object({
  styleNumber: z.string().min(1, 'Style number is required').max(50),
  styleName: z.string().min(1, 'Style name is required').max(255),
  fabricType: z.string().min(1, 'Fabric type is required').max(100),
  gsm: z.number().int().positive('GSM must be a positive integer'),
});

export const updateStyleSchema = z.object({
  styleName: z.string().min(1).max(255).optional(),
  fabricType: z.string().min(1).max(100).optional(),
  gsm: z.number().int().positive().optional(),
});

export type CreateStyleInput = z.infer<typeof createStyleSchema>;
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;

// Fabric validation
export const createFabricSchema = z.object({
  styleId: z.string().min(1, 'Style ID is required'),
  serialNumber: z.string().min(1, 'Serial number is required').max(100),
  color: z.string().min(1, 'Color is required').max(100),
  pricePerKg: z.number().positive('Price per kg must be positive'),
});

export const updateFabricSchema = z.object({
  color: z.string().min(1).max(100).optional(),
  pricePerKg: z.number().positive().optional(),
});

export type CreateFabricInput = z.infer<typeof createFabricSchema>;
export type UpdateFabricInput = z.infer<typeof updateFabricSchema>;

// Component validation
export const createComponentSchema = z.object({
  name: z.string().min(1, 'Component name is required').max(100),
  description: z.string().max(500).optional(),
});

export const updateComponentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export type CreateComponentInput = z.infer<typeof createComponentSchema>;
export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;
