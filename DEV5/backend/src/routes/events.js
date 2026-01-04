import express from "express";
import TrackingEvent from "../models/TrackingEvent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, type, meta } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: "type required" });
    }
    
    const event = new TrackingEvent({
      userId: userId || undefined,
      type,
      meta: meta || undefined,
    });
    
    const savedEvent = await event.save();
    res.status(201).json({ ok: true, event: savedEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await TrackingEvent.find({ userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;