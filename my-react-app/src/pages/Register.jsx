import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "", // ✅ เปลี่ยนจาก username เป็น full_name
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name, // ✅ ใช้ full_name แทน username
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ สมัครสมาชิกสำเร็จ!");
        navigate("/login");
      } else {
        alert(`❌ สมัครสมาชิกไม่สำเร็จ: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการสมัครสมาชิก");
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
                <h2 className="card-title text-center mb-4">📝 สมัครสมาชิก</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      ยืนยันรหัสผ่าน
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-success">
                      สมัครสมาชิก
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-muted">มีบัญชีแล้ว? </span>
                    <Link to="/login" className="text-decoration-none">
                      🔑 เข้าสู่ระบบ
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

export default Register;
