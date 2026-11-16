import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, getPool } from "../config/db.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await getPool();

    const existing = await pool
      .request()
      .input("email", sql.VarChar(100), email)
      .query("SELECT id FROM users WHERE email = @email");

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: "Email already used" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .input("password_hash", sql.VarChar(255), hash)
      .query(
        "INSERT INTO users (name, email, password_hash, role) " +
          "VALUES (@name, @email, @password_hash, 'customer')"
      );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("REGISTER error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("email", sql.VarChar(100), email)
      .query("SELECT * FROM users WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, { httpOnly: true })
      .json({
        message: "Logged in",
        token,
        role: user.role,
      });
  } catch (err) {
    console.error("LOGIN error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
