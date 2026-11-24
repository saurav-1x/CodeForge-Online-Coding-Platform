const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Problem = require("../models/Problem");
const Contest = require("../models/Contest");
const Course = require("../models/Course");
const Submission = require("../models/Submission");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const overview = async (req, res) => {
  try {
    const [users, problems, contests, courses, submissions, admins, suspended] =
      await Promise.all([
        User.countDocuments(),
        Problem.countDocuments(),
        Contest.countDocuments(),
        Course.countDocuments(),
        Submission.countDocuments(),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ status: "suspended" })
      ]);
    res.json({
      success: true,
      stats: { users, problems, contests, courses, submissions, admins, suspended }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load dashboard statistics." });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email role status streak solvedProblems attemptedProblems createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load users." });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user", status = "active", streak = 0 } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Name, a valid email, and a password of at least 6 characters are required." });
    }
    const normalizedEmail = normalizeEmail(email);
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "That email address is already registered." });
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: ["user", "admin"].includes(role) ? role : "user",
      status: ["active", "suspended"].includes(status) ? status : "active",
      streak: Math.max(0, Number(streak) || 0)
    });
    res.status(201).json({ success: true, message: "User created successfully.", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not create user." });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (typeof req.body.name === "string" && req.body.name.trim()) user.name = req.body.name.trim();
    if (typeof req.body.email === "string" && normalizeEmail(req.body.email)) {
      const email = normalizeEmail(req.body.email);
      const duplicate = await User.findOne({ email, _id: { $ne: user._id } });
      if (duplicate) return res.status(409).json({ success: false, message: "That email address is already in use." });
      user.email = email;
    }
    if (["user", "admin"].includes(req.body.role)) user.role = req.body.role;
    if (["active", "suspended"].includes(req.body.status)) user.status = req.body.status;
    if (req.body.streak !== undefined) user.streak = Math.max(0, Number(req.body.streak) || 0);
    if (typeof req.body.password === "string" && req.body.password) {
      if (req.body.password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
      user.password = await bcrypt.hash(req.body.password, 12);
    }
    await user.save();
    const safeUser = await User.findById(user._id).select("-password");
    res.json({ success: true, message: "User updated successfully.", user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update user." });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own administrator account." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    await Submission.deleteMany({ user: user._id });
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not delete user." });
  }
};

const crudList = (Model) => async (req, res) => {
  try {
    const items = await Model.find({}).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load records." });
  }
};

const problemCrud = {
  create: async (req, res) => {
    try {
      const slug = String(req.body.slug || "").trim().toLowerCase();
      if (!req.body.title || !slug || !req.body.description || !["Easy", "Medium", "Hard"].includes(req.body.difficulty)) {
        return res.status(400).json({ success: false, message: "Title, slug, description, and difficulty are required." });
      }
      const problem = await Problem.create({
        title: req.body.title.trim(), slug, difficulty: req.body.difficulty,
        description: req.body.description, tags: req.body.tags || [],
        examples: req.body.examples || [], starterCode: req.body.starterCode || {},
        testCases: req.body.testCases || []
      });
      res.status(201).json({ success: true, message: "Problem created successfully.", item: problem });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "That problem slug already exists." : "Could not create problem." });
    }
  },
  update: async (req, res) => {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) return res.status(404).json({ success: false, message: "Problem not found." });
      ["title", "slug", "difficulty", "description", "tags", "examples", "starterCode", "testCases"].forEach((key) => {
        if (req.body[key] !== undefined) problem[key] = key === "slug" ? String(req.body[key]).trim().toLowerCase() : req.body[key];
      });
      await problem.save();
      res.json({ success: true, message: "Problem updated successfully.", item: problem });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? "That problem slug already exists." : "Could not update problem." });
    }
  },
  remove: async (req, res) => {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found." });
    await Submission.deleteMany({ problem: problem._id });
    res.json({ success: true, message: "Problem deleted successfully." });
  }
};

const contestCrud = {
  create: async (req, res) => {
    try {
      const contest = await Contest.create(req.body);
      res.status(201).json({ success: true, message: "Contest created successfully.", item: contest });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 400).json({ success: false, message: error.code === 11000 ? "That contest slug already exists." : "Could not create contest." });
    }
  },
  update: async (req, res) => {
    try {
      const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!contest) return res.status(404).json({ success: false, message: "Contest not found." });
      res.json({ success: true, message: "Contest updated successfully.", item: contest });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 400).json({ success: false, message: error.code === 11000 ? "That contest slug already exists." : "Could not update contest." });
    }
  },
  remove: async (req, res) => {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) return res.status(404).json({ success: false, message: "Contest not found." });
    res.json({ success: true, message: "Contest deleted successfully." });
  }
};

const courseCrud = {
  create: async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).json({ success: true, message: "Course created successfully.", item: course });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 400).json({ success: false, message: error.code === 11000 ? "That course slug already exists." : "Could not create course." });
    }
  },
  update: async (req, res) => {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!course) return res.status(404).json({ success: false, message: "Course not found." });
      res.json({ success: true, message: "Course updated successfully.", item: course });
    } catch (error) {
      res.status(error.code === 11000 ? 409 : 400).json({ success: false, message: error.code === 11000 ? "That course slug already exists." : "Could not update course." });
    }
  },
  remove: async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted successfully." });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({})
      .populate("user", "name email")
      .populate("problem", "title slug")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json({ success: true, items: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load submissions." });
  }
};

const deleteSubmission = async (req, res) => {
  const submission = await Submission.findByIdAndDelete(req.params.id);
  if (!submission) return res.status(404).json({ success: false, message: "Submission not found." });
  res.json({ success: true, message: "Submission deleted successfully." });
};

module.exports = {
  overview, getUsers, createUser, updateUser, deleteUser,
  getProblems: crudList(Problem), problemCrud,
  getContests: crudList(Contest), contestCrud,
  getCourses: crudList(Course), courseCrud,
  getSubmissions, deleteSubmission
};
