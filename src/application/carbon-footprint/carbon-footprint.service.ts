import { CarbonFootprintCalculator } from '@/domain/carbon-footprint/carbon-footprint.calculator';
import { CarbonFootprint, CarbonFootprintResult } from '@/domain/carbon-footprint/carbon-footprint.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CarbonFootprintService {
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
