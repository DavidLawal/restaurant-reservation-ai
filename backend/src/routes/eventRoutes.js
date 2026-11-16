import express from "express";
import { sql, getPool } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT * FROM events ORDER BY event_date ASC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM events WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { title, description, event_date, capacity, available_seats } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("title", sql.VarChar(100), title)
      .input("description", sql.Text, description || null)
      .input("event_date", sql.DateTime, event_date)
      .input("capacity", sql.Int, capacity)
      .input("available_seats", sql.Int, available_seats)
      .query(
        `INSERT INTO events (title, description, event_date, capacity, available_seats)
         VALUES (@title, @description, @event_date, @capacity, @available_seats)`
      );

    res.json({ message: "Event created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, capacity, available_seats } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("title", sql.VarChar(100), title)
      .input("description", sql.Text, description || null)
      .input("event_date", sql.DateTime, event_date)
      .input("capacity", sql.Int, capacity)
      .input("available_seats", sql.Int, available_seats)
      .query(
        `UPDATE events
         SET title = @title,
             description = @description,
             event_date = @event_date,
             capacity = @capacity,
             available_seats = @available_seats
         WHERE id = @id`
      );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    await pool.request().input("id", sql.Int, id)
      .query("DELETE FROM events WHERE id = @id");

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
