
const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  submitCode,
  getMySubmissions,
} = require("../controllers/submissionController");

const router = express.Router();

// Login required for both routes
router.post("/submit", protect, submitCode);
router.get("/mine", protect, getMySubmissions);

module.exports = router;