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

// Costing Types & DTOs
export type GarmentSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | string;

export interface StyleDetail {
  styleNumber: string;
  styleName: string;
  fabricType: string;
  gsm: number;
}

export interface FabricDetail {
  serialNumber: string;
  color: string;
  pricePerKg: number;
  fabricType?: string;
  associatedComponents?: string[];
}

export interface ComponentMeasurement {
  length: number; // in cm
  width: number; // in cm
  panelCount?: number;
  fabricFactor?: number;
}

export interface ComponentSpecification {
  name: string;
  fabricSerialNumber: string;
  gsm: number;
  panelCount: number;
  fabricFactor: number; // 1 for single, 2 for symmetric (e.g., sleeves/sides)
}

export interface SizeComponentCalculation {
  componentName: string;
  fabricSerialNumber: string;
  length: number;
  width: number;
  gsm: number;
  panelCount: number;
  fabricFactor: number;
  weightGrams: number;
  weightKg: number;
  pricePerKg: number;
  fabricCostPerPiece: number;
}

export interface SizeCalculationResult {
  size: string;
  quantity: number;
  components: SizeComponentCalculation[];
  weightGramsPerPiece: number;
  weightKgPerPiece: number;
  fabricCostPerPiece: number;
  totalCostForSize: number;
  totalWeightKgForSize: number;
}

export interface CostingCalculationsSummary {
  sizeBreakdown: Record<string, SizeCalculationResult>;
  totalQuantity: number;
  totalWeightKg: number;
  totalCost: number;
  averageCostPerPiece: number;
  averageWeightKgPerPiece: number;
}

export interface CostingInputData {
  orderId?: string;
  styleDetails: StyleDetail;
  fabricDetails: FabricDetail[];
  sizeQuantities: Record<string, number>;
  measurements: Record<string, Record<string, ComponentMeasurement>>; // size -> componentName -> measurement
  componentDetails: ComponentSpecification[];
}

export interface CostingRecordDTO {
  id: string;
  orderId?: string | null;
  styleDetails: StyleDetail;
  fabricDetails: FabricDetail[];
  sizeQuantities: Record<string, number>;
  measurements: Record<string, Record<string, ComponentMeasurement>>;
  componentDetails: ComponentSpecification[];
  calculations: CostingCalculationsSummary;
  createdAt: string;
  updatedAt: string;
}
