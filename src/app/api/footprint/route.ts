import { NextResponse } from 'next/server';
import { CarbonFootprintService } from '@/application/carbon-footprint/carbon-footprint.service';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api-handler';

const footprintSchema = z.object({
  transportation: z.number().min(0),
  electricity: z.number().min(0),
  food: z.number().min(0),
  waste: z.number().min(0),
});

export const POST = withErrorHandler(async ({ req, userId }) => {
  const body = await req.json();
  const data = footprintSchema.parse(body);

  const service = new CarbonFootprintService();
  const result = await service.calculateAndSave(userId, data);

  return NextResponse.json(result);
});

export const GET = withErrorHandler(async ({ userId }) => {
  const service = new CarbonFootprintService();
  const history = await service.getHistory(userId);

  return NextResponse.json(history);
});

export const DELETE = withErrorHandler(async ({ userId }) => {
  const service = new CarbonFootprintService();
  await service.clearHistory(userId);

  return NextResponse.json({ success: true });
});
