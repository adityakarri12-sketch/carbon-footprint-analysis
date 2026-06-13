import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@clerk/nextjs/server';
import { CarbonFootprintService } from '@/application/carbon-footprint/carbon-footprint.service';

export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const service = new CarbonFootprintService();
    const history = await service.getHistory(userId);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // High performance fallback if API fails
      return NextResponse.json({
        plan: [
          { title: "Reduce Driving", impact: "High", description: "Carpool 2 days a week." },
          { title: "Energy Audit", impact: "Medium", description: "Switch to LED lighting." },
          { title: "Meatless Mondays", impact: "Medium", description: "Eat plant-based 1 day a week." }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Performance & Quality: Ensure JSON response format for structured parsing.
    const prompt = `You are a strict JSON API. A user needs a 3-step action plan to reduce their carbon footprint.
    Here is their recent calculation history (if any): ${JSON.stringify(history.slice(0, 3))}
    Based on their history, generate a JSON array of 3 objects. 
    Each object must have exactly these keys: "title" (string), "impact" (string: High, Medium, or Low), "description" (string, max 100 chars).
    Return ONLY raw JSON array, no markdown wrappers like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    if (text.startsWith("```json")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    const plan = JSON.parse(text);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Gemini Plan API Error:", error);
    // Performance: Graceful degradation fallback
    return NextResponse.json({
        plan: [
          { title: "Optimize Home Energy", impact: "High", description: "Turn off standby appliances." },
          { title: "Drive Less", impact: "High", description: "Use public transit when possible." },
          { title: "Reduce Food Waste", impact: "Medium", description: "Plan meals to avoid throwing away food." }
        ]
    });
  }
}
