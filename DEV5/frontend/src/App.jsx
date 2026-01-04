import { useState } from "react";
import { getDiaryPrompt, saveDiaryEntry, sendEvent } from "./api/api.js";

export default function App() {
	const [step, setStep] = useState("birthday");
	const [birthday, setBirthday] = useState("");
	const [prompt, setPrompt] = useState(null);
	const [answers, setAnswers] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const DEV_USER_ID = "65a1b2c3d4e5f67890123456";

	async function handleBirthdaySubmit(e) {
		e.preventDefault();
		if (!birthday) return;

		setLoading(true);
		setError(null);

		try {
			await sendEvent({
				userId: DEV_USER_ID,
				type: "FORM_SUBMIT",
				meta: { form: "birthday", page: "birthday" },
			});

			const promptData = await getDiaryPrompt(birthday);
			setPrompt(promptData);

			const initialAnswers = {};
			promptData.questions.forEach((_, index) => {
				initialAnswers[index] = "";
			});
			setAnswers(initialAnswers);

			setStep("questions");
		} catch (err) {
			setError("Failed to get diary prompt. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	function handleAnswerChange(index, value) {
		setAnswers((prev) => ({ ...prev, [index]: value }));
	}

	async function handleSave(e) {
		e.preventDefault();
		if (!prompt) return;

		setLoading(true);
		setError(null);

		try {
			await sendEvent({
				userId: DEV_USER_ID,
				type: "FORM_SUBMIT",
				meta: { form: "save_entry", page: "questions" },
			});

			await saveDiaryEntry({
				userId: DEV_USER_ID,
				date: new Date().toISOString(),
				zodiacSign: prompt.sign,
				promptText: prompt.text,
				answers,
			});

			setStep("saved");
		} catch (err) {
			setError("Failed to save entry. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	function handleReset() {
		setStep("birthday");
		setBirthday("");
		setPrompt(null);
		setAnswers({});
		setError(null);
		setLoading(false);
	}

	if (step === "birthday") {
		return (
			<div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
				<h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#ffc7c7ff" }}>Astro Diary</h1>

				<form onSubmit={handleBirthdaySubmit}>
					<div style={{ marginBottom: "1rem" }}>
						<label htmlFor="birthday" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
							Your Birthday:
						</label>
						<input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem" }} />
					</div>

					{error && <div style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "4px" }}>{error}</div>}

					<button
						type="submit"
						disabled={loading || !birthday}
						style={{ width: "100%", padding: "0.75rem", backgroundColor: loading ? "#ccc" : "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
					>
						{loading ? "Loading..." : "Get My Daily Prompt"}
					</button>
				</form>
			</div>
		);
	}

	if (step === "questions") {
		return (
			<div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
				<div style={{ marginBottom: "2rem", textAlign: "center" }}>
					<h2 style={{ color: "#333", marginBottom: "1rem" }}>
						{prompt.sign} • {new Date().toLocaleDateString()}
					</h2>
					<p style={{ fontSize: "1.1rem", lineHeight: "1.5", color: "#666", fontStyle: "italic" }}>{prompt.text}</p>
				</div>

				<form onSubmit={handleSave}>
					{prompt.questions.map((question, index) => (
						<div key={index} style={{ marginBottom: "1.5rem" }}>
							<label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#333" }}>{question}</label>
							<textarea
								value={answers[index] || ""}
								onChange={(e) => handleAnswerChange(index, e.target.value)}
								required
								style={{ width: "100%", minHeight: "100px", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem", resize: "vertical", fontFamily: "inherit" }}
							/>
						</div>
					))}

					{error && <div style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "4px" }}>{error}</div>}

					<button
						type="submit"
						disabled={loading}
						style={{ width: "100%", padding: "0.75rem", backgroundColor: loading ? "#ccc" : "#28a745", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
					>
						{loading ? "Saving..." : "Save My Entry"}
					</button>
				</form>
			</div>
		);
	}

	if (step === "saved") {
		return (
			<div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
				<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
				<h2 style={{ color: "#28a745", marginBottom: "1rem" }}>Entry Saved!</h2>
				<p style={{ color: "#666", marginBottom: "2rem", lineHeight: "1.5" }}>Your diary entry has been saved successfully.</p>
				<button onClick={handleReset} style={{ padding: "0.75rem 2rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}>
					Write Another Entry
				</button>
			</div>
		);
	}

	return null;
}
