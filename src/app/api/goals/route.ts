import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { GoalService } from '@/application/goal/goal.service';

const goalSchema = z.object({
  description: z.string().min(1),
  targetDate: z.string().datetime(),
});

const service = new GoalService();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const data = goalSchema.parse(body);

    const newGoal = await service.createGoal(userId, data.description, new Date(data.targetDate));

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[GOALS_POST]", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const goals = await service.getGoals(userId);

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[GOALS_GET]", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
