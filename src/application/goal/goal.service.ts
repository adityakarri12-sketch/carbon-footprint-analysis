import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GoalService {
  async createGoal(userId: string, description: string, targetDate: Date) {
    return prisma.goal.create({
      data: {
        userId,
        description,
        targetDate,
      },
    });
  }

  async getGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

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
