import { NextRequest, NextResponse } from 'next/server';
import { CarbonFootprintService } from '@/application/carbon-footprint/carbon-footprint.service';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

const footprintSchema = z.object({
  transportation: z.number().min(0),
  electricity: z.number().min(0),
  food: z.number().min(0),
  waste: z.number().min(0),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const data = footprintSchema.parse(body);

    const service = new CarbonFootprintService();
    const result = await service.calculateAndSave(userId, data);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const service = new CarbonFootprintService();
    const history = await service.getHistory(userId);

    return NextResponse.json(history);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const service = new CarbonFootprintService();
    await service.clearHistory(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
