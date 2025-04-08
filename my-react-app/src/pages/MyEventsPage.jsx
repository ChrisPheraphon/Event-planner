import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MyEventsPage = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCreatedEvents();
    fetchJoinedEvents();
  }, []);

  const fetchCreatedEvents = async () => {
    try {
      console.log("Fetching created events...");
      const response = await axios.get("http://localhost:5000/api/events/created", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Created events:", response.data);
      setCreatedEvents(response.data);
    } catch (error) {
      console.error("❌ Error fetching created events:", error);
    }
  };

  const fetchJoinedEvents = async () => {
    try {
      console.log("Fetching joined events...");
      const response = await axios.get("http://localhost:5000/api/events/joined", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Joined events:", response.data);
      setJoinedEvents(response.data);
    } catch (error) {
      console.error("❌ Error fetching joined events:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">📅 อีเวนต์ของฉัน</h1>

      {createdEvents.length > 0 ? (
        <div className="row">
          {createdEvents.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card p-3 shadow">
                <h3>{event.title}</h3>
                <p><strong>วันที่:</strong> {event.event_date}</p>
                <p><strong>สถานที่:</strong> {event.location}</p>
                <a href={`/events/${event.id}`} className="btn btn-primary">
                  ดูรายละเอียด
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">ยังไม่มีอีเวนต์ที่คุณสร้าง</p>
      )}

      <div className="text-center mt-4">
        <a href="/create-event" className="btn btn-success">➕ สร้างอีเวนต์ใหม่</a>
      </div>

      <h2 className="text-center mt-5">📅 อีเวนต์ที่ฉันเข้าร่วม</h2>

      {joinedEvents.length > 0 ? (
        <div className="row">
          {joinedEvents.map((event) => (
            <div key={event.event_id} className="col-md-4 mb-4">
              <div className="card p-3 shadow">
                <h3>{event.title}</h3>
                <p><strong>วันที่:</strong> {event.event_date}</p>
                <p><strong>สถานที่:</strong> {event.location}</p>
                <a href={`/events/${event.event_id}`} className="btn btn-primary">
                  ดูรายละเอียด
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">ยังไม่มีอีเวนต์ที่คุณเข้าร่วม</p>
      )}
    </div>
  );
};

export default MyEventsPage;
