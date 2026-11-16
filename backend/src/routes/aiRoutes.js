import express from "express";
import { sql, getPool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// "AI" recommendations (simple)
router.get("/recommendations", requireAuth, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", sql.Int, req.user.id)
      .query(
        `SELECT TOP (3) mi.*
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE o.user_id = @userId
         ORDER BY o.created_at DESC`
      );

    res.json({
      message: "AI-based recommendations",
      basedOn: result.recordset,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/chat", requireAuth, async (req, res) => {
  const { message } = req.body;

  let reply = "Hello! I'm your restaurant assistant.";

  if (message.toLowerCase().includes("open")) {
    reply = "We are open from 10:00 AM to 10:00 PM every day.";
  } else if (message.toLowerCase().includes("vegan")) {
    reply = "We recommend our vegan salad and grilled vegetables.";
  }

  res.json({ reply });
});

export default router;
