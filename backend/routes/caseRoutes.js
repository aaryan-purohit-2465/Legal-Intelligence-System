import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import Case from "../models/case.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= KEYWORD EXTRACTOR =================
function extractKeywords(text) {
  const stopWords = [
    "the","is","and","or","a","an","to","of","in","for","on",
    "with","as","by","at","from","that","this","it"
  ];

  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(word => word.length > 3 && !stopWords.includes(word));

  const frequency = {};

  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.keys(frequency)
    .sort((a, b) => frequency[b] - frequency[a])
    .slice(0, 10);
}

// ================= UPLOAD ROUTE =================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const keywords = extractKeywords(pdfData.text);

    const newCase = new Case({
      userId: req.body.userId,
      filename: req.file.filename,
      extractedText: pdfData.text,
      insights: {
        keywords: keywords
      }
    });

    await newCase.save();

    res.json({
      message: "File uploaded & analyzed successfully",
      keywords
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ================= GET USER CASES =================
router.get("/:userId", async (req, res) => {
  const cases = await Case.find({ userId: req.params.userId });
  res.json(cases);
});

export default router;
