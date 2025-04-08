import db from "../config/db.js";

// 🔹 ฟังก์ชันลงทะเบียนผู้ใช้เข้าร่วมกิจกรรม
export const registerUserForEvent = async (user_id, event_id, status = "pending") => {
  try {
    const sql = "INSERT INTO registrations (user_id, event_id, status, registered_at) VALUES (?, ?, ?, NOW())";
    const [result] = await db.promise().query(sql, [user_id, event_id, status]);
    return { success: true, registrationId: result.insertId };
  } catch (err) {
    console.error("Error registering user for event:", err);
    return { success: false, error: err.message };
  }
};

// 🔹 ฟังก์ชันตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือยัง
export const checkUserRegistration = async (user_id, event_id) => {
  try {
    const sql = "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?";
    const [result] = await db.promise().query(sql, [user_id, event_id]);
    return result.length > 0; // ถ้าพบข้อมูล = ลงทะเบียนแล้ว
  } catch (err) {
    console.error("Error checking registration:", err);
    return false;
  }
};

// 🔹 ฟังก์ชันดึงข้อมูลการลงทะเบียนทั้งหมด
export const getAllRegistrations = async () => {
  try {
    const sql = "SELECT * FROM registrations";
    const [result] = await db.promise().query(sql);
    return result;
  } catch (err) {
    console.error("Error fetching registrations:", err);
    return [];
  }
};

// 🔹 ฟังก์ชันดึงข้อมูลการลงทะเบียนของผู้ใช้รายบุคคล
export const getUserRegistrations = async (user_id) => {
  try {
    const sql = `
      SELECT r.registration_id, r.event_id, e.title, e.event_date, r.status, r.registered_at
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?`;
    const [result] = await db.promise().query(sql, [user_id]);
    return result;
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    return [];
  }
};

// 🔹 ฟังก์ชันอัปเดตสถานะการลงทะเบียน
export const updateRegistrationStatus = async (registration_id, status) => {
  try {
    const sql = "UPDATE registrations SET status = ? WHERE registration_id = ?";
    const [result] = await db.promise().query(sql, [status, registration_id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error updating registration status:", err);
    return false;
  }
};

// 🔹 ฟังก์ชันลบการลงทะเบียน
export const deleteRegistration = async (registration_id) => {
  try {
    const sql = "DELETE FROM registrations WHERE registration_id = ?";
    const [result] = await db.promise().query(sql, [registration_id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error deleting registration:", err);
    return false;
  }
};
