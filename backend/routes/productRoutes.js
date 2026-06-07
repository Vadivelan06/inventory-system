const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, productController.getProducts);
// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  productController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productController.deleteProduct
);

module.exports = router;