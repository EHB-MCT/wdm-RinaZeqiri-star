import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { getZodiac } from "../utils/zodiac.js";

console.log("AUTH ROUTES LOADED ✅");

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const { email, password, birthday } = req.body;

		if (!email || !password || !birthday) {
			return res.status(400).json({ error: "Missing fields" });
		}

		res.json({ message: "register step 1 ok" });
	} catch (err) {
		res.status(500).json({ error: "server error" });
	}
});

export default router;
