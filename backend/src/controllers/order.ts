import { PrismaClient, Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
  createOrderSchema,
  createOrderFromCostingSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  CreateOrderInput,
  CreateOrderFromCostingInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
} from '@hk-clothing/validation';
import { CostingCalculationsSummary } from '@hk-clothing/api-types';

const prisma = new PrismaClient();

// Helper to generate a unique order number
const generateOrderNumber = async (): Promise<string> => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: `ORD-${dateStr}-`,
      },
    },
  });
  return `ORD-${dateStr}-${(count + 1).toString().padStart(3, '0')}`;
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateOrderInput = createOrderSchema.parse(req.body);

    const orderNumber = data.orderNumber || (await generateOrderNumber());

    // Calculate totals
    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = data.items.reduce(
      (sum, item) => sum + (item.totalPrice || (item.unitPrice || 0) * item.quantity),
      0
    );

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerName: data.buyerName,
        styleNumber: data.styleNumber,
        styleName: data.styleName,
        costingRecordId: data.costingRecordId,
        notes: data.notes,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        totalQuantity,
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice || (item.unitPrice || 0) * item.quantity,
          })),
        },
        statusHistory: {
          create: {
            status: 'DRAFT',
            notes: 'Order created',
          },
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrderFromCosting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateOrderFromCostingInput = createOrderFromCostingSchema.parse(req.body);

    const costingRecord = await prisma.costingRecord.findUnique({
      where: { id: data.costingRecordId },
    });

    if (!costingRecord) {
      return res.status(404).json({ success: false, error: 'Costing record not found' });
    }

    const orderNumber = data.orderNumber || (await generateOrderNumber());

    // Use costing record data to populate order
    const styleDetails: any = costingRecord.styleDetails;
    const calculations: any = costingRecord.calculations;
    // Map sizes from CostingCalculationsSummary
    const sizeBreakdown = calculations.sizeBreakdown as Record<string, any>;

    const itemsData = Object.keys(sizeBreakdown).map((size) => {
      const breakdown = sizeBreakdown[size];
      return {
        size: size,
        quantity: breakdown.quantity,
        unitPrice: breakdown.fabricCostPerPiece, // Basic costing estimation
        totalPrice: breakdown.totalCostForSize,
      };
    });

    const totalQuantity = itemsData.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = itemsData.reduce((sum, item) => sum + item.totalPrice, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerName: data.buyerName,
        styleNumber: styleDetails.styleNumber,
        styleName: styleDetails.styleName,
        costingRecordId: data.costingRecordId,
        notes: data.notes,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        totalQuantity,
        totalAmount,
        items: {
          create: itemsData,
        },
        statusHistory: {
          create: {
            status: 'DRAFT',
            notes: 'Created from costing record',
          },
        },
      },
      include: {
        items: true,
        costingRecord: true,
      },
    });

    // Link the order to the costing record
    await prisma.costingRecord.update({
      where: { id: data.costingRecordId },
      data: { orderId: order.id },
    });

    return res.status(201).json({
      success: true,
      message: 'Order created from costing successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      status,
      buyerName,
      styleNumber,
      isArchived = 'false',
      page = '1',
      limit = '50',
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.OrderWhereInput = {
      isArchived: isArchived === 'true',
    };

    if (status) {
      where.status = status as any;
    }
    if (buyerName) {
      where.buyerName = { contains: buyerName as string, mode: 'insensitive' };
    }
    if (styleNumber) {
      where.styleNumber = { contains: styleNumber as string, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { buyerName: { contains: search as string, mode: 'insensitive' } },
        { styleNumber: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
        include: {
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      success: true,
      data: orders,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        costingRecord: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: UpdateOrderInput = updateOrderSchema.parse(req.body);

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (existingOrder.isArchived) {
      return res.status(400).json({ success: false, error: 'Cannot update an archived order' });
    }

    // Since items update can be complex, for simplicity we replace all items if provided
    // In a real production app, we would use upsert or calculate difference
    const updateData: Prisma.OrderUpdateInput = {
      buyerName: data.buyerName,
      styleNumber: data.styleNumber,
      styleName: data.styleName,
      notes: data.notes,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
    };

    if (data.items && data.items.length > 0) {
      updateData.items = {
        deleteMany: {},
        create: data.items.map((item) => ({
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice || (item.unitPrice || 0) * item.quantity,
        })),
      };

      // Recalculate totals
      updateData.totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
      updateData.totalAmount = data.items.reduce(
        (sum, item) => sum + (item.totalPrice || (item.unitPrice || 0) * item.quantity),
        0
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return res.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: UpdateOrderStatusInput = updateOrderStatusSchema.parse(req.body);

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (existingOrder.isArchived) {
      return res.status(400).json({ success: false, error: 'Cannot update an archived order' });
    }

    if (existingOrder.status === data.status) {
      return res.status(400).json({ success: false, error: 'Order is already in this status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        statusHistory: {
          create: {
            status: data.status,
            notes: data.notes,
          },
        },
      },
      include: {
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    return res.json({
      success: true,
      message: `Order status updated to ${data.status}`,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Soft delete / archive
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await prisma.order.update({
      where: { id },
      data: { isArchived: true },
    });

    return res.json({
      success: true,
      message: 'Order archived successfully',
    });
  } catch (err) {
    next(err);
  }
};
