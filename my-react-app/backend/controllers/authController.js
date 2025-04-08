import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  console.error("⚠️  JWT_SECRET is not set in .env file!");
  process.exit(1);
}

// 🔹 ฟังก์ชันสมัครสมาชิก (Register)
export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body; // ✅ เปลี่ยนจาก username เป็น full_name

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    // ตรวจสอบว่า email นี้มีอยู่ในระบบหรือยัง
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ เพิ่มข้อมูลลงในฐานข้อมูล ให้ใช้ `full_name` และ `password_hash`
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [full_name, normalizedEmail, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
  } catch (err) {
    console.error("❌ Error in register:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 🔹 ฟังก์ชันเข้าสู่ระบบ (Login)
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const normalizedEmail = email.toLowerCase();
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [normalizedEmail]);
  
      if (users.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash); // ✅ ใช้ password_hash ตาม database
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // ✅ สร้าง JWT Token และตั้งค่า Session
      const token = jwt.sign({ id: user.user_id, email: user.email }, secretKey, { expiresIn: "1h" });
  
      res.json({
        message: "Login successful!",
        token,
        user: { user_id: user.user_id, full_name: user.full_name, email: user.email }
      });
    } catch (err) {
      console.error("❌ Error in login:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
