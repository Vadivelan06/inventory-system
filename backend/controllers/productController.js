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

// Get All Products
exports.getProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";
  const status = req.query.status || "";

  const sortBy = req.query.sortBy || "id";
  const order = req.query.order === "DESC" ? "DESC" : "ASC";

  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];

  // Search
  if (search) {
    query += " AND (name LIKE ? OR sku LIKE ? OR category LIKE ?)";
    params.push(`%${search}%`);
    params.push(`%${search}%`);
    params.push(`%${search}%`);
  }

  // Filter
  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  // Sorting
  query += ` ORDER BY ${sortBy} ${order}`;

  // Pagination
  query += " LIMIT ? OFFSET ?";
  params.push(limit);
  params.push(offset);

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json({
      page,
      limit,
      count: results.length,
      products: results,
    });
  });
};

// Update Product
exports.updateProduct = (req, res) => {
  const id = req.params.id;

  const {
    name,
    sku,
    category,
    price,
    stock,
    low_stock_limit,
    status,
  } = req.body;

  db.query(
    `UPDATE products
     SET name=?,
         sku=?,
         category=?,
         price=?,
         stock=?,
         low_stock_limit=?,
         status=?
     WHERE id=?`,
    [
      name,
      sku,
      category,
      price,
      stock,
      low_stock_limit,
      status,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message: "Product updated successfully",
      });
    }
  );
};

// Delete Product
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message: "Product deleted successfully",
      });
    }
  );
};