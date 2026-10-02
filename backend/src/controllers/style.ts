import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
  createStyleSchema,
  updateStyleSchema,
  CreateStyleInput,
  UpdateStyleInput,
} from '@hk-clothing/validation';

const prisma = new PrismaClient();

export const createStyle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateStyleInput = createStyleSchema.parse(req.body);

    const existingStyle = await prisma.style.findUnique({
      where: { styleNumber: data.styleNumber },
    });
    if (existingStyle) {
      return res.status(409).json({
        success: false,
        error: 'Style number already exists',
      });
    }

    const style = await prisma.style.create({
      data: {
        styleNumber: data.styleNumber,
        styleName: data.styleName,
        fabricType: data.fabricType,
        gsm: data.gsm,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Style created successfully',
      data: {
        id: style.id,
        styleNumber: style.styleNumber,
        styleName: style.styleName,
        fabricType: style.fabricType,
        gsm: style.gsm,
        createdAt: style.createdAt.toISOString(),
        updatedAt: style.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getStyles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const styles = await prisma.style.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        fabrics: true,
      },
    });

    return res.json({
      success: true,
      data: styles.map((style) => ({
        id: style.id,
        styleNumber: style.styleNumber,
        styleName: style.styleName,
        fabricType: style.fabricType,
        gsm: style.gsm,
        fabricCount: style.fabrics.length,
        createdAt: style.createdAt.toISOString(),
        updatedAt: style.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getStyleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const style = await prisma.style.findUnique({
      where: { id },
      include: {
        fabrics: true,
      },
    });

    if (!style) {
      return res.status(404).json({
        success: false,
        error: 'Style not found',
      });
    }

    return res.json({
      success: true,
      data: {
        id: style.id,
        styleNumber: style.styleNumber,
        styleName: style.styleName,
        fabricType: style.fabricType,
        gsm: style.gsm,
        fabrics: style.fabrics.map((fabric) => ({
          id: fabric.id,
          serialNumber: fabric.serialNumber,
          color: fabric.color,
          pricePerKg: fabric.pricePerKg.toString(),
          createdAt: fabric.createdAt.toISOString(),
          updatedAt: fabric.updatedAt.toISOString(),
        })),
        createdAt: style.createdAt.toISOString(),
        updatedAt: style.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateStyle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: UpdateStyleInput = updateStyleSchema.parse(req.body);

    const existingStyle = await prisma.style.findUnique({ where: { id } });
    if (!existingStyle) {
      return res.status(404).json({
        success: false,
        error: 'Style not found',
      });
    }

    const style = await prisma.style.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: 'Style updated successfully',
      data: {
        id: style.id,
        styleNumber: style.styleNumber,
        styleName: style.styleName,
        fabricType: style.fabricType,
        gsm: style.gsm,
        createdAt: style.createdAt.toISOString(),
        updatedAt: style.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStyle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingStyle = await prisma.style.findUnique({ where: { id } });
    if (!existingStyle) {
      return res.status(404).json({
        success: false,
        error: 'Style not found',
      });
    }

    await prisma.style.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Style deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
