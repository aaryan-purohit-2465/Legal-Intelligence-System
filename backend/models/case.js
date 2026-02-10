import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  userId: String,
  filename: String,
  extractedText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Case", caseSchema);
