import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import Case from "../models/case.js";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================== UPLOAD CASE ==================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;

    // 🔥 KEYWORD EXTRACTION
    const words = text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/);

    const freq = {};
    words.forEach(word => {
      if (word.length > 4) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    const keywords = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 10);

    // 🔥 SIMPLE SUMMARY
    const summary = text.substring(0, 200);

    // 🔥 CREDIBILITY SCORE
    const credibilityKeywords = [
      "certificate",
      "verified",
      "approved",
      "official",
      "government",
      "university",
      "institute",
      "license",
      "valid",
      "certified"
    ];

    let score = 0;

    credibilityKeywords.forEach(word => {
      if (text.toLowerCase().includes(word)) {
        score += 10;
      }
    });

    score = Math.min(score, 100);

    // 🔥 SAVE TO DB
    const newCase = new Case({
      userId: req.body.userId,
      filename: req.file.filename,
      extractedText: text,
      insights: {
        summary,
        keywords,
        credibilityScore: score
      }
    });

    await newCase.save();

    res.json(newCase);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing file" });
  }
});

// ================== GET ALL CASES ==================
router.get("/:userId", async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cases" });
  }
});

// ================== DELETE CASE ==================
router.delete("/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting case" });
  }
});

export default router;