import express from "express";
import { joinEvent, getJoinedEvents } from "../controllers/registrationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/join", authMiddleware, joinEvent); // ✅ API เข้าร่วมอีเวนต์
router.get("/my-events", authMiddleware, getJoinedEvents); // ✅ API ดึงอีเวนต์ที่เข้าร่วมแล้ว

export default router;
