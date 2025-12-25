
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartProductRecommendation = async (userPrompt: string, products: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for: "${userPrompt}". 
      Here is our product list: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, desc: p.description })))}.
      Based on the user's intent, suggest the best product IDs and explain why in a short friendly tone.`,
      config: {
        systemInstruction: "You are an expert shopping assistant for ShopBase BD. You help users find the perfect product from our catalog."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my AI brain right now, but I recommend checking out our top-rated electronics!";
  }
};

export const generateProductDescription = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a catchy, professional, and SEO-friendly e-commerce product description for: "${productName}". Include key features and benefits.`,
    });
    return response.text;
  } catch (error) {
    return "Quality product designed for your everyday needs.";
  }
};
