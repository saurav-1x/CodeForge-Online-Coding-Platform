const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    language: { type: String, required: true },
    languageId: { type: Number, required: true },
    code: { type: String, required: true },
    status: { type: String, default: "Pending" },
    passedTests: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    runtime: { type: String, default: "-" },
    memory: { type: String, default: "-" },
    error: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
