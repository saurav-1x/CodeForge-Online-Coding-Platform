const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["Upcoming", "Active", "Ended"], default: "Upcoming" },
    participants: [participantSchema]
  },
  { timestamps: true }
);

contestSchema.pre("validate", function (next) {
  if (this.endTime <= this.startTime) {
    next(new Error("Contest end time must be after its start time."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Contest", contestSchema);
