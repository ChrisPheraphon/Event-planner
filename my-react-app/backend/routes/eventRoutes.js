import express from "express";
import { createEvent, getAllEvents, searchEvents, getEventById, getCreatedEvents, getJoinedEvents } from "../controllers/eventController.js";
import authenticateToken from "../middleware/authMiddleware.js"; // Import authenticateToken

const router = express.Router();

router.post("/create", authenticateToken, createEvent); // Use authenticateToken middleware
router.get("/", getAllEvents);
router.get("/search", searchEvents); // Add search route
router.get("/:id", getEventById); // Add route to get event details by ID
router.get("/created", authenticateToken, getCreatedEvents); // Add route to get events created by the user
router.get("/joined", authenticateToken, getJoinedEvents); // Add route to get events joined by the user

export default router;
