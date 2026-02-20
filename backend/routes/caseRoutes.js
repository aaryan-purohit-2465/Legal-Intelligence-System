import express from "express";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import Case from "../models/case.js";

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

/* ============================= */
/* Upload + Extract + Insights   */
/* ============================= */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const text = pdfData.text;

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

    const summary = text.slice(0, 300);

    const newCase = new Case({
      userId: req.body.userId,
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

/* ============================= */
/* Get User Cases                */
/* ============================= */
router.get("/:userId", async (req, res) => {
  const cases = await Case.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(cases);
});

/* ============================= */
/* Search Cases                  */
/* ============================= */
router.get("/search/:userId/:query", async (req, res) => {
  const { userId, query } = req.params;

  try {
    const results = await Case.find({
      userId,
      extractedText: { $regex: query, $options: "i" }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

/* ============================= */
/* Delete Case                   */
/* ============================= */
router.delete("/:id", async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
