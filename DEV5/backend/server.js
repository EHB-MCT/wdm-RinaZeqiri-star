import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import entriesRoutes from "./src/routes/entries.js";
import mongoose from "mongoose";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected ✅"))
	.catch((err) => console.error("MongoDB error ❌", err));

app.get("/health", (req, res) => {
	res.json({ ok: true, message: "Backend is running" });
});

app.use("/auth", authRoutes);
app.use("/entries", entriesRoutes);

app.get("/", (req, res) => {
	res.json({ message: "Backend skeleton ready." });
});

console.log("SERVER JS LOADED ✅");

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
