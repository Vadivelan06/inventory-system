const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  productController.createProduct
);

module.exports = router;