import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const Model = "gemini-2.5-flash";

const config = {
  responseMimeType: "application/json",
  temperature: 0.7,
  maxOutputTokens: 32768, 
};

export const GenerateAiResponse = async (prompt: string) => {
  try {
    const contents = [{ role: "user", parts: [{ text: prompt }] }];

    const result = await ai.models.generateContent({
      model: Model,
      contents,
      config: config,
    });

    if (result.candidates?.[0]?.finishReason === "MAX_TOKENS") {
      throw new Error("Gemini API: Prompt or output too long (MAX_TOKENS). Please try with less text.");
    }

    const response = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response) {
      throw new Error("No response received from AI model");
    }
    return response;

  } catch (error) {
    console.error("Error at GenerateAiResponse in AImodel.ts :", error);
    throw new Error(`Failed to generate chat response: ${error}`);
  }
}
