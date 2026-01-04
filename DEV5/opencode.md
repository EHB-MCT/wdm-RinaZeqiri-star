# Astrology Diary Webapp - Code Reference

## Backend API Documentation

### Diary Entries Backend

The diary entries backend provides a RESTful API for managing astrology-based diary entries with MongoDB integration. The system allows users to generate personalized zodiac prompts and save their diary responses.

#### Routes Overview

The diary entries are served under the `/entries` base path in `backend/server.js:24`:

```javascript
app.use("/entries", entriesRoutes);
```

#### API Endpoints

##### POST /entries/prompt
**Purpose**: Generate zodiac-based diary prompts based on user's birthday

**Request Body**:
```json
{
  "birthday": "YYYY-MM-DD"
}
```

**Response**:
```json
{
  "sign": "Leo",
  "text": "Leo: een rustige dag, denk aan jezelf.",
  "questions": [
    "Hoe voel je je vandaag?",
    "Wat was het mooiste moment?",
    "Wat wil je morgen beter doen?"
  ]
}
```

**Implementation**: `backend/src/routes/entries.js:7-21`
- Validates birthday parameter
- Uses `getZodiac()` utility to determine zodiac sign
- Returns personalized prompt with reflection questions

##### POST /entries/save
**Purpose**: Save a complete diary entry to MongoDB

**Request Body**:
```json
{
  "userId": "ObjectId",
  "date": "YYYY-MM-DD",
  "zodiacSign": "Leo",
  "promptText": "Leo: een rustige dag, denk aan jezelf.",
  "answers": {
    "question1": "Antwoord 1",
    "question2": "Antwoord 2",
    "question3": "Antwoord 3"
  }
}
```

**Response** (201 Created):
```json
{
  "ok": true,
  "entry": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "date": "YYYY-MM-DD",
    "zodiacSign": "Leo",
    "promptText": "Leo: een rustige dag, denk aan jezelf.",
    "answers": { ... },
    "createdAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "__v": 0
  }
}
```

**Implementation**: `backend/src/routes/entries.js:23-44`
- Validates all required fields (userId, date, zodiacSign, promptText, answers)
- Returns 400 status with "Missing fields" error if validation fails
- Creates new DiaryEntry instance and saves to MongoDB
- Returns 201 status with saved entry data

##### GET /entries/:userId
**Purpose**: Retrieve all diary entries for a specific user

**URL Parameters**:
- `userId`: ObjectId of the user

**Response**:
```json
[
  {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "date": "YYYY-MM-DD",
    "zodiacSign": "Leo",
    "promptText": "Leo: een rustige dag, denk aan jezelf.",
    "answers": { ... },
    "createdAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "__v": 0
  }
]
```

**Implementation**: `backend/src/routes/entries.js:46-54`
- Queries MongoDB for entries matching userId
- Sorts results by `createdAt: -1` (newest first)
- Returns array of entries or empty array if none found

#### Data Flow

1. **Prompt Generation**: User provides birthday → `/entries/prompt` → Zodiac sign determined → Personalized prompt generated
2. **Entry Saving**: User completes prompt → `/entries/save` → Validation → MongoDB storage → Confirmation response
3. **Entry Retrieval**: User requests history → `/entries/:userId` → Database query → Sorted entries returned

#### MongoDB Integration

**Connection**: `backend/server.js:14-17`
```javascript
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));
```

**Model**: `backend/src/models/DiaryEntry.js`
- Schema includes userId, date, zodiacSign, promptText, answers
- Automatic timestamps (createdAt, updatedAt)
- userId references User model

#### Error Handling

- **400 Bad Request**: Missing required fields or invalid birthday
- **500 Server Error**: Database connection or operation failures
- **201 Created**: Successful entry creation
- **200 OK**: Successful data retrieval

#### Development Notes

- Uses ES modules (import/export syntax)
- Async/await pattern for database operations
- Express.js framework with CORS enabled
- Environment variable `MONGO_URI` required for database connection
- Docker-ready with MongoDB service integration

#### Testing Endpoints

```bash
# Generate prompt
curl -X POST http://localhost:3000/entries/prompt \
  -H "Content-Type: application/json" \
  -d '{"birthday": "1995-08-15"}'

# Save entry
curl -X POST http://localhost:3000/entries/save \
  -H "Content-Type: application/json" \
  -d '{"userId": "507f1f77bcf86cd799439011", "date": "2024-01-15", "zodiacSign": "Leo", "promptText": "Leo: een rustige dag, denk aan jezelf.", "answers": {"q1": "Goed", "q2": "Lunch met vrienden", "q3": "Meer tijd voor mezelf"}}'

# Get user entries
curl -X GET http://localhost:3000/entries/507f1f77bcf86cd799439011
```

### Text Analysis Utility

**Location**: `backend/src/utils/analyzeEntry.js`

**Purpose**: Lexicon-based text analysis for diary entries that extracts insights from free text answers using predefined word lists (lexicons).

#### Analysis Categories

The utility analyzes text across four main categories:

1. **Sentiment**: Positive vs negative sentiment detection
2. **Emotions**: Specific emotional states (happy, sad, anxious, angry, calm)
3. **Relations**: People mentioned (mother, father, sibling, partner)
4. **Topics**: Subject areas discussed (school, work, health, love, family)

#### Core Functions

**normalize(text)**: `backend/src/utils/analyzeEntry.js:72-78`
- Converts text to lowercase
- Removes punctuation using Unicode regex
- Trims extra spaces
- Preserves Unicode letters and numbers

**countMatches(text, words)**: `backend/src/utils/analyzeEntry.js:81-86`
- Counts exact word matches from lexicon lists
- Uses simple string comparison (no fuzzy matching)
- Returns total frequency count

**extractPeople(textRaw)**: `backend/src/utils/analyzeEntry.js:89-124`
- Detects relation + name patterns (e.g., "mama Sara")
- Handles relation-only mentions (e.g., "mama")
- Prevents duplicate entries
- Returns array of {type, name} objects

#### Main Function

**analyzeEntry(answers)**: `backend/src/utils/analyzeEntry.js:127-172`

**Input**: String or object with multiple answers
```javascript
// String input
analyzeEntry("Vandaag was ik heel blij met school")

// Object input  
analyzeEntry({
  q1: "Vandaag was ik heel blij",
  q2: "Mama Sara was blij met school"
})
```

**Output**: Analysis results object
```javascript
{
  sentiment: "positive",           // 'positive' | 'negative' | 'neutral'
  sentimentScore: 2,               // positiveCount - negativeCount
  emotions: ["happy"],            // Array of detected emotions (sorted)
  topics: ["school"],             // Array of detected topics (sorted)
  peopleMentioned: [              // Array of people with relations
    { type: "mother", name: "Sara" }
  ]
}
```

#### Lexicon Structure

**Sentiment Lexicon**: `backend/src/utils/analyzeEntry.js:5-17`
- **Positive**: 28 words (gelukkig, blij, fijn, geweldig, etc.)
- **Negative**: 18 words (verdrietig, slecht, erg, vreselijk, etc.)

**Emotions Lexicon**: `backend/src/utils/analyzeEntry.js:19-39`
- **Happy**: 14 words (blij, gelukkig, vrolijk, etc.)
- **Sad**: 13 words (verdrietig, neerslachtig, somber, etc.)
- **Anxious**: 14 words (angstig, zenuwachtig, gespannen, etc.)
- **Angry**: 14 words (boos, kwaad, geïrriteerd, etc.)
- **Calm**: 14 words (kalm, rustig, ontspannen, etc.)

**Relations Lexicon**: `backend/src/utils/analyzeEntry.js:41-45`
- **Mother**: mama, moeder, mam, moe
- **Father**: papa, vader, pa, vad
- **Sibling**: broer, zus, zuster, broertje, zusje
- **Partner**: vriend, vriendin, partner, lief, liefje, schatje

**Topics Lexicon**: `backend/src/utils/analyzeEntry.js:47-67`
- **School**: 15 words (school, studie, les, examen, etc.)
- **Work**: 15 words (werk, baan, collega, kantoor, etc.)
- **Health**: 14 words (gezondheid, ziek, dokter, etc.)
- **Love**: 13 words (liefde, verliefd, relatie, etc.)
- **Family**: 15 words (familie, ouders, kinderen, etc.)

#### Integration Example

**Usage in diary entry processing**:
```javascript
import { analyzeEntry } from '../utils/analyzeEntry.js';

// In POST /entries/save route
const { answers } = req.body;
const analysis = analyzeEntry(answers);

// Save analysis with entry
const entry = new DiaryEntry({
  userId,
  date,
  zodiacSign,
  promptText,
  answers,
  analysis  // Add analysis results to database
});
```

#### Technical Details

- **Language**: Dutch word lists with Unicode support
- **Dependencies**: Pure JavaScript (no external libraries)
- **Performance**: Simple string matching, suitable for small texts
- **Unicode**: Uses `\p{L}` regex for international characters
- **ES Modules**: Import/export syntax throughout

#### Testing Examples

```javascript
import { analyzeEntry } from './src/utils/analyzeEntry.js';

// Test sentiment analysis
const result1 = analyzeEntry("Vandaag was ik heel gelukkig en blij");
// Returns: { sentiment: "positive", sentimentScore: 2, emotions: ["happy"], topics: [], peopleMentioned: [] }

// Test people extraction
const result2 = analyzeEntry("Mama Sara was blij met school");
// Returns: { sentiment: "positive", emotions: ["happy"], topics: ["school"], peopleMentioned: [{type: "mother", name: "Sara"}] }

// Test complex analysis
const result3 = analyzeEntry({
  q1: "Ik was verdrietig over werk",
  q2: "Papa zei dat het goed komt"
});
// Returns appropriate mixed sentiment with work topic and father relation
```