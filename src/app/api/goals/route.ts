import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoalService } from '@/application/goal/goal.service';
import DOMPurify from 'isomorphic-dompurify';
import { withErrorHandler } from '@/lib/api-handler';

const goalSchema = z.object({
  description: z.string().min(1).max(500),
  targetDate: z.string().datetime().refine((date) => new Date(date) > new Date(), {
    message: "Target date must be in the future",
  }),
});

const service = new GoalService();

export const POST = withErrorHandler(async ({ req, userId }) => {
  const body = await req.json();
  
  // XSS Mitigation: Sanitize input
  if (body.description) {
    body.description = DOMPurify.sanitize(body.description);
  }
  
  const data = goalSchema.parse(body);

  const newGoal = await service.createGoal(userId, data.description, new Date(data.targetDate));

  return NextResponse.json(newGoal, { status: 201 });
});

export const GET = withErrorHandler(async ({ userId }) => {
  const goals = await service.getGoals(userId);
  return NextResponse.json(goals);
});
