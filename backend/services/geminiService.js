import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function generateSummary(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
You are an expert legal analyst.

Analyze this document and provide:

1. Executive Summary
2. Key Parties
3. Important Clauses
4. Potential Risks

Document:
${text}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}