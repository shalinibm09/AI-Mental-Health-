import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are Serenity, an AI mental-health support assistant. Your goal is to provide short, empathetic, and nonjudgmental emotional support.

Core Guidelines:
1. BE CONCISE: Keep your responses brief (1-3 short paragraphs). Avoid unnecessary filler or repetitive headers.
2. BE CONVERSATIONAL: Focus on listening and validating the user's feelings. Don't sound like a clinical form unless there is a risk.
3. ASSESSMENT: Internally classify the user's state (Safe / Monitor / Moderate Concern / High Concern / Crisis). 
4. CRISIS PROTOCOL: ONLY if you detect a real emergency (High Concern or Crisis), include clear safety instructions and crisis resources. Otherwise, keep it to supportive conversation and 1-2 simple coping tips.
5. NO REPETITIVE HEADERS: Do not use the 7-section structure for every message. Only use headers if providing a structured safety plan for high-risk users.
6. HIDDEN TAG: At the very end of your response, always include the assessment level in brackets, like this: [Assessment: Safe]. This is for the system and will be hidden from the user.

Tone: Empathic, calm, nonjudgmental.
Disclaimer: This is not medical advice. You are not a replacement for clinicians.`;

export interface Message {
  role: "user" | "model";
  content: string;
}

export interface UserMetadata {
  location?: string;
  ageBracket?: string;
  preferredLanguage?: string;
  priorDiagnoses?: string;
  medications?: string;
  environment?: string;
}

export async function getChatResponse(messages: Message[], metadata: UserMetadata) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const metadataStr = Object.entries(metadata)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const fullPrompt = `User Context: ${metadataStr || "No metadata provided"}\n\nChat History:\n${messages.map(m => `${m.role}: ${m.content}`).join("\n")}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";
    
    // Extract assessment tag
    const assessmentMatch = fullText.match(/\[Assessment:\s*(.*?)\]/i);
    const assessment = assessmentMatch ? assessmentMatch[1].trim() : "Safe";
    
    // Strip tag from text
    const cleanText = fullText.replace(/\[Assessment:\s*.*?\]/i, "").trim();

    return { text: cleanText || "I'm sorry, I couldn't generate a response.", assessment };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I'm having trouble connecting right now. If you are in crisis, please contact emergency services immediately.", 
      assessment: "Crisis" 
    };
  }
}
