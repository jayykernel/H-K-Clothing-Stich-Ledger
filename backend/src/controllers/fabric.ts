import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
  createFabricSchema,
  updateFabricSchema,
  CreateFabricInput,
  UpdateFabricInput,
} from '@hk-clothing/validation';

const prisma = new PrismaClient();

export const createFabric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateFabricInput = createFabricSchema.parse(req.body);

    const style = await prisma.style.findUnique({ where: { id: data.styleId } });
    if (!style) {
      return res.status(404).json({
        success: false,
        error: 'Style not found',
      });
    }

    const existingFabric = await prisma.fabric.findUnique({
      where: { serialNumber: data.serialNumber },
    });
    if (existingFabric) {
      return res.status(409).json({
        success: false,
        error: 'Fabric serial number already exists',
      });
    }

    const fabric = await prisma.fabric.create({
      data: {
        styleId: data.styleId,
        serialNumber: data.serialNumber,
        color: data.color,
        pricePerKg: data.pricePerKg,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Fabric created successfully',
      data: {
        id: fabric.id,
        styleId: fabric.styleId,
        serialNumber: fabric.serialNumber,
        color: fabric.color,
        pricePerKg: fabric.pricePerKg.toString(),
        createdAt: fabric.createdAt.toISOString(),
        updatedAt: fabric.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getFabrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { styleId } = req.query;

    const fabrics = await prisma.fabric.findMany({
      where: styleId ? { styleId: styleId as string } : undefined,
      include: {
        style: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: fabrics.map((fabric) => ({
        id: fabric.id,
        styleId: fabric.styleId,
        serialNumber: fabric.serialNumber,
        color: fabric.color,
        pricePerKg: fabric.pricePerKg.toString(),
        style: {
          styleNumber: fabric.style.styleNumber,
          styleName: fabric.style.styleName,
        },
        createdAt: fabric.createdAt.toISOString(),
        updatedAt: fabric.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getFabricById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const fabric = await prisma.fabric.findUnique({
      where: { id },
      include: {
        style: true,
      },
    });

    if (!fabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found',
      });
    }

    return res.json({
      success: true,
      data: {
        id: fabric.id,
        styleId: fabric.styleId,
        serialNumber: fabric.serialNumber,
        color: fabric.color,
        pricePerKg: fabric.pricePerKg.toString(),
        style: {
          id: fabric.style.id,
          styleNumber: fabric.style.styleNumber,
          styleName: fabric.style.styleName,
          fabricType: fabric.style.fabricType,
          gsm: fabric.style.gsm,
        },
        createdAt: fabric.createdAt.toISOString(),
        updatedAt: fabric.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateFabric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: UpdateFabricInput = updateFabricSchema.parse(req.body);

    const existingFabric = await prisma.fabric.findUnique({ where: { id } });
    if (!existingFabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found',
      });
    }

    const fabric = await prisma.fabric.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: 'Fabric updated successfully',
      data: {
        id: fabric.id,
        styleId: fabric.styleId,
        serialNumber: fabric.serialNumber,
        color: fabric.color,
        pricePerKg: fabric.pricePerKg.toString(),
        createdAt: fabric.createdAt.toISOString(),
        updatedAt: fabric.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFabric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingFabric = await prisma.fabric.findUnique({ where: { id } });
    if (!existingFabric) {
      return res.status(404).json({
        success: false,
        error: 'Fabric not found',
      });
    }

    await prisma.fabric.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Fabric deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
