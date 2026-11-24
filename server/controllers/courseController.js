const mongoose = require("mongoose");
const Course = require("../models/Course");

const findCourse = (identifier) =>
  mongoose.isValidObjectId(identifier)
    ? Course.findById(identifier)
    : Course.findOne({ slug: String(identifier).toLowerCase() });

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load courses." });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, course });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to load course." });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    const userId = req.user._id;
    let enrollment = course.enrollments.find((item) => item.user.equals(userId));
    if (!enrollment) {
      course.enrollments.push({ user: userId, progress: 0, completed: false });
      await course.save();
      enrollment = course.enrollments[course.enrollments.length - 1];
    }
    res.json({ success: true, message: "Enrolled successfully.", enrollment, udemyUrl: course.udemyUrl });
  } catch (error) {
    console.error("ENROLL COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Could not enroll in course." });
  }
};

const unenrollCourse = async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    const before = course.enrollments.length;
    course.enrollments = course.enrollments.filter((item) => !item.user.equals(req.user._id));
    if (course.enrollments.length === before) {
      return res.status(404).json({ success: false, message: "You are not enrolled in this course." });
    }

    await course.save();
    return res.json({ success: true, message: "You have been unenrolled." });
  } catch (error) {
    console.error("UNENROLL COURSE ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not unenroll from course." });
  }
};

const updateProgress = async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    const enrollment = course.enrollments.find((item) => item.user.equals(req.user._id));
    if (!enrollment) return res.status(404).json({ success: false, message: "You are not enrolled in this course." });

    const progress = Number(req.body.progress);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      return res.status(400).json({ success: false, message: "Progress must be a number from 0 to 100." });
    }
    enrollment.progress = Math.round(progress);
    if (enrollment.progress === 100) {
      enrollment.completed = true;
      enrollment.completedAt = enrollment.completedAt || new Date();
    } else if (req.body.completed === true) {
      return res.status(400).json({ success: false, message: "Progress must be 100 to complete the course." });
    }
    await course.save();
    res.json({ success: true, enrollment });
  } catch (error) {
    console.error("COURSE PROGRESS ERROR:", error);
    res.status(500).json({ success: false, message: "Could not update progress." });
  }
};

const completeCourse = async (req, res) => {
  try {
    const course = await findCourse(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    const enrollment = course.enrollments.find((item) => item.user.equals(req.user._id));
    if (!enrollment) return res.status(404).json({ success: false, message: "You are not enrolled in this course." });
    enrollment.progress = 100;
    enrollment.completed = true;
    enrollment.completedAt = enrollment.completedAt || new Date();
    await course.save();
    res.json({ success: true, message: "Course completed.", certificateEnabled: course.certificateEnabled, enrollment });
  } catch (error) {
    console.error("COMPLETE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Could not complete course." });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const courses = await Course.find({ "enrollments.user": req.user._id }).sort({ updatedAt: -1 });
    const enrollments = courses.map((course) => ({
      course: {
        id: course._id,
        title: course.title,
        slug: course.slug,
        level: course.level,
        duration: course.duration
      },
      enrollment: course.enrollments.find((item) => item.user.equals(req.user._id))
    }));
    res.json({ success: true, enrollments });
  } catch (error) {
    console.error("MY ENROLLMENTS ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load enrollments." });
  }
};

module.exports = { getCourses, getCourse, enrollCourse, unenrollCourse, updateProgress, completeCourse, getMyEnrollments };
