const db = require("../config/db");

const PREVIEW_COURSE_SLUGS = new Set([
  "cybersecurity-certification-course",
  "quantum-computing-certification-course",
  "iot-workshop",
  "ai-tools-course"
]);

const isPreviewCourseId = (value) => {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  return PREVIEW_COURSE_SLUGS.has(normalized);
};

/* Enroll Student */
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;
    console.log(`Enroll request: userId=${userId}, courseId=${courseId}`);

    if (isPreviewCourseId(courseId)) {
      return res.status(201).json({
        success: true,
        message: "Enrollment Successful",
        preview: true
      });
    }

    // Resolve courseId: allow numeric IDs or slug-like strings (e.g. "ai-tools-course")
    let resolvedCourseId = null;
    if (typeof courseId === 'number' || /^[0-9]+$/.test(String(courseId))) {
      resolvedCourseId = Number(courseId);
    } else if (typeof courseId === 'string') {
      // Try to find a course by a slugified title (replace spaces with '-') or exact title match
      const slug = courseId.toLowerCase();
      const [found] = await db.query(
        "SELECT id, title FROM courses WHERE id = ? OR REPLACE(LOWER(title),' ', '-') = ? LIMIT 1",
        [courseId, slug]
      );
      if (found && found.length > 0) {
        resolvedCourseId = found[0].id;
      }
    }

    if (!resolvedCourseId) {
      return res.status(400).json({ success: false, message: 'Course not found' });
    }

    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, resolvedCourseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already Enrolled"
      });
    }

    await db.query(
      "INSERT INTO enrollments(user_id, course_id) VALUES(?, ?)",
      [userId, resolvedCourseId]
    );

    // Create progress tracking entry
    try {
      await db.query(
        "INSERT INTO progress_tracking(user_id, course_id, modules_completed, total_modules, completion_percentage) VALUES(?, ?, 0, 0, 0)",
        [userId, resolvedCourseId]
      );
    } catch (err) {
      console.warn('Progress tracking insert failed (non-fatal):', err.message || err);
      // Continue — progress table might be missing in some environments
    }

    res.status(201).json({
      success: true,
      message: "Enrollment Successful"
    });

  } catch (error) {
    console.error("Enroll Course Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/* My Enrolled Courses */
exports.myCourses = async (req, res) => {
  try {
    const [courses] = await db.query(
      `SELECT c.id, c.title, c.description, c.category, c.thumbnail, e.progress, e.completed, e.enrolled_at
       FROM enrollments e 
       JOIN courses c ON e.course_id = c.id 
       WHERE e.user_id = ?`,
      [req.user.id]
    );

    res.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error("My Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* Check Enrollment Status */
exports.checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    if (isPreviewCourseId(courseId)) {
      return res.json({
        success: true,
        isEnrolled: true,
        enrollment: { preview: true },
        preview: true
      });
    }

    // Resolve courseId similar to enrollCourse
    let resolvedCourseId = null;
    if (/^[0-9]+$/.test(String(courseId))) resolvedCourseId = Number(courseId);
    else {
      const slug = String(courseId).toLowerCase();
      const [found] = await db.query(
        "SELECT id FROM courses WHERE id = ? OR REPLACE(LOWER(title),' ', '-') = ? LIMIT 1",
        [courseId, slug]
      );
      if (found && found.length > 0) resolvedCourseId = found[0].id;
    }

    if (!resolvedCourseId) {
      return res.json({ success: true, isEnrolled: false, enrollment: null });
    }

    const [enrollment] = await db.query(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, resolvedCourseId]
    );

    res.json({
      success: true,
      isEnrolled: enrollment.length > 0,
      enrollment: enrollment[0] || null
    });

  } catch (error) {
    console.error("Check Enrollment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* Update Enrollment Progress Directly */
exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, progress } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    // Resolve courseId
    let resolvedCourseId = null;
    if (typeof courseId === 'number' || /^[0-9]+$/.test(String(courseId))) {
      resolvedCourseId = Number(courseId);
    } else if (typeof courseId === 'string') {
      const slug = courseId.toLowerCase();
      const [found] = await db.query(
        "SELECT id FROM courses WHERE id = ? OR REPLACE(LOWER(title),' ', '-') = ? LIMIT 1",
        [courseId, slug]
      );
      if (found && found.length > 0) {
        resolvedCourseId = found[0].id;
      }
    }

    if (!resolvedCourseId) {
      return res.status(400).json({ success: false, message: 'Course not found' });
    }

    const isCompleted = progress >= 100 ? 1 : 0;

    await db.query(
      "UPDATE enrollments SET progress = ?, completed = ? WHERE user_id = ? AND course_id = ?",
      [Math.round(progress), isCompleted, userId, resolvedCourseId]
    );

    // Also update progress_tracking if it exists
    try {
      await db.query(
        "UPDATE progress_tracking SET completion_percentage = ? WHERE user_id = ? AND course_id = ?",
        [progress, userId, resolvedCourseId]
      );
    } catch (err) {
      // non-fatal
    }

    // Generate certificate automatically if completed
    if (isCompleted) {
      const [existingCert] = await db.query(
        "SELECT * FROM certificates WHERE user_id = ? AND course_id = ?",
        [userId, resolvedCourseId]
      );
      if (existingCert.length === 0) {
        const certificateCode = `CERT-${Date.now()}-${userId}-${resolvedCourseId}`;
        await db.query(
          "INSERT INTO certificates (user_id, course_id, certificate_code) VALUES (?, ?, ?)",
          [userId, resolvedCourseId, certificateCode]
        );
      }
    }

    res.json({
      success: true,
      message: "Enrollment Progress Updated Successfully",
      progress,
      completed: isCompleted === 1
    });

  } catch (error) {
    console.error("Update Enrollment Progress Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};