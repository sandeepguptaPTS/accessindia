import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateText(
  prompt: string,
  systemInstruction?: string,
  options?: { temperature?: number }
): Promise<string> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash",
    ...(systemInstruction ? { systemInstruction } : {}),
    ...(options?.temperature !== undefined
      ? { generationConfig: { temperature: options.temperature } }
      : {}),
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateJSON<T>(
  prompt: string,
  systemInstruction?: string
): Promise<T> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    ...(systemInstruction ? { systemInstruction } : {}),
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }
}
