const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Dashboard statistics (Admin only)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  dashboardController.getDashboardStats
);

module.exports = router;