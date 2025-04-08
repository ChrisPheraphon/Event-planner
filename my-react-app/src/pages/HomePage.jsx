import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchJoinedEvents();
    }
    // eslint-disable-next-line
  }, []);

  // 🔹 ดึงข้อมูลอีเวนต์ทั้งหมด
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  };

  // 🔹 ดึงอีเวนต์ที่ผู้ใช้เข้าร่วมแล้ว
  const fetchJoinedEvents = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:5000/api/registrations/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJoinedEvents(response.data.map((event) => event.event_id));
    } catch (error) {
      console.error("❌ Error fetching joined events:", error);
    }
  };

  // 🔹 ฟังก์ชันเข้าร่วมอีเวนต์
  const handleJoinEvent = async (event_id) => {
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนเข้าร่วมอีเวนต์");
      return;
    }

    try {
      console.log("📡 กำลังส่ง event_id:", event_id);
      const response = await axios.post(
        "http://localhost:5000/api/registrations/join",
        { event_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      setJoinedEvents([...joinedEvents, event_id]);
    } catch (error) {
      console.error("❌ Error joining event:", error.response?.data || error.message);
      alert(error.response?.data?.message || "❌ เกิดข้อผิดพลาด");
    }
  };

  // 🔹 ฟังก์ชันค้นหาอีเวนต์
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/events/search?query=${searchQuery}`);
      setEvents(response.data);
    } catch (error) {
      console.error("❌ Error searching events:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">📅 อีเวนต์ที่กำลังจะมีขึ้น</h2>

        {/* ฟอร์มค้นหาอีเวนต์ */}
        <form onSubmit={handleSearch} className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="ค้นหาอีเวนต์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            ค้นหา
          </button>
        </form>

        {/* แสดงอีเวนต์ */}
        {events.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            ไม่มีข้อมูล
          </div>
        ) : (
          <div className="row">
            {events.map((event) => (
              <div className="col-md-4" key={event.event_id}>
                <div className="card mb-4 shadow-sm">
                  {event.image_url ? (
                    <img src={event.image_url} className="card-img-top" alt={event.title} />
                  ) : (
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{ height: "200px" }}
                    >
                      ไม่มีรูปภาพ
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link
                        to={`/event/${event.event_id}`}
                        className="text-decoration-none text-dark"
                      >
                        {event.title}
                      </Link>
                    </h5>
                    <p className="card-text">{event.description}</p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>📆</strong> {event.event_date} <strong>⏰</strong> {event.event_time}
                    </li>
                    <li className="list-group-item">
                      <strong>📍</strong> {event.location}
                    </li>
                  </ul>
                  <div className="card-body">
                    {user ? (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleJoinEvent(event.event_id)}
                        disabled={joinedEvents.includes(event.event_id)}
                      >
                        {joinedEvents.includes(event.event_id)
                          ? "✅ เข้าร่วมแล้ว"
                          : "เข้าร่วมอีเวนต์"}
                      </button>
                    ) : (
                      <div className="alert alert-warning text-center mb-0" role="alert">
                        🔑 กรุณาเข้าสู่ระบบเพื่อเข้าร่วมอีเวนต์
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
