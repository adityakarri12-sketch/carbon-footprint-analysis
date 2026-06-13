import { PrismaClient, Recommendation } from '@prisma/client';

const prisma = new PrismaClient();

export class RecommendationService {
  /**
   * Generates personalized recommendations for a user based on their latest carbon footprint.
   * @param userId The ID of the user to generate recommendations for.
   * @returns A list of recommended actions.
   */
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    const latestFootprint = await prisma.footprintRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const allRecommendations = await prisma.recommendation.findMany();

    if (!latestFootprint) {
      // If the user has no footprint data, return a generic set of recommendations.
      return allRecommendations.slice(0, 5);
    }

    // Simple logic: find the highest contribution category and suggest recommendations from it.
    const breakdown: { [key: string]: number } = {
      transportation: latestFootprint.transportation,
      electricity: latestFootprint.electricity,
      food: latestFootprint.food,
      waste: latestFootprint.waste,
    };

    const highestCategory = Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b);

    const categoryRecommendations = allRecommendations.filter(rec => rec.category.toLowerCase() === highestCategory);
    
    // Get other recommendations to fill up the list
    const otherRecommendations = allRecommendations.filter(rec => rec.category.toLowerCase() !== highestCategory);

    // Return a mix of recommendations, prioritizing the highest impact category
    return [...categoryRecommendations, ...otherRecommendations].slice(0, 5);
  }
}
