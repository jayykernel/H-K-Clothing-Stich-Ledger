import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { costingInputSchema, CostingInput } from '@hk-clothing/validation';
import { calculateCosting } from '@hk-clothing/business-logic';

const prisma = new PrismaClient();

export const calculateAndSaveCosting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CostingInput = costingInputSchema.parse(req.body);

    // Call business logic calculation engine
    // Convert null orderId to undefined for the calculation
    const calculationInput = {
      ...data,
      orderId: data.orderId ?? undefined,
    };
    const calculations = calculateCosting(calculationInput);

    // Save to database
    const record = await prisma.costingRecord.create({
      data: {
        orderId: data.orderId || null,
        styleDetails: data.styleDetails as any,
        fabricDetails: data.fabricDetails as any,
        sizeQuantities: data.sizeQuantities as any,
        measurements: data.measurements as any,
        componentDetails: data.componentDetails as any,
        calculations: calculations as any,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Costing calculated and saved successfully',
      data: {
        id: record.id,
        orderId: record.orderId,
        styleDetails: record.styleDetails,
        fabricDetails: record.fabricDetails,
        sizeQuantities: record.sizeQuantities,
        measurements: record.measurements,
        componentDetails: record.componentDetails,
        calculations: record.calculations,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCostingRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.costingRecord.findMany({
      orderBy: { createdAt: 'desc' },
      // Might just want to return a summary for list view
      select: {
        id: true,
        orderId: true,
        styleDetails: true,
        calculations: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 100, // Limit for performance
    });

    return res.json({
      success: true,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

export const getCostingRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const record = await prisma.costingRecord.findUnique({
      where: { id },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Costing record not found',
      });
    }

    return res.json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
};
