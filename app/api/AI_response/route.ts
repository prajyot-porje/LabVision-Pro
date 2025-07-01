import { NextRequest, NextResponse } from "next/server";
import { GenerateAiResponse } from "@/configs/AImodel";
import { prompt } from "@/configs/Prompt";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not set." }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ error: "Missing text." }, { status: 400 });
    }
    const fullPrompt = `${prompt}\n\n${text}`;
    const aiResponse = await GenerateAiResponse(fullPrompt);
    let results = [];
    try {
      const start = aiResponse.indexOf("[");
      const end = aiResponse.lastIndexOf("]");
      if (start !== -1 && end !== -1) {
        results = JSON.parse(aiResponse.slice(start, end + 1));
      }
    } catch (e) {
      results = [];
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}