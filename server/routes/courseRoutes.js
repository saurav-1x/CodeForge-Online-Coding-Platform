const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getCourses, getCourse, enrollCourse, unenrollCourse, updateProgress, completeCourse, getMyEnrollments } =
  require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/mine", protect, getMyEnrollments);
router.get("/:id", getCourse);
router.post("/:id/enroll", protect, enrollCourse);
router.delete("/:id/enroll", protect, unenrollCourse);
router.patch("/:id/progress", protect, updateProgress);
router.put("/:id/progress", protect, updateProgress);
router.post("/:id/complete", protect, completeCourse);

module.exports = router;
