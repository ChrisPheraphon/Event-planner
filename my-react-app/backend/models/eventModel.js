import db from "../config/db.js";
import Sequelize from "sequelize";

const Event = db.define("event", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

export const getNotificationsForUser = async (user_id) => {
  try {
    const sql = `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    const [notifications] = await db.query(sql, [user_id]);
    return notifications;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
};

export default Event;
