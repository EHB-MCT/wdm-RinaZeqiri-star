import { useState } from "react";

export default function App() {
  const [step, setStep] = useState("login");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [prompt, setPrompt] = useState(null);
  const [answers, setAnswers] = useState(["", "", ""]);

  async function start() {
    const res = await fetch("http://localhost:5174/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthday }),
    });
    const data = await res.json();
    setPrompt(data);
    setStep("questions");
  }

  async function save() {
    await fetch("http://localhost:5174/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthday, answers }),
    });
    setStep("done");
  }

  if (step === "login")
    return (
      <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
        <h1>Astro Dagboek</h1>
        <input
          placeholder="Naam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button onClick={start}>Ga verder</button>
      </div>
    );

  if (step === "questions")
    return (
      <div style={{ padding: 30, maxWidth: 500, margin: "auto" }}>
        <h2>{prompt.sign}</h2>
        <p>{prompt.text}</p>

        {prompt.questions.map((q, i) => (
          <div key={i} style={{ marginTop: 15 }}>
            <p>{q}</p>
            <textarea
              value={answers[i]}
              onChange={(e) => {
                const copy = [...answers];
                copy[i] = e.target.value;
                setAnswers(copy);
              }}
              style={{ width: "100%", height: 60 }}
            />
          </div>
        ))}

        <button onClick={save} style={{ marginTop: 20 }}>
          Opslaan
        </button>
      </div>
    );

  if (step === "done")
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <h2>Bedankt!</h2>
        <p>Je antwoorden zijn opgeslagen (in het geheugen van de server).</p>
        <button onClick={() => setStep("login")}>Nieuwe dag</button>
      </div>
    );
}
