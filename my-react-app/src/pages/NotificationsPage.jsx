import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NotificationsPage = () => {
  // ตัวอย่างข้อมูลการแจ้งเตือน
  const [notifications, setNotifications] = useState([
    { id: 1, message: "คุณมีอีเวนต์ 'สัมมนา AI' ในอีก 2 วัน", date: "2024-04-08" },
    { id: 2, message: "อีเวนต์ 'Workshop ReactJS' กำลังจะเริ่มใน 1 ชั่วโมง", date: "2024-05-05" },
    { id: 3, message: "Tech Conference 2024 ได้อัปเดตรายละเอียดใหม่", date: "2024-06-15" },
  ]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">🔔 การแจ้งเตือนของคุณ</h1>

      {notifications.length > 0 ? (
        <ul className="list-group mt-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="list-group-item">
              <strong>{notification.date}:</strong> {notification.message}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted mt-4">ยังไม่มีการแจ้งเตือน</p>
      )}

      <div className="text-center mt-4">
        <a href="/" className="btn btn-primary">🔙 กลับไปหน้าหลัก</a>
      </div>
    </div>
  );
};

export default NotificationsPage;
