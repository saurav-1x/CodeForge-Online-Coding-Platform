const mongoose = require("mongoose");
const Contest = require("../models/Contest");

const findContest = (identifier) =>
  mongoose.isValidObjectId(identifier)
    ? Contest.findById(identifier)
    : Contest.findOne({ slug: String(identifier).toLowerCase() });

const getContests = async (req, res) => {
  try {
    const contests = await Contest.find({})
      .select("title slug description startTime endTime status participants")
      .sort({ startTime: 1 });
    res.json({ success: true, contests });
  } catch (error) {
    console.error("GET CONTESTS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load contests." });
  }
};

const joinContest = async (req, res) => {
  try {
    const contest = await findContest(req.params.id);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found." });
    }
    if (contest.status !== "Active") {
      return res.status(400).json({ success: false, message: "You can join only a live contest." });
    }

    const userId = req.user._id;
    const alreadyJoined = contest.participants.some((participant) =>
      participant.user.equals(userId)
    );
    if (!alreadyJoined) {
      contest.participants.push({ user: userId });
      await contest.save();
    }

    return res.json({
      success: true,
      message: alreadyJoined ? "You are already participating." : "Contest joined successfully.",
      joined: true,
      contest
    });
  } catch (error) {
    console.error("JOIN CONTEST ERROR:", error);
    res.status(500).json({ success: false, message: "Could not join the contest." });
  }
};

const getParticipants = async (req, res) => {
  try {
    const contest = await findContest(req.params.id);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found." });
    }

    await contest.populate("participants.user", "name email streak");
    res.json({
      success: true,
      participants: contest.participants,
      total: contest.participants.length
    });
  } catch (error) {
    console.error("GET CONTEST PARTICIPANTS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load participants." });
  }
};

const getMyParticipations = async (req, res) => {
  try {
    const contests = await Contest.find({ "participants.user": req.user._id })
      .select("title slug status participants")
      .sort({ startTime: 1 });
    const participations = contests.map((contest) => ({
      contest: contest._id,
      joinedAt: contest.participants.find((participant) => participant.user.equals(req.user._id))?.joinedAt,
    }));
    res.json({ success: true, participations });
  } catch (error) {
    console.error("GET MY CONTESTS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load your contests." });
  }
};

module.exports = { getContests, joinContest, getParticipants, getMyParticipations };
