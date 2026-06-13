import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoalService } from '@/application/goal/goal.service';
import DOMPurify from 'isomorphic-dompurify';
import { withErrorHandler } from '@/lib/api-handler';
import { ApiError } from '@/lib/api-error';

const updateGoalSchema = z.object({
  description: z.string().min(1).max(500).optional(),
  targetDate: z.string().datetime().refine((date) => new Date(date) > new Date(), {
    message: "Target date must be in the future",
  }).optional(),
  isCompleted: z.boolean().optional(),
});

const service = new GoalService();

export const PUT = withErrorHandler(async ({ req, userId, params }) => {
  const goalId = params.id;
  const body = await req.json();
  if (body.description) {
    body.description = DOMPurify.sanitize(body.description);
  }
  const data = updateGoalSchema.parse(body);
  
  const { targetDate, ...rest } = data;

  try {
    const updatedGoal = await service.updateGoal(goalId, userId, {
        ...rest,
        ...(targetDate && { targetDate: new Date(targetDate) })
    });
    return NextResponse.json(updatedGoal);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw ApiError.notFound(error.message);
    }
    throw error;
  }
});

export const DELETE = withErrorHandler(async ({ userId, params }) => {
  const goalId = params.id;

  try {
    await service.deleteGoal(goalId, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      throw ApiError.notFound(error.message);
    }
    throw error;
  }
});
