import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateEvent.css"; // <-- import ไฟล์ CSS ที่เราสร้าง
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "1", // Default category_id
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ เช็คว่า Login อยู่หรือไม่
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนสร้างอีเวนต์");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = "กรุณากรอกชื่ออีเวนต์";
    if (!formData.date) newErrors.date = "กรุณาเลือกวันที่";
    if (!formData.time) newErrors.time = "กรุณาเลือกเวลา";
    if (!formData.location.trim()) newErrors.location = "กรุณากรอกสถานที่";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmissionError("");
    setSubmissionSuccess("");

    const eventData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      eventData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token"); // ✅ ดึง Token จาก Local Storage
      const response = await axios.post("http://localhost:5000/api/events/create", eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Success:", response.data);
      setSubmissionSuccess(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(
        "❌ Error creating event:",
        error.response ? error.response.data : error.message
      );
      setSubmissionError(
        error.response
          ? error.response.data.error || error.response.data.message
          : error.message
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container create-event-container mt-5">
        <div className="card create-event-card shadow">
          <div className="card-body">
            <h2 className="card-title create-event-title mb-4">🎉 สร้างอีเวนต์ใหม่</h2>

            {/* แจ้งเตือนกรณีสร้างสำเร็จหรือเกิดข้อผิดพลาด */}
            {submissionSuccess && (
              <div className="alert alert-success" role="alert">
                {submissionSuccess}
              </div>
            )}
            {submissionError && (
              <div className="alert alert-danger" role="alert">
                {submissionError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ชื่ออีเวนต์ */}
              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">
                  ชื่ออีเวนต์ <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.eventName && "is-invalid"}`}
                  id="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                />
                {errors.eventName && (
                  <div className="invalid-feedback">{errors.eventName}</div>
                )}
              </div>

              {/* รายละเอียด */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  รายละเอียด
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* วันที่และเวลา */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="date" className="form-label">
                    วันที่ <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.date && "is-invalid"}`}
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <div className="invalid-feedback">{errors.date}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="time" className="form-label">
                    เวลา <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    className={`form-control ${errors.time && "is-invalid"}`}
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                  {errors.time && (
                    <div className="invalid-feedback">{errors.time}</div>
                  )}
                </div>
              </div>

              {/* สถานที่ */}
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  สถานที่ <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.location && "is-invalid"}`}
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>

              {/* ประเภทอีเวนต์ */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  ประเภทอีเวนต์
                </label>
                <select
                  className="form-select"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="1">ทั่วไป</option>
                  <option value="2">ดนตรี</option>
                  <option value="3">กีฬา</option>
                  <option value="4">การศึกษา</option>
                  <option value="5">ธุรกิจ</option>
                </select>
              </div>

              {/* อัปโหลดรูปภาพ */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  อัปโหลดรูปภาพ
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              {/* ปุ่มยกเลิกและสร้างอีเวนต์ */}
              <div className="d-flex justify-content-end gap-2">
                <Link to="/" className="btn btn-secondary">
                  ยกเลิก
                </Link>
                <button type="submit" className="btn btn-success">
                  สร้างอีเวนต์
                </button>
                {/* 
                  ถ้าอยากให้ปุ่มยกเลิกเป็นสีแดงแทน สามารถใช้ className="btn-cancel" 
                  ที่เราสร้างใน CreateEvent.css แทนได้ เช่น 
                  <Link to="/" className="btn btn-cancel">ยกเลิก</Link>
                */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
