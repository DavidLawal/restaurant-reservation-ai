import express from "express";
import { sql, getPool } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();


router.get("/", requireAuth, async (req, res) => {
  try {
    const pool = await getPool();

    let query = "SELECT * FROM orders";
    const request = pool.request();

    if (req.user.role !== "admin") {
      query += " WHERE user_id = @userId";
      request.input("userId", sql.Int, req.user.id);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("GET /orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", requireAuth, async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);

    await transaction.begin();

    let totalPrice = 0;

    for (const item of items) {
      const { menu_item_id, quantity } = item;

      if (!menu_item_id || !quantity || quantity <= 0) {
        await transaction.rollback();
        return res.status(400).json({ message: "Invalid item data" });
      }

      const priceResult = await transaction
        .request()
        .input("id", sql.Int, menu_item_id)
        .query(
          "SELECT price, available FROM menu_items WHERE id = @id"
        );

      if (priceResult.recordset.length === 0) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: `Menu item ${menu_item_id} not found` });
      }

      const menuItem = priceResult.recordset[0];

      if (!menuItem.available) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: `Menu item ${menu_item_id} not available` });
      }

      totalPrice += Number(menuItem.price) * quantity;
    }

    const orderResult = await transaction
      .request()
      .input("userId", sql.Int, req.user.id)
      .input("totalPrice", sql.Decimal(10, 2), totalPrice)
      .query(
        "INSERT INTO orders (user_id, total_price, status) " +
          "OUTPUT INSERTED.id " +
          "VALUES (@userId, @totalPrice, 'pending')"
      );

    const orderId = orderResult.recordset[0].id;

    for (const item of items) {
      const { menu_item_id, quantity } = item;

      const priceResult = await transaction
        .request()
        .input("id", sql.Int, menu_item_id)
        .query("SELECT price FROM menu_items WHERE id = @id");

      const price = priceResult.recordset[0].price;

      await transaction
        .request()
        .input("orderId", sql.Int, orderId)
        .input("menuItemId", sql.Int, menu_item_id)
        .input("quantity", sql.Int, quantity)
        .input("priceEach", sql.Decimal(10, 2), price)
        .query(
          "INSERT INTO order_items " +
            "(order_id, menu_item_id, quantity, price_each) " +
            "VALUES (@orderId, @menuItemId, @quantity, @priceEach)"
        );
    }

    await transaction.commit();

    res.json({
      message: "Order created",
      orderId,
      totalPrice,
    });
  } catch (err) {
    console.error("POST /orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const pool = await getPool();

    const orderResult = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM orders WHERE id = @id");

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.recordset[0];

    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const itemsResult = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM order_items WHERE order_id = @id");

    res.json({
      ...order,
      items: itemsResult.recordset,
    });
  } catch (err) {
    console.error("GET /orders/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { status } = req.body;

  try {
    const pool = await getPool();

    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .input("status", sql.VarChar(20), status)
      .query(
        "UPDATE orders SET status = @status WHERE id = @id"
      );

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error("PATCH /orders/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const pool = await getPool();

    const orderResult = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM orders WHERE id = @id");

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.recordset[0];

    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query(
        "DELETE FROM order_items WHERE order_id = @id; " +
          "DELETE FROM orders WHERE id = @id;"
      );

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("DELETE /orders/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
