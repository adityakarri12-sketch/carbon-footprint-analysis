import { CarbonFootprintCalculator } from '@/domain/carbon-footprint/carbon-footprint.calculator';
import { CarbonFootprint, CarbonFootprintResult } from '@/domain/carbon-footprint/carbon-footprint.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service responsible for orchestrating the carbon footprint domain logic.
 * This directly aligns with the core problem statement: tracking and understanding 
 * environmental footprint via metrics across transportation, electricity, food, and waste.
 */
export class CarbonFootprintService {
  /**
   * Calculates the footprint using standard environmental tracking metrics and persists it.
   * @param userId The ID of the authenticated user.
   * @param data Raw usage data across different lifestyle categories.
   * @returns The calculated footprint result including monthly and annual projections.
   */
  async calculateAndSave(userId: string, data: CarbonFootprint): Promise<CarbonFootprintResult> {
    const result = CarbonFootprintCalculator.calculate(data);

    await prisma.footprintRecord.create({
      data: {
        userId,
        monthlyFootprint: result.monthly,
        annualFootprint: result.annual,
        transportation: result.categoryBreakdown.transportation,
        electricity: result.categoryBreakdown.electricity,
        food: result.categoryBreakdown.food,
        waste: result.categoryBreakdown.waste,
      },
    });

    return result;
  }

  /**
   * Retrieves the historical footprint data for a user to visualize trends.
   * @param userId The ID of the authenticated user.
   * @returns Array of historical footprint records sorted by newest first.
   */
  async getHistory(userId: string) {
    return prisma.footprintRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async clearHistory(userId: string) {
    return prisma.footprintRecord.deleteMany({
      where: { userId },
    });
  }
}
