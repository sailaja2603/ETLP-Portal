const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  enrollCourse,
  myCourses,
  checkEnrollmentStatus,
  updateEnrollmentProgress
} = require("../controllers/enrollmentController");

router.post("/enroll", protect, enrollCourse);
router.get("/my-courses", protect, myCourses);
router.get("/status/:courseId", protect, checkEnrollmentStatus);
router.post("/update-progress", protect, updateEnrollmentProgress);

module.exports = router;