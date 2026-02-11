import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  userId: String,
  filename: String,
  extractedText: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  insights: {
  summary: String,
  keywords: [String],
  wordCount: Number
},

});

export default mongoose.model("Case", caseSchema);
