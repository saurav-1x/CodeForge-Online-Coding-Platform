const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    attemptedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    streak: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
