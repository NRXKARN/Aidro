import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI SDK
// In a production environment, use environment variables for API keys
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY");

/**
 * AIDRO Gemini Service
 * Uses Google Gemini Pro to analyze disaster reports and prioritize them based on risk.
 */
export const GeminiService = {
  
  /**
   * Analyzes a help request from a user.
   * Extracts location info, severity, and urgency.
   * @param {string} rawReport - The text submitted by the user.
   */
  async analyzeHelpRequest(rawReport) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an AI assistant for AIDRO, a disaster management system.
      Given the following raw emergency report from a survivor:
      "${rawReport}"

      Perform a detailed analysis and return a JSON object with:
      1. "severity": (Score 1-10)
      2. "urgency": (Score 1-10)
      3. "category": (e.g., Flood, Medical, Fire, Trap, Food)
      4. "needs": (A list of specific items requested)
      5. "risk_score": (A weighted score calculated by you)
      6. "summary": (A concise 1-sentence summary for rescue teams)

      Only return the valid JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Clean and parse JSON
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return { severity: 5, risk_score: 50, summary: "Standard emergency alert" };
    }
  },

  /**
   * Generates resource allocation suggestions based on area data.
   */
  async optimizeResourceAllocation(regionData) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      As AIDRO's Allocation Engine, analyze this regional data:
      ${JSON.stringify(regionData)}

      Determine the optimal distribution of:
      - Rescue Teams
      - Medical Kits
      - Food/Water
      
      Explain the logic for prioritization based on population density vs. incident intensity.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};
