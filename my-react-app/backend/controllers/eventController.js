import pool from "../config/db.js"; // เปลี่ยนจาก import db เป็น import pool
import multer from "multer";
import path from "path";

// ตั้งค่า Multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/events/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `event-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("อนุญาตเฉพาะไฟล์ภาพ (JPEG, JPG, PNG, GIF)"));
    }
    cb(null, true);
  },
}).single("image");

export const createEvent = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.body.eventName || !req.body.date || !req.body.time || !req.body.location) {
        return res.status(400).json({ message: "❌ กรุณากรอกข้อมูลให้ครบถ้วน" });
      }

      const category_id = parseInt(req.body.category);
      if (isNaN(category_id)) {
        return res.status(400).json({ message: "❌ ประเภทกิจกรรมไม่ถูกต้อง" });
      }

      const image_url = req.file ? `/uploads/events/${req.file.filename}` : null;

      const sql = `
        INSERT INTO events
          (user_id, title, description, event_date, event_time, location, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await pool.query(sql, [ // ใช้ pool.query แทน db.query
        1,
        req.body.eventName,
        req.body.description,
        req.body.date,
        req.body.time + ":00",
        req.body.location,
        category_id,
        image_url,
      ]);

      res.status(201).json({
        message: "✅ สร้างอีเวนต์สำเร็จ!",
        eventId: result.insertId
      });
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const [events] = await pool.query("SELECT * FROM events ORDER BY event_date ASC"); // ใช้ pool.query แทน db.query
    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ error: "❌ Server error while fetching events" });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "⚠️ กรุณากรอกคำค้นหา" });
    }

    const sql = `
        SELECT * FROM events
        WHERE title LIKE ? OR location LIKE ?
        ORDER BY event_date ASC
    `;
    const searchQuery = `%${query}%`;
    const [events] = await pool.query(sql, [searchQuery, searchQuery]); // ใช้ pool.query แทน db.query

    res.json(events);
  } catch (err) {
    console.error("❌ Error searching events:", err);
    res.status(500).json({ error: "❌ Server error while searching events" });
  }
};

// 🔹 ดึงข้อมูลกิจกรรมตาม ID
export const getEventById = async (req, res) => {
  try {
      const { id } = req.params;
      const [event] = await pool.query( // ✅ ใช้ pool.query() แทน db.promise().query()
          "SELECT * FROM events WHERE event_id = ?",
          [id]
      );

      if (event.length === 0) {
          return res.status(404).json({ message: "❌ ไม่พบอีเวนต์นี้" });
      }

      res.json(event[0]);
  } catch (err) {
      console.error("❌ Error fetching event by ID:", err);
      res.status(500).json({ error: "❌ Server error while fetching event" });
  }
};

// 🔹 ดึงข้อมูลกิจกรรมที่ผู้ใช้สร้าง
export const getCreatedEvents = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user info is attached to req by auth middleware
    const [events] = await pool.query(
      "SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC",
      [userId]
    );
    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching created events:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่สร้าง" });
  }
};

// 🔹 ดึงข้อมูลกิจกรรมที่ผู้ใช้เข้าร่วม
export const getJoinedEvents = async (req, res) => {
  try {
    const userId = req.user.id; // assuming user info is attached to req by auth middleware
    const [events] = await pool.query(
      `SELECT e.* FROM events e 
       INNER JOIN event_participants ep ON e.event_id = ep.event_id 
       WHERE ep.user_id = ? 
       ORDER BY e.event_date ASC`,
      [userId]
    );
    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching joined events:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่เข้าร่วม" });
  }
};
