import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ เก็บ token และข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("✅ เข้าสู่ระบบสำเร็จ!");
        navigate("/"); // 🔄 กลับไปหน้าแรก
        window.location.reload(); // ✅ รีโหลดหน้าเพื่อให้ Navbar อัปเดต
      } else {
        alert(`❌ เข้าสู่ระบบไม่สำเร็จ: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">🔑 เข้าสู่ระบบ</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">
                      เข้าสู่ระบบ
                    </button>
                  </div>

                  <div className="text-center">
                    <Link to="/register" className="text-decoration-none">
                      📝 ยังไม่มีบัญชี? สมัครสมาชิก
                    </Link>
                    <br />
                    <Link to="/forgot-password" className="text-decoration-none">
                      🔓 ลืมรหัสผ่าน?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
