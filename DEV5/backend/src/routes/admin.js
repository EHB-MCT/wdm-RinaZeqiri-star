import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import TrackingEvent from "../models/TrackingEvent.js";
import DiaryEntry from "../models/DiaryEntry.js";

const router = express.Router();

router.get("/users", async (req, res) => {
	try {
		const users = await User.find({}).select("_id email birthday createdAt").sort({ createdAt: -1 });

		res.json({ ok: true, users });
	} catch (error) {
		console.error("ADMIN /users error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/entries", async (req, res) => {
	try {
		const { userId, from, to, limit = "100", sentiment, emotion, topic } = req.query;

		const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

		const query = {};

		if (userId) query.userId = userId;

		if (from || to) {
			query.createdAt = {};
			if (from) {
				const fromDate = new Date(from);
				if (!isNaN(fromDate.getTime())) query.createdAt.$gte = fromDate;
			}
			if (to) {
				const toDate = new Date(to);
				if (!isNaN(toDate.getTime())) query.createdAt.$lte = toDate;
			}
		}

		if (sentiment) query["analysis.sentiment"] = sentiment;
		if (emotion) query["analysis.emotions"] = emotion; // werkt met array match
		if (topic) query["analysis.topics"] = topic; // werkt met array match

		const entries = await DiaryEntry.find(query).sort({ createdAt: -1 }).limit(parsedLimit);
		const count = await DiaryEntry.countDocuments(query);

		res.json({ ok: true, count, entries });
	} catch (error) {
		console.error("ADMIN /entries error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/events", async (req, res) => {
	try {
		const { userId, type, from, to, page, limit = "100" } = req.query;

		const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

		const query = {};

		if (userId) {
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				return res.status(400).json({ error: "Invalid userId" });
			}
			query.userId = userId;
		}

		if (type) query.type = type;
		if (page) query["meta.page"] = page;

		if (from || to) {
			query.createdAt = {};
			if (from) {
				const fromDate = new Date(from);
				if (!isNaN(fromDate.getTime())) query.createdAt.$gte = fromDate;
			}
			if (to) {
				const toDate = new Date(to);
				if (!isNaN(toDate.getTime())) query.createdAt.$lte = toDate;
			}
			if (Object.keys(query.createdAt).length === 0) delete query.createdAt;
		}

		const events = await TrackingEvent.find(query).sort({ createdAt: -1 }).limit(parsedLimit);

		const count = await TrackingEvent.countDocuments(query);

		res.json({ ok: true, count, events });
	} catch (error) {
		console.error("ADMIN /events error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/stats", async (req, res) => {
	try {
		const stats = await TrackingEvent.aggregate([
			{
				$group: {
					_id: null,
					totalEvents: { $sum: 1 },
					eventsByType: { $push: { type: "$type", count: 1 } },
					topPages: { $push: { page: { $ifNull: ["$meta.page", "unknown"] }, count: 1 } },
					eventsPerDay: {
						$push: {
							date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
							count: 1,
						},
					},
				},
			},
		]);

		const result = stats[0] || {
			totalEvents: 0,
			eventsByType: [],
			topPages: [],
			eventsPerDay: [],
		};

		const eventsByType = {};
		result.eventsByType.forEach((item) => {
			eventsByType[item.type] = (eventsByType[item.type] || 0) + 1;
		});

		const topPages = {};
		result.topPages.forEach((item) => {
			topPages[item.page] = (topPages[item.page] || 0) + 1;
		});

		const eventsPerDay = {};
		result.eventsPerDay.forEach((item) => {
			eventsPerDay[item.date] = (eventsPerDay[item.date] || 0) + 1;
		});

		res.json({
			ok: true,
			stats: {
				totalEvents: result.totalEvents,
				eventsByType,
				topPages: Object.entries(topPages)
					.map(([page, count]) => ({ page, count }))
					.sort((a, b) => b.count - a.count)
					.slice(0, 10),
				eventsPerDay: Object.entries(eventsPerDay)
					.map(([date, count]) => ({ date, count }))
					.sort((a, b) => a.date.localeCompare(b.date)),
			},
		});
	} catch (error) {
		console.error("ADMIN /stats error:", error);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
