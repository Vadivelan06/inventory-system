const db = require("../db/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.query(
    "SELECT COUNT(*) AS totalUsers FROM users",
    (err, usersResult) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      stats.totalUsers = usersResult[0].totalUsers;

      db.query(
        "SELECT COUNT(*) AS totalProducts FROM products",
        (err, productsResult) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          stats.totalProducts = productsResult[0].totalProducts;

          db.query(
            "SELECT COUNT(*) AS totalOrders FROM orders",
            (err, ordersResult) => {
              if (err) {
                return res.status(500).json({ message: err.message });
              }

              stats.totalOrders = ordersResult[0].totalOrders;

              db.query(
                `SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue
                 FROM orders`,
                (err, revenueResult) => {
                  if (err) {
                    return res.status(500).json({
                      message: err.message,
                    });
                  }

                  stats.totalRevenue =
                    revenueResult[0].totalRevenue;

                  res.status(200).json(stats);
                }
              );
            }
          );
        }
      );
    }
  );
};