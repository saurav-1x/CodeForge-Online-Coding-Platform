const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getDiscussions, createDiscussion, replyToDiscussion } = require("../controllers/discussionController");

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", protect, createDiscussion);
router.post("/:id/reply", protect, replyToDiscussion);

module.exports = router;
