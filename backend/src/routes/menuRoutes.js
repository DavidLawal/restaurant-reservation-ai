import express from "express";
import { sql, getPool } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM menu_items WHERE available = 1");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { name, description, price, category, available } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("name", sql.VarChar(100), name)
      .input("description", sql.Text, description || null)
      .input("price", sql.Decimal(10, 2), price)
      .input("category", sql.VarChar(50), category || null)
      .input("available", sql.Bit, available !== false)
      .query(
        `INSERT INTO menu_items (name, description, price, category, available)
         VALUES (@name, @description, @price, @category, @available)`
      );

    res.json({ message: "Menu item created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, available } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar(100), name)
      .input("description", sql.Text, description || null)
      .input("price", sql.Decimal(10, 2), price)
      .input("category", sql.VarChar(50), category || null)
      .input("available", sql.Bit, available !== false)
      .query(
        `UPDATE menu_items
         SET name = @name,
             description = @description,
             price = @price,
             category = @category,
             available = @available
         WHERE id = @id`
      );

    res.json({ message: "Menu item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    await pool.request().input("id", sql.Int, id).query(
      "DELETE FROM menu_items WHERE id = @id"
    );
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
