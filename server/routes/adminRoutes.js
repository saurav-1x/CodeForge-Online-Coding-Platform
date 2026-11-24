const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const admin = require("../controllers/adminController");

const router = express.Router();
router.use(protect, requireAdmin);

router.get("/overview", admin.overview);
router.get("/users", admin.getUsers);
router.post("/users", admin.createUser);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

router.get("/problems", admin.getProblems);
router.post("/problems", admin.problemCrud.create);
router.put("/problems/:id", admin.problemCrud.update);
router.delete("/problems/:id", admin.problemCrud.remove);

router.get("/contests", admin.getContests);
router.post("/contests", admin.contestCrud.create);
router.put("/contests/:id", admin.contestCrud.update);
router.delete("/contests/:id", admin.contestCrud.remove);

router.get("/courses", admin.getCourses);
router.post("/courses", admin.courseCrud.create);
router.put("/courses/:id", admin.courseCrud.update);
router.delete("/courses/:id", admin.courseCrud.remove);

router.get("/submissions", admin.getSubmissions);
router.delete("/submissions/:id", admin.deleteSubmission);

module.exports = router;
