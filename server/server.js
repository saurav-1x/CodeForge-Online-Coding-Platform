require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const codeRoutes = require("./routes/codeRoutes");
const contestRoutes = require("./routes/contestRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const courseRoutes = require("./routes/courseRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "CodeForge API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/certifications", courseRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;
