import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import Case from "../models/case.js";
import authMiddleware from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {

  try {

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(dataBuffer);

    const text = pdfData.text;

    // Clean text
    const cleanedText = text.replace(/\n/g, " ");

    // Sentence splitting
    const sentences = cleanedText.match(/[^\.!\?]+[\.!\?]+/g) || [];

    // Word frequency
    const words = cleanedText
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter(word => word.length > 4);

    const frequency = {};

    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sentence scoring
    const sentenceScores = sentences.map(sentence => {

      let score = 0;

      const sentenceWords = sentence
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .split(" ");

      sentenceWords.forEach(word => {
        if (frequency[word]) {
          score += frequency[word];
        }
      });

      return { sentence, score };

    });

    // Pick best sentences
    const summary = sentenceScores
    
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.sentence)
      .join(" ");

    // Keywords
    const keywords = Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 10);

    const newCase = new Case({
      userId: req.userId,
      filename: req.file.filename,
      extractedText: text,
      insights: {
        summary,
        keywords
      }
    });

    await newCase.save();

    res.json({ message: "File processed successfully" });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: "Processing failed" });

  }

});

router.get("/", authMiddleware, async (req, res) => {

  const cases = await Case.find({ userId: req.userId });

  res.json(cases);

});

router.delete("/:id", authMiddleware, async (req, res) => {

  await Case.findByIdAndDelete(req.params.id);

  res.json({ message: "Case deleted successfully" });

});

export default router;