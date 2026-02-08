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

// Upload + Extract Text
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const newCase = new Case({
      userId: req.body.userId,
      filename: req.file.filename,
      extractedText: pdfData.text
    });

    await newCase.save();

    res.json({ message: "File uploaded and text extracted" });
  } catch (err) {
    res.status(500).json({ message: "Text extraction failed" });
  }
});

// Get User Cases
router.get("/:userId", async (req, res) => {
  const cases = await Case.find({ userId: req.params.userId });
  res.json(cases);
});

export default router;
