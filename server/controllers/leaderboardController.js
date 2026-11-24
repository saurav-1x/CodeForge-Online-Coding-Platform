const User = require("../models/User");
const Submission = require("../models/Submission");

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}).select("name streak solvedProblems").lean();
    const submissions = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] }
          },
          solvedSet: {
            $addToSet: { $cond: [{ $eq: ["$status", "Accepted"] }, "$problem", null] }
          }
        }
      }
    ]);
    const submissionByUser = new Map(
      submissions.map((item) => [String(item._id), item])
    );

    const leaderboard = users.map((user) => {
      const stats = submissionByUser.get(String(user._id)) || {};
      const acceptedProblemIds = new Set(
        (stats.solvedSet || []).filter((id) => id).map((id) => String(id))
      );
      for (const problemId of user.solvedProblems || []) {
        acceptedProblemIds.add(String(problemId));
      }
      const solved = acceptedProblemIds.size;
      const achievements = [];
      if (solved >= 1) achievements.push("First Solve");
      if (solved >= 5) achievements.push("Five Problem Club");
      if (solved >= 10) achievements.push("Problem Solver");
      if ((stats.acceptedSubmissions || 0) >= 25) achievements.push("Accepted 25");
      if ((user.streak || 0) >= 7) achievements.push("7 Day Streak");

      return {
        id: user._id,
        name: user.name,
        solved,
        submissions: stats.totalSubmissions || 0,
        acceptedSubmissions: stats.acceptedSubmissions || 0,
        streak: user.streak || 0,
        achievements
      };
    });

    leaderboard.sort((a, b) =>
      b.solved - a.solved ||
      b.acceptedSubmissions - a.acceptedSubmissions ||
      b.submissions - a.submissions ||
      String(a.name).localeCompare(String(b.name))
    );
    const ranked = leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }));
    const currentId = String(req.user._id);
    const current = ranked.find((entry) => String(entry.id) === currentId) || null;
    const position = current ? current.rank : ranked.length + 1;

    res.json({
      success: true,
      leaderboard: ranked,
      currentUser: current,
      position
    });
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load leaderboard." });
  }
};

module.exports = { getLeaderboard };
