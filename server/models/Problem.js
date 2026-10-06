const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, required: true },
    hidden: { type: Boolean, default: false }
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: [{ type: String }],
    description: { type: String, required: true },
    examples: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    starterCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" }
    },
    testCases: [testCaseSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", problemSchema);
