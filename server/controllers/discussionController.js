const mongoose = require("mongoose");
const Discussion = require("../models/Discussion");

const getDiscussions = async (req, res) => {
  try {
    const filter = {};
    if (typeof req.query.category === "string" && req.query.category.trim()) {
      filter.category = req.query.category.trim();
    }
    const discussions = await Discussion.find(filter)
      .populate("createdBy", "name")
      .populate("messages.user", "name")
      .sort({ updatedAt: -1 });
    res.json({ success: true, discussions });
  } catch (error) {
    console.error("GET DISCUSSIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load discussions." });
  }
};

const createDiscussion = async (req, res) => {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const category = typeof req.body.category === "string" ? req.body.category.trim() : "General";
    if (title.length < 2 || title.length > 160) {
      return res.status(400).json({ success: false, message: "Title must be between 2 and 160 characters." });
    }
    if (category.length > 80) {
      return res.status(400).json({ success: false, message: "Category must be 80 characters or fewer." });
    }

    const discussion = await Discussion.create({
      title,
      category: category || "General",
      createdBy: req.user._id,
      messages: []
    });
    await discussion.populate("createdBy", "name");
    res.status(201).json({ success: true, discussion });
  } catch (error) {
    console.error("CREATE DISCUSSION ERROR:", error);
    res.status(500).json({ success: false, message: "Could not create discussion." });
  }
};

const replyToDiscussion = async (req, res) => {
  try {
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 5000) {
      return res.status(400).json({ success: false, message: "Reply must be between 1 and 5000 characters." });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid discussion ID." });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: "Discussion not found." });
    }

    discussion.messages.push({ user: req.user._id, text });
    await discussion.save();
    await discussion.populate("messages.user", "name");
    res.status(201).json({
      success: true,
      message: "Reply added.",
      reply: discussion.messages[discussion.messages.length - 1]
    });
  } catch (error) {
    console.error("DISCUSSION REPLY ERROR:", error);
    res.status(500).json({ success: false, message: "Could not add reply." });
  }
};

module.exports = { getDiscussions, createDiscussion, replyToDiscussion };
