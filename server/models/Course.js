const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    duration: { type: String, default: "" }
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    enrolledAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    instructor: { type: String, trim: true, default: "CodeForge" },
    udemyUrl: { type: String, trim: true, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    duration: { type: String, default: "" },
    certificateEnabled: { type: Boolean, default: true },
    lessons: [lessonSchema],
    enrollments: [enrollmentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
