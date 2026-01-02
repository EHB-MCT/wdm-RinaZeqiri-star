import express from "express";
import { getZodiac } from "../utils/zodiac.js";

const router = express.Router();

const entries = [];

router.post("/prompt", (req, res) => {
	const { birthday } = req.body;

	if (!birthday) {
		return res.status(400).json({ error: "birthday required" });
	}

	const sign = getZodiac(birthday);

	res.json({
		sign,
		text: `${sign}: een rustige dag, denk aan jezelf.`,
		questions: [
			"Hoe voel je je vandaag?",
			"Wat was het mooiste moment?",
			"Wat wil je morgen beter doen?",
		],
	});
});

router.post("/save", (req, res) => {
	entries.push(req.body);
	res.json({ ok: true });
});

export default router;
