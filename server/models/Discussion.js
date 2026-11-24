const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    text: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 }
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    category: { type: String, trim: true, default: "General", maxlength: 80 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);
