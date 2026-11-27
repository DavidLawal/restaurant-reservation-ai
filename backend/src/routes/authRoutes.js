import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql, getPool } from "../config/db.js";
import { z } from "zod";
import { validate } from "../middleware/validate.js";


const router = express.Router();

const registerSchema = z.object({
  name: z.string({ error: "Name is required" }).trim().min(1, "Name is reqiured").max(100, "Name must be 100 characters or less"),
  email: z.email("Please enter a valid email").max(100, "Email must be 100 characters or less"),
  password: z.string({ error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});


router.post("/register", validate(registerSchema), async (req, res) => {
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


router.post("/login", validate(loginSchema), async (req, res) => {
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
