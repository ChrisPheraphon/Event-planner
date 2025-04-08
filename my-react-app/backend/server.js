import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
dotenv.config();
import registrationRoutes from "./routes/registrationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import myEventRoutes from "./routes/myEventRoutes.js"; // Import the new MyEventRoutes
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/my-events", myEventRoutes); // Use the new MyEventRoutes

// ตรวจสอบการเชื่อมต่อ MySQL
db.query("SELECT 1")
  .then(() => {
    console.log("✅ Connected to MySQL Database!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err);
    process.exit(1);
  });

export default app;
