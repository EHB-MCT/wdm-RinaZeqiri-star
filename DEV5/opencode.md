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