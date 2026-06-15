import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api-handler';

const geminiSchema = z.object({
  monthly: z.number().min(0),
  annual: z.number().min(0),
  transportation: z.number().min(0),
  electricity: z.number().min(0),
  food: z.number().min(0),
  waste: z.number().min(0),
});

export const POST = withErrorHandler(async ({ req }) => {
  const body = await req.json();
  const data = geminiSchema.parse(body);

  const { monthly, annual, transportation, electricity, food, waste } = data;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ advice: "Great job tracking your footprint! Tip: Reduce car travel by 10% next month." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are a friendly Eco-assistant. A user just calculated their carbon footprint:
  - Monthly: ${monthly.toFixed(1)} kg CO2
  - Annual: ${annual.toFixed(1)} kg CO2
  Breakdown: Transportation ${transportation.toFixed(1)} kg, Electricity ${electricity.toFixed(1)} kg, Food ${food.toFixed(1)} kg, Waste ${waste.toFixed(1)} kg.
  
  Give them exactly 2 short, highly personalized, and encouraging sentences of eco-advice based on their highest emission category. Keep it under 250 characters. Don't use markdown or asterisks, just plain text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return NextResponse.json({ advice: text });
});
