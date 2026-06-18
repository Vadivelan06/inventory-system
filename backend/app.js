const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/db");

const db = require("./db/db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
console.log("APP JS LOADED-AFTER IMPORT");

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Protected route (any logged-in user)
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Admin-only route
app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
    });
  }
);

db.query("SELECT DATABASE() AS db", (err, results) => {
  if (err) {
    console.log("DATABASE ERROR:", err);
  } else {
    console.log("CURRENT DB:", results);
  }
});

db.query("SHOW TABLES", (err, results) => {
  if (err) {
    console.log("SHOW TABLES ERROR:", err);
  } else {
    console.log("TABLES:", results);
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});