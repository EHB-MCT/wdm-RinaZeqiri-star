import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const entries = [];

function getZodiac(dateStr) {
  const d = new Date(dateStr);
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const signs = [
    ["Capricorn", 1, 19], ["Aquarius", 2, 18], ["Pisces", 3, 20],
    ["Aries", 4, 19], ["Taurus", 5, 20], ["Gemini", 6, 20],
    ["Cancer", 7, 22], ["Leo", 8, 22], ["Virgo", 9, 22],
    ["Libra", 10, 22], ["Scorpio", 11, 21], ["Sagittarius", 12, 21],
    ["Capricorn", 12, 31]
  ];
  for (let i = 0; i < signs.length; i++) {
    const [name, cm, cd] = signs[i];
    if ((m < cm) || (m === cm && day <= cd)) return name;
  }
  return "Capricorn";
}

app.post("/api/prompt", (req, res) => {
  const { name, birthday } = req.body;
  const sign = getZodiac(birthday);
  res.json({
    sign,
    text: `${sign}: een rustige dag, denk aan jezelf.`,
    questions: [
      "Hoe voel je je vandaag?",
      "Wat was het mooiste moment?",
      "Wat wil je morgen beter doen?"
    ]
  });
});

app.post("/api/save", (req, res) => {
  entries.push(req.body);
  res.json({ ok: true });
});

const PORT = 5174;
app.listen(PORT, () => console.log("Server running on port " + PORT));
