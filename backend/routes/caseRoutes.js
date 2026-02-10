import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import Case from "../models/case.js";

const router = express.Router();

/* ================= STORAGE CONFIG ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= UPLOAD + EXTRACT ================= */

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdf(dataBuffer);

    const newCase = new Case({
      userId: req.body.userId || "123",
      filename: req.file.filename,
      extractedText: pdfData.text
    });

    await newCase.save();

    console.log("File uploaded & text extracted");

    res.json({
      message: "File uploaded and text extracted",
      textLength: pdfData.text.length
    });

  } catch (err) {
    console.error("PDF extraction error:", err.message);
    res.status(500).json({ message: "Text extraction failed" });
  }
});

/* ================= GET USER CASES ================= */

router.get("/:userId", async (req, res) => {
  try {
    const cases = await Case.find({ userId: req.params.userId });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cases" });
  }
});

export default router;
