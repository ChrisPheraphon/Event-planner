import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEventsPage from "./pages/MyEventsPage";
import NotificationsPage from "./pages/NotificationsPage";
import EventDetailPage from "./pages/EventDetailPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./pages/Register";

function App() {
  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
