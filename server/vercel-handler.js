const mongoose = require("mongoose");
const app = require("./server");
const Problem = require("./models/Problem");
const Contest = require("./models/Contest");
const Course = require("./models/Course");
const { problems, defaultContests, defaultCourses } = require("./seed");

let connectionPromise;
let problemSeedPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
}

async function seedMissingProblems() {
  if (!problemSeedPromise) {
    problemSeedPromise = (async () => {
      await Problem.init();
      await Problem.bulkWrite(
        problems.map((problem) => ({
          updateOne: {
            filter: { slug: problem.slug },
            update: { $setOnInsert: problem },
            upsert: true
          }
        }))
      );
      await Contest.init();
      await Contest.bulkWrite(
        defaultContests.map((contest) => ({
          updateOne: {
            filter: { slug: contest.slug },
            update: { $setOnInsert: contest },
            upsert: true
          }
        }))
      );
      await Course.init();
      await Course.bulkWrite(
        defaultCourses.map((course) => ({
          updateOne: {
            filter: { slug: course.slug },
            update: { $setOnInsert: course },
            upsert: true
          }
        }))
      );
    })().catch((error) => {
      problemSeedPromise = undefined;
      throw error;
    });
  }

  await problemSeedPromise;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    await seedMissingProblems();
    return app(req, res);
  } catch (error) {
    console.error("API initialization failed:", error.message);
    return res.status(503).json({
      success: false,
      message: "API is unavailable. Check the backend environment configuration."
    });
  }
};
