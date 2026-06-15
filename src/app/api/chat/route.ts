import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Initialize the Google Gen AI client if the key is present
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const data = chatSchema.parse(body);

    // Sanitize input to prevent XSS / Prompt Injection payloads containing malicious HTML
    const sanitizedMessage = DOMPurify.sanitize(data.message);

    // Check if the real API key is configured
    if (!ai) {
      // Graceful fallback if no key is provided (Realistic Mock Data)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate latency
      return NextResponse.json({
        reply: "I am currently running in Live API Fallback Mode because the `GEMINI_API_KEY` is missing. Please add it to your `.env` file for real-time analysis! In the meantime, I recommend lowering your transport footprint by carpooling."
      });
    }

    // Live Google Gemini API Integration
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `You are an expert carbon footprint advisor. The user is asking: "${sanitizedMessage}". Provide a concise, actionable sustainability strategy.` }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    const reply = response.text || "I'm sorry, I couldn't generate a response at this time.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("[GEMINI_API_ERROR]", error);
    // Even on error, gracefully fallback instead of crashing the UI
    return NextResponse.json({
      reply: "The Gemini API encountered an error. Please verify your API key and quotas. Fallback advice: Switch to LED bulbs!"
    });
  }
}
