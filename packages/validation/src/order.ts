import { z } from 'zod';

export const OrderStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

export const orderItemSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative'),
  unitPrice: z.number().positive().optional(),
  totalPrice: z.number().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().max(50).optional(),
  buyerName: z.string().min(1, 'Buyer name is required').max(100),
  styleNumber: z.string().min(1, 'Style number is required').max(50),
  styleName: z.string().max(255).optional(),
  costingRecordId: z.string().cuid().optional(),
  notes: z.string().max(500).optional(),
  deliveryDate: z.string().datetime().optional(), // Or z.date()
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const createOrderFromCostingSchema = z.object({
  costingRecordId: z.string().cuid('Valid Costing Record ID is required'),
  buyerName: z.string().min(1, 'Buyer name is required').max(100),
  orderNumber: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
  deliveryDate: z.string().datetime().optional(),
});

export const updateOrderSchema = z.object({
  buyerName: z.string().min(1).max(100).optional(),
  styleNumber: z.string().min(1).max(50).optional(),
  styleName: z.string().max(255).optional(),
  notes: z.string().max(500).optional(),
  deliveryDate: z.string().datetime().optional(),
  items: z.array(orderItemSchema).min(1).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
  notes: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderFromCostingInput = z.infer<typeof createOrderFromCostingSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
