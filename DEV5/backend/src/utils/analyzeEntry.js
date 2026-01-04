const lexicons = {
	sentiment: {
		positive: [
			"gelukkig",
			"blij",
			"fijn",
			"geweldig",
			"prachtig",
			"mooi",
			"leuk",
			"fantastisch",
			"perfect",
			"uitstekend",
			"super",
			"geweldig",
			"heerlijk",
			"plezier",
			"vreugde",
			"tevreden",
			"trots",
			"succes",
			"lachen",
			"lief",
			"liefde",
			"warm",
			"zonnig",
			"bright",
			"positief",
			"optimistisch",
			"hoop",
			"rustig",
			"kalm",
			"ontspannen",
		],
		negative: [
			"verdrietig",
			"slecht",
			"erg",
			"vreselijk",
			"moeilijk",
			"probleem",
			"stress",
			"angst",
			"boos",
			"kwaad",
			"geïrriteerd",
			"frustratie",
			"teleurgesteld",
			"pijn",
			"verdriet",
			"tranen",
			"eenzaam",
			"alleen",
			"verloren",
			"mislukt",
			"fout",
			"sombere",
			"neerslachtig",
			"depressief",
			"zwaar",
			"vermoeid",
			"uitgeput",
		],
	},
	emotions: {
		happy: ["blij", "gelukkig", "vrolijk", "euforisch", "opgewekt", "juichend", "stralend", "enthousiast", "blijdschap", "vreugde", "geluk", "plezier", "grappig", "lachen"],
		sad: ["verdrietig", "neerslachtig", "somber", "bedroefd", "huilend", "tranen", "pijn", "leed", "ellende", "hartzeer", "verlies", "gemis", "melancholisch", "droevig"],
		anxious: ["angstig", "zenuwachtig", "gespannen", "onrustig", "bezorgd", "paniek", "stress", "gejaagd", "nerveus", "ongerust", "angst", "vrees", "spanning", "hyperventileren"],
		angry: ["boos", "kwaad", "geïrriteerd", "woedend", "razend", "furieus", "verbitterd", "frustratie", "ergernis", "woede", "razernij", "agressief", "vijandig", "kwaad"],
		calm: ["kalm", "rustig", "ontspannen", "vredig", "serene", "gelaten", "bedaard", "stille", "vredig", "rust", "balans", "harmonie", "zen", "meditatief", "rustig"],
	},
	relations: {
		mother: ["mama", "moeder", "mam", "moe"],
		father: ["papa", "vader", "pa", "vad"],
		sibling: ["broer", "zus", "zuster", "broertje", "zusje"],
		partner: ["vriend", "vriendin", "partner", "lief", "liefje", "schatje"],
	},
	topics: {
		school: ["school", "studie", "les", "examen", "cijfer", "toets", "klas", "leraar", "docent", "leslokaal", "huiswerk", "opdracht", "project", "diploma", "afstuderen"],
		work: ["werk", "baan", "collega", "kantoor", "project", "manager", "baas", "salaris", "carrière", "sollicitatie", "meeting", "deadline", "overwerk", "vrijdag", "weekend"],
		health: ["gezondheid", "ziek", "dokter", "ziekenhuis", "medicijn", "ziekte", "pijn", "therapie", "specialist", "consult", "behandeling", "herstel", "sport", "fitness"],
		love: ["liefde", "verliefd", "relatie", "hart", "romantisch", "kus", "knuffel", "date", "afspraakje", "passie", "intiem", "samenzijn", "connectie", "binding"],
		family: ["familie", "ouders", "kinderen", "huis", "thuis", "gezin", "broer", "zus", "opa", "oma", "oom", "tante", "neef", "nicht", "familie", "reünie", "feest"],
	},
};

function normalize(text) {
	return text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s]/gu, "")
		.replace(/\s+/g, " ")
		.trim();
}

function countMatches(text, words) {
	const normalizedWords = normalize(text)
		.split(" ")
		.filter((word) => word.length > 0);
	return words.reduce((count, word) => {
		return count + normalizedWords.filter((w) => w === word).length;
	}, 0);
}
function extractPeople(textRaw) {
	const people = [];
	const text = (textRaw || "").trim();

	const relationTypes = Object.keys(lexicons.relations);

	for (const relation of relationTypes) {
		const relationWords = lexicons.relations[relation];

		for (const relWord of relationWords) {
			const regexName = new RegExp(`\\b(?:mijn\\s+)?${relWord}\\b(?:\\s*[,:(-]?\\s*(?:heet|is|=)?\\s*)?([A-Z][\\p{L}]{1,})\\b`, "gu");

			const matches = [...text.matchAll(regexName)];

			for (const m of matches) {
				const name = m[1];
				if (name && !people.some((p) => p.type === relation && p.name === name)) {
					people.push({ type: relation, name });
				}
			}

			const relRegex = new RegExp(`\\b${relWord}\\b`, "iu");
			const hasRelWord = relRegex.test(text);

			const alreadyHasNull = people.some((p) => p.type === relation && p.name === null);
			const alreadyHasName = people.some((p) => p.type === relation && p.name !== null);

			if (hasRelWord && !alreadyHasName && !alreadyHasNull) {
				people.push({ type: relation, name: null });
			}
		}
	}

	const cleaned = people.filter((p) => {
		if (p.name !== null) return true;
		return !people.some((x) => x.type === p.type && x.name !== null);
	});

	return cleaned;
}

export function analyzeEntry(answers) {
	const combinedText = typeof answers === "string" ? answers : Object.values(answers).join(" ");

	const normalizedText = normalize(combinedText);

	const positiveCount = countMatches(normalizedText, lexicons.sentiment.positive);
	const negativeCount = countMatches(normalizedText, lexicons.sentiment.negative);
	const sentimentScore = positiveCount - negativeCount;
	const sentiment = sentimentScore > 0 ? "positive" : sentimentScore < 0 ? "negative" : "neutral";

	const emotions = Object.entries(lexicons.emotions)
		.map(([emotion, words]) => ({
			emotion,
			score: countMatches(normalizedText, words),
		}))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((item) => item.emotion);

	const topics = Object.entries(lexicons.topics)
		.map(([topic, words]) => ({
			topic,
			score: countMatches(normalizedText, words),
		}))
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.map((item) => item.topic);

	const peopleMentioned = extractPeople(combinedText);

	return {
		sentiment,
		sentimentScore,
		emotions,
		topics,
		peopleMentioned,
	};
}
