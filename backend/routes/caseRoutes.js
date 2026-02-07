import express from "express";
import multer from "multer";
import Case from "../models/case.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload Case
router.post("/upload", upload.single("file"), async (req, res) => {
  const newCase = new Case({
    userId: req.body.userId,
    filename: req.file.filename
  });

  await newCase.save();
  res.json({ message: "Case uploaded" });
});

// Get User Cases
router.get("/:userId", async (req, res) => {
  const cases = await Case.find({ userId: req.params.userId });
  res.json(cases);
});

export default router;
