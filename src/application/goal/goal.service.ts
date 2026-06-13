import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GoalService
 * 
 * Handles all business logic related to user carbon reduction goals.
 * Abstracts the database layer (Prisma) from the API controllers.
 */
export class GoalService {
  /**
   * Creates a new carbon reduction goal for a user.
   * @param userId - The Clerk User ID.
   * @param description - A brief description of the goal.
   * @param targetDate - The deadline for the goal.
   * @returns The created Goal entity.
   */
  async createGoal(userId: string, description: string, targetDate: Date) {
    return prisma.goal.create({
      data: {
        userId,
        description,
        targetDate,
      },
    });
  }

  /**
   * Retrieves all goals for a specific user, ordered by creation date descending.
   * @param userId - The Clerk User ID.
   * @returns An array of Goal entities.
   */
  async getGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Updates an existing goal. Verifies ownership before updating.
   * @param goalId - The unique ID of the goal.
   * @param userId - The Clerk User ID (for authorization).
   * @param data - The fields to update.
   * @returns The updated Goal entity.
   * @throws Error if the goal is not found or the user is unauthorized.
   */
  async updateGoal(goalId: string, userId: string, data: { isCompleted?: boolean; description?: string; targetDate?: Date }) {
    // First, verify the goal belongs to the user
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Goal not found or user not authorized');
    }

    return prisma.goal.update({
      where: { id: goalId },
      data,
    });
  }

  /**
   * Deletes a goal. Verifies ownership before deletion.
   * @param goalId - The unique ID of the goal.
   * @param userId - The Clerk User ID (for authorization).
   * @returns The deleted Goal entity.
   * @throws Error if the goal is not found or the user is unauthorized.
   */
  async deleteGoal(goalId: string, userId: string) {
    // First, verify the goal belongs to the user
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Goal not found or user not authorized');
    }

    return prisma.goal.delete({
      where: { id: goalId },
    });
  }
}
