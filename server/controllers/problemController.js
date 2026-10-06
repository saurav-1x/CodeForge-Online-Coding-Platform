const Problem = require("../models/Problem");

// Get all problems
const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .select("title slug difficulty tags")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      problems
    });
  } catch (error) {
    console.error("GET PROBLEMS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load problems"
    });
  }
};

// Get single problem
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    console.error("GET PROBLEM ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load problem"
    });
  }
};

module.exports = {
  getProblems,
  getProblemById
};