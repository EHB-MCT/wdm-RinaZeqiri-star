const API_URL = "http://localhost:3000";

export async function getDiaryPrompt(birthday) {
	const res = await fetch(`${API_URL}/entries/prompt`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ birthday }),
	});

	if (!res.ok) {
		throw new Error("Failed to get diary prompt");
	}

	return res.json();
}

export async function saveDiaryEntry(data) {
	const res = await fetch(`${API_URL}/entries/save`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to save diary entry");
	}

	return res.json();
}

export async function sendEvent({ userId, type, meta = {} }) {
	const res = await fetch(`${API_URL}/events`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId,
			type,
			meta,
		}),
	});

	if (!res.ok) {
		console.warn("Tracking event failed");
		return null;
	}

	return res.json();
}
