const db = require("../db/db");

exports.placeOrder = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  // Check product
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [product_id],
    (err, products) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (products.length === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const product = products[0];

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      const totalAmount = product.price * quantity;

      // Create order
      db.query(
        "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
        [userId, totalAmount],
        (err, orderResult) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          const orderId = orderResult.insertId;

          // Save order item
          db.query(
            `INSERT INTO order_items
             (order_id, product_id, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [
              orderId,
              product_id,
              quantity,
              product.price,
            ],
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }

              // Reduce stock
              db.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [quantity, product_id],
                (err) => {
                  if (err) {
                    return res.status(500).json({
                      message: err.message,
                    });
                  }

                  res.status(201).json({
                    message: "Order placed successfully",
                    order_id: orderId,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

// Get All Orders
exports.getOrders = (req, res) => {
  db.query(
    `SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at
     FROM orders o
     ORDER BY o.created_at DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(200).json({
        count: results.length,
        orders: results,
      });
    }
  );
};

// Get Order Details
exports.getOrderById = (req, res) => {
  console.log("GET ORDER BY ID CALLED");
  console.log(req.params.id);
  const orderId = req.params.id;

  db.query(
    `SELECT
        o.id AS order_id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at,
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.price
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON oi.product_id = p.id
     WHERE o.id = ?`,
    [orderId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json({
        order: results,
      });
    }
  );
};