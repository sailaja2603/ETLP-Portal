const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getDashboard,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getLeaderboard
} = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/users", protect, authorizeRoles("admin", "faculty"), getAllUsers);
router.put("/users/role", protect, authorizeRoles("admin", "faculty"), updateUserRole);
router.delete("/users/:id", protect, authorizeRoles("admin", "faculty"), deleteUser);

module.exports = router;