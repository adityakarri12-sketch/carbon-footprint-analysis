import { CarbonFootprintService } from '@/application/carbon-footprint/carbon-footprint.service';
import { GoalService } from '@/application/goal/goal.service';
import { RecommendationService } from '@/application/recommendation/recommendation.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mPrisma = {
    footprintRecord: {
      create: jest.fn().mockResolvedValue({ id: 'fp_1', userId: 'user_1' }),
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 })
    },
    goal: {
      create: jest.fn().mockResolvedValue({ id: 'goal_1', userId: 'user_1' }),
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue({ id: 'goal_1', userId: 'user_1' }),
      update: jest.fn().mockResolvedValue({ id: 'goal_1', isCompleted: true }),
      delete: jest.fn().mockResolvedValue({ id: 'goal_1' })
    },
    recommendation: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'rec_1', category: 'transportation', title: 'Walk more' },
        { id: 'rec_2', category: 'electricity', title: 'Turn off lights' }
      ])
    }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Backend Services Integration', () => {
  const userId = 'user_1';

  describe('CarbonFootprintService', () => {
    it('calculates and saves footprint data', async () => {
      const service = new CarbonFootprintService();
      const mockData = { transportation: 100, electricity: 50, food: 30, waste: 10 };
      const res = await service.calculateAndSave(userId, mockData);
      expect(res.monthly).toBeGreaterThan(0);
      expect(res.annual).toBeGreaterThan(0);
    });

    it('retrieves history', async () => {
      const service = new CarbonFootprintService();
      const history = await service.getHistory(userId);
      expect(Array.isArray(history)).toBe(true);
    });

    it('clears history', async () => {
      const service = new CarbonFootprintService();
      const result = await service.clearHistory(userId);
      expect(result.count).toBe(1);
    });
  });

  describe('GoalService', () => {
    it('creates a goal', async () => {
      const service = new GoalService();
      const goal = await service.createGoal(userId, 'Reduce meat', new Date());
      expect(goal.id).toBe('goal_1');
    });

    it('gets goals', async () => {
      const service = new GoalService();
      const goals = await service.getGoals(userId);
      expect(Array.isArray(goals)).toBe(true);
    });

    it('updates a goal', async () => {
      const service = new GoalService();
      const updated = await service.updateGoal('goal_1', userId, { isCompleted: true });
      expect(updated.isCompleted).toBe(true);
    });

    it('fails to update unauthorized goal', async () => {
      const mPrisma = (PrismaClient as unknown as jest.Mock)();
      mPrisma.goal.findFirst.mockResolvedValueOnce(null);
      const service = new GoalService();
      await expect(service.updateGoal('goal_2', userId, { isCompleted: true })).rejects.toThrow('Goal not found or user not authorized');
    });

    it('deletes a goal', async () => {
      const service = new GoalService();
      const deleted = await service.deleteGoal('goal_1', userId);
      expect(deleted.id).toBe('goal_1');
    });

    it('fails to delete unauthorized goal', async () => {
      const mPrisma = (PrismaClient as unknown as jest.Mock)();
      mPrisma.goal.findFirst.mockResolvedValueOnce(null);
      const service = new GoalService();
      await expect(service.deleteGoal('goal_2', userId)).rejects.toThrow('Goal not found or user not authorized');
    });
  });

  describe('RecommendationService', () => {
    it('fetches generic recommendations for new users', async () => {
      const mPrisma = (PrismaClient as unknown as jest.Mock)();
      mPrisma.footprintRecord.findFirst.mockResolvedValueOnce(null);
      const service = new RecommendationService();
      const recs = await service.getRecommendations(userId);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0]).toHaveProperty('category');
    });

    it('fetches personalized recommendations', async () => {
      const mPrisma = (PrismaClient as unknown as jest.Mock)();
      mPrisma.footprintRecord.findFirst.mockResolvedValueOnce({
        transportation: 100, electricity: 50, food: 30, waste: 10
      });
      const service = new RecommendationService();
      const recs = await service.getRecommendations(userId);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0].category).toBe('transportation');
    });
  });
});
