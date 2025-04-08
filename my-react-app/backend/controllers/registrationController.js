import db from "../config/db.js";

// 🔹 ให้ผู้ใช้เข้าร่วมอีเวนต์
export const joinEvent = async (req, res) => {
    try {
        const user_id = req.user.id; // ✅ ใช้ user_id จาก token
        const { event_id } = req.body;

        if (!event_id) {
            return res.status(400).json({ message: "⚠️ กรุณาระบุ event_id" });
        }

        // ตรวจสอบว่าผู้ใช้เข้าร่วมอีเวนต์นี้ไปแล้วหรือยัง
        const [existing] = await db.query(
            "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
            [user_id, event_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "⚠️ คุณเข้าร่วมอีเวนต์นี้ไปแล้ว!" });
        }

        // บันทึกการเข้าร่วมอีเวนต์
        const sql = "INSERT INTO registrations (user_id, event_id, status, registered_at) VALUES (?, ?, 'joined', NOW())";
        await db.query(sql, [user_id, event_id]);

        res.status(201).json({ message: "✅ เข้าร่วมอีเวนต์สำเร็จ!" });
    } catch (err) {
        console.error("❌ Error joining event:", err);
        res.status(500).json({ error: "❌ Server error while joining event" });
    }
};

// 🔹 ดึงอีเวนต์ที่ผู้ใช้เข้าร่วม
export const getJoinedEvents = async (req, res) => {
    try {
        const user_id = req.user.id;
        const sql = `
            SELECT events.event_id, events.title, events.event_date, events.event_time, events.location 
            FROM registrations
            JOIN events ON registrations.event_id = events.event_id
            WHERE registrations.user_id = ?
        `;
        const [events] = await db.query(sql, [user_id]);

        res.json(events);
    } catch (err) {
        console.error("❌ Error fetching joined events:", err);
        res.status(500).json({ error: "❌ Server error while fetching joined events" });
    }
};
