import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import Case from "../models/case.js";
import authMiddleware from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();

// ================= FILE UPLOAD SETUP =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================= UPLOAD ROUTE =================
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;

    // ================= KEYWORD EXTRACTION =================
    const words = text
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter(word => word.length > 4);

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const keywords = Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 10);

    // ================= IMPROVED SUMMARY =================
    const sentences = text.split(". ");
    const sentenceScores = sentences.map(sentence => {
      let score = 0;
      const lower = sentence.toLowerCase();

      keywords.forEach(k => {
        if (lower.includes(k)) score++;
      });

      return { sentence, score };
    });

    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.sentence);

    const summary = topSentences.join(". ");

    // ================= PARTY DETECTION =================
    let parties = [];

    const partyMatch = text.match(/between (.*?) and (.*?)[\.,]/i);

    if (partyMatch) {
      parties = [partyMatch[1].trim(), partyMatch[2].trim()];
    }

    if (parties.length === 0) {
      parties = ["Party A", "Party B"];
    }

    // ================= GUILT ANALYSIS =================
    const negativeWords = [
      "breach",
      "violation",
      "failed",
      "failure",
      "delay",
      "penalty",
      "default",
      "negligence"
    ];

    let scores = {};
    parties.forEach(p => scores[p] = 0);

    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase();

      negativeWords.forEach(word => {
        if (lower.includes(word)) {
          parties.forEach(party => {
            if (sentence.toLowerCase().includes(party.split(" ")[0].toLowerCase())) {
              scores[party] += 1;
            }
          });
        }
      });
    });

    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;

    let verdict = {};
    for (let party in scores) {
      verdict[party] = Math.round((scores[party] / total) * 100);
    }

    // ================= SAVE TO DB =================
    const newCase = new Case({
      userId: req.userId,
      filename: req.file.filename,
      extractedText: text,
      insights: {
        summary,
        keywords,
        verdict
      }
    });

    await newCase.save();

    res.json({ message: "File processed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Processing failed" });
  }
});

// ================= GET ALL CASES =================
router.get("/", authMiddleware, async (req, res) => {
  const cases = await Case.find({ userId: req.userId });
  res.json(cases);
});

// ================= DELETE CASE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;