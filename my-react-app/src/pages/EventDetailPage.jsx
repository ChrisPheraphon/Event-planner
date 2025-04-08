import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("❌ Error fetching event:", error);
        setError("Failed to fetch event details");
      }
    };

    fetchEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนเข้าร่วมอีเวนต์");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/registrations/join",
        { event_id: id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("❌ Error joining event:", error.response?.data || error.message);
      alert(error.response?.data?.message || "❌ เกิดข้อผิดพลาด");
    }
  };

  if (error) {
    return <div className="text-center mt-5 text-danger fw-bold">❌ {error}</div>;
  }

  if (!event) {
    return <div className="text-center mt-5">⏳ กำลังโหลดข้อมูล...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg">
              {event.image_url ? (
                <img src={event.image_url} className="card-img-top" alt={event.title} />
              ) : (
                <div className="text-center p-4 bg-light">ไม่มีรูปภาพ</div>
              )}
              <div className="card-body">
                <h2 className="card-title">{event.title}</h2>
                <p className="card-text">{event.description}</p>
                <p className="fw-bold">📅 วันที่: {new Date(event.event_date).toLocaleDateString()}</p>
                <p className="fw-bold">⏰ เวลา: {event.event_time}</p>
                <p className="fw-bold">📍 สถานที่: {event.location}</p>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleJoinEvent}>
                    เข้าร่วมอีเวนต์
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate("/")}>
                    🔙 กลับหน้าแรก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
