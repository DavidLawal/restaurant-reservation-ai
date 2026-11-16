import express from "express";
import { sql, getPool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const pool = await getPool();
    let query = "SELECT * FROM reservations";
    const request = pool.request();

    if (req.user.role !== "admin") {
      query += " WHERE user_id = @userId";
      request.input("userId", sql.Int, req.user.id);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", requireAuth, async (req, res) => {
  const { date, time, party_size } = req.body;

  try {
    const pool = await getPool();

    const countResult = await pool
      .request()
      .input("date", sql.Date, date)
      .input("time", sql.Time, time)
      .query(
        `SELECT COUNT(*) AS count
         FROM reservations
         WHERE date = @date AND time = @time
           AND status <> 'cancelled'`
      );

    const count = countResult.recordset[0].count;
    const MAX_RES_PER_SLOT = 10;

    if (count >= MAX_RES_PER_SLOT) {
      return res
        .status(400)
        .json({ message: "Time slot fully booked" });
    }

    await pool
      .request()
      .input("user_id", sql.Int, req.user.id)
      .input("date", sql.Date, date)
      .input("time", sql.Time, time)
      .input("party_size", sql.Int, party_size)
      .query(
        `INSERT INTO reservations (user_id, date, time, party_size, status)
         VALUES (@user_id, @date, @time, @party_size, 'pending')`
      );

    res.json({ message: "Reservation created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
