import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import Case from "../models/case.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Simple text cleaning
const cleanText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/);
};

// Stopwords
const stopWords = new Set([
  "the","is","and","to","of","in","for","on","with","a","an","this",
  "that","it","as","at","by","from","or","are","be","was","were"
]);

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const words = cleanText(pdfData.text);

    const frequency = {};
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(frequency)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 10)
      .map(item => item[0]);

    const summary = pdfData.text.substring(0, 300) + "...";

    const newCase = new Case({
      userId: req.body.userId,
      filename: req.file.filename,
      extractedText: pdfData.text,
      insights: {
        keywords: sortedKeywords,
        frequency,
        summary
      }
    });

    await newCase.save();

    res.json({ message: "File uploaded and analyzed" });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Processing failed" });
  }
});

router.get("/:userId", async (req, res) => {
  const cases = await Case.find({ userId: req.params.userId });
  res.json(cases);
});

export default router;
