import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // ✅ ดึงข้อมูลผู้ใช้จาก Local Storage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("👋 ออกจากระบบเรียบร้อย!");
    navigate("/login");
    setTimeout(() => window.location.reload(), 500); // ✅ รีโหลดหน้าให้ Navbar อัปเดต
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link to="/my-events" className="navbar-brand"> {/* Changed from "/" to "/my-events" */}
          🚀 Event Manager
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="d-flex gap-2">
            {user && ( // ✅ แสดงปุ่ม Create Event เฉพาะตอนล็อกอิน
              <Link to="/create-event" className="btn btn-success">
                ➕ Create Event
              </Link>
            )}

            {user ? (
              <>
                <span className="navbar-text me-3">👋 สวัสดี, {user.full_name}</span>
                <Link to="/my-events" className="btn btn-info">
                  📅 My Events
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary">📝 Register</Link>
                <Link to="/login" className="btn btn-primary">🔑 Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
