const db = require("../db/db");

// Create Product
exports.createProduct = (req, res) => {
  const {
    name,
    sku,
    category,
    price,
    stock,
    low_stock_limit,
    status,
  } = req.body;

  // Check SKU already exists
  db.query(
    "SELECT * FROM products WHERE sku = ?",
    [sku],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }

      db.query(
        `INSERT INTO products
        (name, sku, category, price, stock, low_stock_limit, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          sku,
          category,
          price,
          stock,
          low_stock_limit,
          status || "active",
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          res.status(201).json({
            message: "Product created successfully",
          });
        }
      );
    }
  );
};