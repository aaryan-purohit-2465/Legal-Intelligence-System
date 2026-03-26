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

    const cleanText = text.replace(/\s+/g, " ").trim();

    
    const sentences = cleanText.split(". ");

    let summary = sentences.slice(0, 3).join(". ");

    
    const words = cleanText
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .filter(word => word.length > 5);

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const keywords = Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 10);

    
    let parties = [];

    const partyMatch = cleanText.match(/between (.*?) and (.*?)[\.,]/i);

    if (partyMatch) {
      parties = [partyMatch[1].trim(), partyMatch[2].trim()];
    }

    if (parties.length === 0) {
      parties = ["Party A", "Party B"];
    }

    
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
            const partyKey = party.split(" ")[0].toLowerCase();
            if (lower.includes(partyKey)) {
              scores[party] += 2; // stronger weight
            } else {
              scores[party] += 1; // generic penalty
            }
          });
        }
      });
    });

    
    let verdict = {};
    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    if (total === 0) {
      
      const equal = Math.round(100 / parties.length);
      parties.forEach(p => {
        verdict[p] = equal;
      });
    } else {
      for (let party in scores) {
        verdict[party] = Math.round((scores[party] / total) * 100);
      }
    }

    
    const newCase = new Case({
      userId: req.userId,
      filename: req.file.filename,
      extractedText: cleanText,
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


router.get("/", authMiddleware, async (req, res) => {
  const cases = await Case.find({ userId: req.userId });
  res.json(cases);
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
