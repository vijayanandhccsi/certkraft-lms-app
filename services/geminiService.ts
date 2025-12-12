import { GoogleGenAI, Type } from "@google/genai";
import { LearningPathResponse } from "../types";

// Initialize Gemini Client
// Using process.env.API_KEY as required by strict coding guidelines.
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

// Interface for AI Generated Question
export interface GeneratedQuestion {
  text: string;
  type: string;
  points: number;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

/**
 * Generates structured quiz questions based on a topic and description.
 */
export const generateQuizQuestions = async (topic: string, description: string, count: number = 3): Promise<GeneratedQuestion[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Generate ${count} quiz questions about "${topic}". Description: ${description}.
    Ensure questions vary in difficulty.
    For 'single_choice', ensure exactly one option is correct.
    For 'multiple_choice', ensure at least one option is correct.
    For 'true_false', provide exactly two options (True/False).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text" },
              type: { 
                type: Type.STRING, 
                enum: ["single_choice", "multiple_choice", "true_false", "short_answer"],
                description: "The type of question"
              },
              points: { type: Type.INTEGER, description: "Suggested points for this question" },
              explanation: { type: Type.STRING, description: "Explanation for the correct answer" },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                  },
                  required: ["text", "isCorrect"]
                }
              }
            },
            required: ["text", "type", "points", "options", "explanation"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return [];
  }
};