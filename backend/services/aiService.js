import natural from "natural";
import { removeStopwords } from "stopword";

const tokenizer = new natural.WordTokenizer();

export function generateCaseInsights(text) {
  if (!text) return null;

  // Word count
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Keywords extraction
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const filtered = removeStopwords(tokens);

  const freq = {};
  filtered.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  const sortedKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(k => k[0]);

  // Simple summary (first 3 sentences)
  const sentences = text.split(".");
  const summary = sentences.slice(0, 3).join(".");

  return {
    wordCount,
    keywords: sortedKeywords,
    summary
  };
}
