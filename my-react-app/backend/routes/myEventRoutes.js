import express from 'express';
import { getCreatedEvents, getJoinedEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get('/created', getCreatedEvents);
router.get('/joined', getJoinedEvents);

export default router;
