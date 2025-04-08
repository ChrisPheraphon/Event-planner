import db from "../config/db.js";

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [notifications] = await db.query(sql, [user_id]);
    res.json(notifications);
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    res.status(500).json({ error: "❌ Server error while fetching notifications" });
  }
};
