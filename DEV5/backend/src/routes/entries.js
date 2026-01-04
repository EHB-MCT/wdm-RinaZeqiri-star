import express from "express";
import { getZodiac } from "../utils/zodiac.js";
import DiaryEntry from "../models/DiaryEntry.js";
import { analyzeEntry } from "../utils/analyzeEntry.js";

const router = express.Router();

router.post("/prompt", (req, res) => {
	const { birthday } = req.body;

	if (!birthday) {
		return res.status(400).json({ error: "birthday required" });
	}

	const sign = getZodiac(birthday);

	res.json({
		sign,
		text: `${sign}: een rustige dag, denk aan jezelf.`,
		questions: ["Hoe voel je je vandaag?", "Wat was het mooiste moment?", "Wat wil je morgen beter doen?"],
	});
});

router.post("/save", async (req, res) => {
	try {
		const { userId, date, zodiacSign, promptText, answers } = req.body;

		if (!userId || !date || !zodiacSign || !promptText || !answers) {
			return res.status(400).json({ error: "Missing fields" });
		}

		const analysis = analyzeEntry(answers);

		const entry = new DiaryEntry({
			userId,
			date,
			zodiacSign,
			promptText,
			answers,
			analysis,
		});

		const savedEntry = await entry.save();
		res.status(201).json({ ok: true, entry: savedEntry });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const entries = await DiaryEntry.find({ userId }).sort({ createdAt: -1 });
		res.json(entries);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;
