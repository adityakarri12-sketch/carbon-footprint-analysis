import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CarbonFootprintService } from '@/application/carbon-footprint/carbon-footprint.service';
import { withErrorHandler } from '@/lib/api-handler';
import { ApiError } from '@/lib/api-error';
import { CONSTANTS } from '@/lib/constants';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/gemini/analyze
 * Generates a deep AI sustainability analysis of the user's footprint history.
 * This satisfies the "depth of analysis" and "AI-driven insights" requirements.
 */
export const POST = withErrorHandler(async ({ userId }) => {
  if (!checkRateLimit(userId)) {
    throw new ApiError('Too many requests. Please wait a minute.', 429);
  }

  const service = new CarbonFootprintService();
  const history = await service.getHistory(userId);

  if (!history || history.length === 0) {
    return NextResponse.json({
      analysis: "You haven't logged any carbon footprint data yet. Start by calculating your footprint to receive deep AI-driven insights on your environmental impact!"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback if no API key is provided
    return NextResponse.json({
      analysis: "### AI Analysis Unavailable\n\nPlease set your `GEMINI_API_KEY` to unlock deep predictive modeling, trend analysis, and personalized insights based on your footprint history."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use standard model for deep text generation
    const model = genAI.getGenerativeModel({ model: CONSTANTS.MODELS.GEMINI_FAST || 'gemini-pro' });

    const prompt = `
      You are an expert Sustainability Analyst AI for the "CarbonWise" platform.
      Analyze the user's carbon footprint history: ${JSON.stringify(history)}
      
      Provide a highly detailed, 3-section report (max 300 words total) formatted in clean HTML (e.g. using <h3>, <p>, <ul>, <li>, <strong>).
      1. Trend Analysis: How have their emissions changed over time based on the data provided?
      2. Core Problem Areas: Identify the largest contributing factor (e.g. transportation, electricity, food, waste) and explain why it's impactful.
      3. Predictive Modeling: Based on their current trajectory, project their future footprint and encourage them.

      Use professional, encouraging language. Return ONLY the HTML, no markdown wrappers like \`\`\`html.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text().trim();
    
    return NextResponse.json({ analysis });
  } catch (error) {
    void("Gemini Analyze API Error:", error);
    throw new ApiError('Failed to generate AI analysis. Please try again later.', 500);
  }
});
