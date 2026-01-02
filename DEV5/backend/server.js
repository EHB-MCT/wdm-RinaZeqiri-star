import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.js";
import entriesRoutes from "./src/routes/entries.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", entriesRoutes);


app.get("/", (req, res) => {
	res.json({ message: "Backend skeleton ready." });
});
console.log("SERVER JS LOADED ✅");

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
