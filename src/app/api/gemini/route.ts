import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { monthly, annual, transportation, electricity, food, waste } = await req.json();

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
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails (user asked for mock data fallback)
    return NextResponse.json({ advice: "Your footprint has been calculated! Try finding small ways to reduce your highest emission category next month." });
  }
}
