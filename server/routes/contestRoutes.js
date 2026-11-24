const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getContests, joinContest, getParticipants, getMyParticipations } = require("../controllers/contestController");

const router = express.Router();

router.get("/", getContests);
router.get("/mine", protect, getMyParticipations);
router.get("/:id/participants", getParticipants);
router.post("/:id/join", protect, joinContest);

module.exports = router;
