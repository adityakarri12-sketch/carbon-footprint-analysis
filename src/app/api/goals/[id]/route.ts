import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { GoalService } from '@/application/goal/goal.service';

const updateGoalSchema = z.object({
  description: z.string().min(1).optional(),
  targetDate: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});

const service = new GoalService();

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;
    const goalId = id;
    const body = await req.json();
    const data = updateGoalSchema.parse(body);
    
    const { targetDate, ...rest } = data;

    const updatedGoal = await service.updateGoal(goalId, userId, {
        ...rest,
        ...(targetDate && { targetDate: new Date(targetDate) })
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const { id } = await context.params.catch(() => ({ id: 'unknown' }));
    console.error(`[GOAL_PUT_${id}]`, error);
    if (error instanceof Error && error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
      const { userId } = await auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const { id } = await context.params;
      const goalId = id;
  
      await service.deleteGoal(goalId, userId);
  
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      const { id } = await context.params.catch(() => ({ id: 'unknown' }));
      console.error(`[GOAL_DELETE_${id}]`, error);
      if (error instanceof Error && error.message.includes('not found')) {
          return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
