import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import {
  createComponentSchema,
  updateComponentSchema,
  CreateComponentInput,
  UpdateComponentInput,
} from '@hk-clothing/validation';

const prisma = new PrismaClient();

export const createComponent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: CreateComponentInput = createComponentSchema.parse(req.body);

    const existingComponent = await prisma.component.findFirst({
      where: { name: data.name },
    });
    if (existingComponent) {
      return res.status(409).json({
        success: false,
        error: 'Component name already exists',
      });
    }

    const component = await prisma.component.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Component created successfully',
      data: {
        id: component.id,
        name: component.name,
        description: component.description,
        createdAt: component.createdAt.toISOString(),
        updatedAt: component.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getComponents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const components = await prisma.component.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: components.map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        createdAt: component.createdAt.toISOString(),
        updatedAt: component.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getComponentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const component = await prisma.component.findUnique({
      where: { id },
    });

    if (!component) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    return res.json({
      success: true,
      data: {
        id: component.id,
        name: component.name,
        description: component.description,
        createdAt: component.createdAt.toISOString(),
        updatedAt: component.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateComponent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data: UpdateComponentInput = updateComponentSchema.parse(req.body);

    const existingComponent = await prisma.component.findUnique({ where: { id } });
    if (!existingComponent) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    const component = await prisma.component.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: 'Component updated successfully',
      data: {
        id: component.id,
        name: component.name,
        description: component.description,
        createdAt: component.createdAt.toISOString(),
        updatedAt: component.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComponent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingComponent = await prisma.component.findUnique({ where: { id } });
    if (!existingComponent) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    await prisma.component.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Component deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
