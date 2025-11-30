import { GoogleGenAI, Type } from "@google/genai";
import { LearningPathResponse } from "../types";

// Initialize Gemini Client
// Note: In a real environment, handle API key security properly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLearningPath = async (careerGoal: string): Promise<LearningPathResponse | null> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Create a structured learning path for someone who wants to become a: ${careerGoal}. 
    Provide 5 distinct steps. Keep descriptions concise (under 20 words).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            careerGoal: {
              type: Type.STRING,
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedDuration: { type: Type.STRING },
                },
                required: ["stepNumber", "title", "description", "estimatedDuration"],
              },
            },
          },
          required: ["careerGoal", "steps"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as LearningPathResponse;
    }
    return null;

  } catch (error) {
    console.error("Error generating learning path:", error);
    return null;
  }
};

/**
 * Generates simple text content based on a given prompt.
 * Used for populating individual fields in the admin panel.
 */
export const generateSimpleText = async (prompt: string): Promise<string | null> => {
  try {
    const model = "gemini-2.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text ?? null;
  } catch (error) {
    console.error("Error generating simple text:", error);
    return null;
  }
};
