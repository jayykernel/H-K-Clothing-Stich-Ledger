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

// Costing validation schemas
export const styleDetailSchema = z.object({
  styleNumber: z.string().min(1, 'Style number is required'),
  styleName: z.string().min(1, 'Style name is required'),
  fabricType: z.string().min(1, 'Fabric type is required'),
  gsm: z.number().positive('GSM must be positive'),
});

export const fabricDetailSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required'),
  color: z.string().min(1, 'Color is required'),
  pricePerKg: z.number().positive('Price per kg must be positive'),
  fabricType: z.string().optional(),
  associatedComponents: z.array(z.string()).optional(),
});

export const componentMeasurementSchema = z.object({
  length: z.number().positive('Length must be positive'),
  width: z.number().positive('Width must be positive'),
  panelCount: z.number().int().positive().optional(),
  fabricFactor: z.number().positive().optional(),
});

export const componentSpecificationSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  fabricSerialNumber: z.string().min(1, 'Fabric serial number is required'),
  gsm: z.number().positive('GSM must be positive'),
  panelCount: z.number().int().positive().default(1),
  fabricFactor: z.number().positive().default(1),
});

export const costingInputSchema = z.object({
  orderId: z.string().optional().nullable(),
  styleDetails: styleDetailSchema,
  fabricDetails: z.array(fabricDetailSchema).min(1, 'At least one fabric is required'),
  sizeQuantities: z.record(z.string(), z.number().int().nonnegative('Quantity cannot be negative')),
  measurements: z.record(
    z.string(), // size
    z.record(z.string(), componentMeasurementSchema) // component -> measurement
  ),
  componentDetails: z.array(componentSpecificationSchema).min(1, 'At least one component is required'),
});

export type CostingInput = z.infer<typeof costingInputSchema>;
