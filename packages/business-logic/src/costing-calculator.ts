import {
  CostingInputData,
  CostingCalculationsSummary,
  SizeCalculationResult,
  SizeComponentCalculation,
  ComponentMeasurement,
} from '@hk-clothing/api-types';

/**
 * Calculates the weight of a single component in grams.
 *
 * Formula: (Length_cm * Width_cm * GSM * panelCount * fabricFactor) / 10000
 * Division by 10000 converts cm² to m² (since GSM is g/m²).
 */
export function calculateComponentWeight(
  lengthCm: number,
  widthCm: number,
  gsm: number,
  panelCount: number = 1,
  fabricFactor: number = 1
): number {
  if (lengthCm <= 0 || widthCm <= 0 || gsm <= 0 || panelCount <= 0 || fabricFactor <= 0) {
    return 0;
  }
  const weight = (lengthCm * widthCm * gsm * panelCount * fabricFactor) / 10000;
  // Round to 4 decimal places for precision
  return Math.round(weight * 10000) / 10000;
}

/**
 * Calculates fabric cost for a component in currency units.
 *
 * Formula: (Weight in grams / 1000) * pricePerKg
 */
export function calculateComponentCost(weightGrams: number, pricePerKg: number): number {
  if (weightGrams <= 0 || pricePerKg <= 0) {
    return 0;
  }
  const weightKg = weightGrams / 1000;
  const cost = weightKg * pricePerKg;
  // Round to 4 decimal places for precision
  return Math.round(cost * 10000) / 10000;
}

/**
 * Performs complete size-specific and order-wide costing calculations.
 */
export function calculateCosting(input: CostingInputData): CostingCalculationsSummary {
  const { fabricDetails, sizeQuantities, measurements, componentDetails } = input;

  // Build price lookup map by fabric serial number
  const fabricPriceMap = new Map<string, number>();
  fabricDetails.forEach((fabric) => {
    fabricPriceMap.set(fabric.serialNumber, fabric.pricePerKg);
  });

  const sizeBreakdown: Record<string, SizeCalculationResult> = {};
  let totalQuantity = 0;
  let totalCost = 0;
  let totalWeightKg = 0;

  // Process each size
  const sizes = Object.keys(sizeQuantities);

  for (const size of sizes) {
    const quantity = sizeQuantities[size] || 0;
    totalQuantity += quantity;

    const sizeMeasurements = measurements[size] || {};
    const sizeComponentCalculations: SizeComponentCalculation[] = [];

    let sizeWeightGrams = 0;
    let sizeFabricCost = 0;

    for (const comp of componentDetails) {
      const measurement: ComponentMeasurement = sizeMeasurements[comp.name] || {
        length: 0,
        width: 0,
        panelCount: comp.panelCount,
        fabricFactor: comp.fabricFactor,
      };

      const length = measurement.length || 0;
      const width = measurement.width || 0;
      const panelCount = measurement.panelCount ?? comp.panelCount ?? 1;
      const fabricFactor = measurement.fabricFactor ?? comp.fabricFactor ?? 1;
      const gsm = comp.gsm;
      const pricePerKg = fabricPriceMap.get(comp.fabricSerialNumber) || 0;

      const weightGrams = calculateComponentWeight(length, width, gsm, panelCount, fabricFactor);
      const weightKg = Math.round((weightGrams / 1000) * 10000) / 10000;
      const fabricCostPerPiece = calculateComponentCost(weightGrams, pricePerKg);

      sizeWeightGrams += weightGrams;
      sizeFabricCost += fabricCostPerPiece;

      sizeComponentCalculations.push({
        componentName: comp.name,
        fabricSerialNumber: comp.fabricSerialNumber,
        length,
        width,
        gsm,
        panelCount,
        fabricFactor,
        weightGrams,
        weightKg,
        pricePerKg,
        fabricCostPerPiece,
      });
    }

    const roundedWeightGrams = Math.round(sizeWeightGrams * 10000) / 10000;
    const roundedWeightKg = Math.round((roundedWeightGrams / 1000) * 10000) / 10000;
    const roundedFabricCost = Math.round(sizeFabricCost * 10000) / 10000;

    const totalCostForSize = Math.round(roundedFabricCost * quantity * 100) / 100;
    const totalWeightKgForSize = Math.round(roundedWeightKg * quantity * 10000) / 10000;

    totalCost += totalCostForSize;
    totalWeightKg += totalWeightKgForSize;

    sizeBreakdown[size] = {
      size,
      quantity,
      components: sizeComponentCalculations,
      weightGramsPerPiece: roundedWeightGrams,
      weightKgPerPiece: roundedWeightKg,
      fabricCostPerPiece: roundedFabricCost,
      totalCostForSize,
      totalWeightKgForSize,
    };
  }

  const roundedTotalCost = Math.round(totalCost * 100) / 100;
  const roundedTotalWeightKg = Math.round(totalWeightKg * 10000) / 10000;
  const averageCostPerPiece =
    totalQuantity > 0 ? Math.round((roundedTotalCost / totalQuantity) * 100) / 100 : 0;
  const averageWeightKgPerPiece =
    totalQuantity > 0 ? Math.round((roundedTotalWeightKg / totalQuantity) * 10000) / 10000 : 0;

  return {
    sizeBreakdown,
    totalQuantity,
    totalWeightKg: roundedTotalWeightKg,
    totalCost: roundedTotalCost,
    averageCostPerPiece,
    averageWeightKgPerPiece,
  };
}
