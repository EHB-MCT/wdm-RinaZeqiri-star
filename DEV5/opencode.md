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

### User Action Tracking System

**Purpose**: Track user interactions (clicks, page views, form submissions, errors) for analytics and debugging.

#### Model: TrackingEvent

**Location**: `backend/src/models/TrackingEvent.js`

**Schema Structure**:
```javascript
const trackingEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for non-logged-in users
  },
  type: {
    type: String,
    required: true,
    enum: ["PAGE_VIEW", "CLICK", "FORM_SUBMIT", "API_ERROR", "NAVIGATION", "SEARCH"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    required: false, // Free-form extra data
  },
}, { timestamps: true });
```

**Fields**:
- `userId`: ObjectId (optional, for logged-in users)
- `type`: Event type (required, enum validation)
- `timestamp`: Event timestamp (auto-generated)
- `meta`: Free-form object for additional data

#### Routes: Events API

**Location**: `backend/src/routes/events.js`

**Base Path**: `/events` (mounted in `backend/server.js:25`)

##### POST /events
**Purpose**: Create a new tracking event

**Request Body**:
```json
{
  "userId": "ObjectId",           // Optional
  "type": "PAGE_VIEW",           // Required
  "meta": {                      // Optional
    "page": "/diary",
    "referrer": "/login",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response** (201 Created):
```json
{
  "ok": true,
  "event": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "type": "PAGE_VIEW",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "meta": { "page": "/diary" },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Implementation**: `backend/src/routes/events.js:5-22`
- Validates `type` field (required)
- Handles optional `userId` and `meta`
- Returns 400 for missing type
- Returns 500 for server errors

##### GET /events/:userId
**Purpose**: Retrieve all events for a specific user

**URL Parameters**:
- `userId`: ObjectId of the user

**Response**: Array of events sorted by newest first
```json
[
  {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "type": "PAGE_VIEW",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "meta": { "page": "/diary" },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
]
```

**Implementation**: `backend/src/routes/events.js:24-34`
- Queries events by userId
- Sorts by `createdAt: -1` (newest first)
- Returns empty array if no events found

#### Event Types

The system supports these event types:

1. **PAGE_VIEW**: User visits a page
   ```json
   {
     "type": "PAGE_VIEW",
     "meta": {
       "page": "/diary",
       "referrer": "/login",
       "loadTime": 1200
     }
   }
   ```

2. **CLICK**: User clicks an element
   ```json
   {
     "type": "CLICK",
     "meta": {
       "elementId": "save-button",
       "page": "/diary",
       "coordinates": { "x": 150, "y": 300 }
     }
   }
   ```

3. **FORM_SUBMIT**: User submits a form
   ```json
   {
     "type": "FORM_SUBMIT",
     "meta": {
       "form": "diary-entry",
       "duration": 45000,
       "fields": ["prompt", "answers"]
     }
   }
   ```

4. **API_ERROR**: API call fails
   ```json
   {
     "type": "API_ERROR",
     "meta": {
       "endpoint": "/entries/save",
       "error": "Validation failed",
       "statusCode": 400
     }
   }
   ```

5. **NAVIGATION**: User navigates
   ```json
   {
     "type": "NAVIGATION",
     "meta": {
       "from": "/login",
       "to": "/diary",
       "method": "click"
     }
   }
   ```

6. **SEARCH**: User performs search
   ```json
   {
     "type": "SEARCH",
     "meta": {
       "query": "diary entries",
       "results": 5,
       "page": "/search"
     }
   }
   ```

#### Integration Examples

**Frontend Tracking**:
```javascript
// Track page view
fetch('/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'PAGE_VIEW',
    meta: { page: window.location.pathname }
  })
});

// Track button click with user
fetch('/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    type: 'CLICK',
    meta: { elementId: 'save-button', page: '/diary' }
  })
});
```

**Error Tracking**:
```javascript
// In API routes
try {
  // API logic
} catch (error) {
  // Track error
  await fetch('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'API_ERROR',
      meta: {
        endpoint: req.path,
        error: error.message,
        statusCode: 500
      }
    })
  });
  
  res.status(500).json({ error: 'Server error' });
}
```

#### Testing Guide

**Postman Setup**:
1. **POST /events**:
   - URL: `POST http://localhost:3000/events`
   - Headers: `Content-Type: application/json`
   - Body: Any valid event JSON

2. **GET /events/:userId**:
   - URL: `GET http://localhost:3000/events/507f1f77bcf86cd799439011`
   - No body needed

**MongoDB Verification**:
- Open mongo-express: `http://localhost:8081`
- Select your database
- Look for `trackingevents` collection
- Verify document structure and timestamps

#### Technical Details

- **Database Collection**: `trackingevents`
- **Indexing**: Consider adding indexes for userId, type, timestamp for performance
- **Cleanup**: No automatic cleanup - events persist indefinitely
- **Privacy**: userId optional allows tracking anonymous users
- **Scalability**: Free-form meta field allows flexible event data
- **Timestamps**: Both automatic (createdAt/updatedAt) and custom timestamp field

#### Development Notes

- Follows existing code patterns (ES modules, async/await, consistent error handling)
- Uses same validation approach as other routes
- Integrates seamlessly with existing MongoDB setup
- No external dependencies required
- Docker-ready with existing environment setup

### Admin Dashboard Backend

**Purpose**: Admin endpoints for user management, event filtering, and analytics/statistics.

#### Routes: Admin API

**Location**: `backend/src/routes/admin.js`

**Base Path**: `/admin` (mounted in `backend/server.js:27`)

##### GET /admin/users
**Purpose**: List all users with minimal information

**Response**:
```json
{
  "ok": true,
  "users": [
    {
      "_id": "ObjectId",
      "email": "user@example.com",
      "birthday": "1995-08-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Implementation**: `backend/src/routes/admin.js:5-15`
- Selects minimal fields: `_id`, `email`, `birthday`, `createdAt`
- Sorts by newest first (`createdAt: -1`)
- Returns all users (no pagination)

##### GET /admin/events
**Purpose**: Retrieve tracking events with filtering capabilities

**Query Parameters**:
- `userId`: ObjectId filter (exact match)
- `type`: Event type filter (exact match)
- `from`: ISO date string (createdAt >= from)
- `to`: ISO date string (createdAt <= to)
- `page`: Filter on meta.page (exact match)
- `limit`: Number of results (default 100, max 500)

**Example Requests**:
```bash
# All events
GET /admin/events

# Filter by user and type
GET /admin/events?userId=507f1f77bcf86cd799439011&type=PAGE_VIEW

# Date range filter
GET /admin/events?from=2024-01-01&to=2024-01-31

# Page filter with limit
GET /admin/events?page=diary&limit=50

# Complex filter
GET /admin/events?userId=507f1f77bcf86cd799439011&type=CLICK&from=2024-01-15&limit=25
```

**Response**:
```json
{
  "ok": true,
  "count": 150,
  "events": [
    {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "type": "PAGE_VIEW",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "meta": {
        "page": "/diary",
        "referrer": "/login"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

**Implementation**: `backend/src/routes/admin.js:17-52`
- Validates and sanitizes limit (min 1, max 500, default 100)
- Builds dynamic query based on provided filters
- Validates ISO date strings before applying date ranges
- Returns both count and events array
- Sorts by newest first

##### GET /admin/stats
**Purpose**: Provide aggregated statistics and insights

**Response**:
```json
{
  "ok": true,
  "stats": {
    "totalEvents": 1250,
    "eventsByType": {
      "PAGE_VIEW": 450,
      "CLICK": 320,
      "FORM_SUBMIT": 180,
      "API_ERROR": 95,
      "NAVIGATION": 150,
      "SEARCH": 55
    },
    "topPages": [
      { "page": "diary", "count": 120 },
      { "page": "login", "count": 95 },
      { "page": "profile", "count": 45 },
      { "page": "unknown", "count": 30 }
    ],
    "eventsPerDay": [
      { "date": "2024-01-01", "count": 45 },
      { "date": "2024-01-02", "count": 52 },
      { "date": "2024-01-03", "count": 38 }
    ]
  }
}
```

**Implementation**: `backend/src/routes/admin.js:54-98`
- Uses MongoDB aggregation pipeline for performance
- **totalEvents**: Simple count of all tracking events
- **eventsByType**: Groups events by type field
- **topPages**: Extracts meta.page and counts visits (top 10)
- **eventsPerDay**: Groups by date using $dateToString format
- Returns sorted results: topPages by count desc, eventsPerDay by date asc

#### Technical Implementation Details

**Aggregation Pipeline**: `backend/src/routes/admin.js:62-88`
```javascript
const stats = await TrackingEvent.aggregate([
  {
    $group: {
      _id: null,
      totalEvents: { $sum: 1 },
      eventsByType: { $push: { type: "$type", count: 1 } },
      topPages: { $push: { page: { $ifNull: ["$meta.page", "unknown"] }, count: 1 } },
      eventsPerDay: { $push: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: 1 } }
    }
  }
]);
```

**Query Building**: `backend/src/routes/admin.js:28-42`
- Dynamic query construction based on available filters
- Safe date validation using `isNaN(date.getTime())`
- Meta field filtering using `query["meta.page"]`
- Range queries with `$gte` and `$lte` operators

**Data Processing**: `backend/src/routes/admin.js:91-108`
- Transforms aggregation arrays into count objects
- Handles "unknown" pages for events without meta.page
- Implements sorting and limiting for top pages
- Chronological sorting for daily events

#### Usage Examples

**Frontend Integration**:
```javascript
// Get all users
const users = await fetch('/admin/users').then(r => r.json());

// Get filtered events
const events = await fetch('/admin/events?userId=123&type=PAGE_VIEW&limit=50').then(r => r.json());

// Get dashboard stats
const stats = await fetch('/admin/stats').then(r => r.json());

// Date range filtering
const thisWeek = await fetch('/admin/events?from=2024-01-15&to=2024-01-22').then(r => r.json());
```

**Dashboard Data Structure**:
```javascript
// Expected admin dashboard data flow
const adminData = {
  users: [{ _id, email, birthday, createdAt }],
  events: { count, events: [...] },
  stats: {
    totalEvents: number,
    eventsByType: { [type]: count },
    topPages: [{ page, count }],
    eventsPerDay: [{ date, count }]
  }
};
```

#### Error Handling

- **400 Status**: Invalid limit values or malformed dates (returns generic "Server error")
- **500 Status**: Database connection or aggregation failures
- **200 Status**: Successful data retrieval with `{ ok: true, data }` format
- **Empty Results**: Returns empty arrays/count 0 rather than errors

#### Performance Considerations

- **Indexing**: Consider adding indexes on TrackingEvent fields:
  - `userId` for user queries
  - `type` for event type filtering
  - `createdAt` for date range queries
  - `meta.page` for page filtering
- **Aggregation**: Uses single aggregation pipeline for all stats
- **Limiting**: Events endpoint enforces 500 record maximum
- **Fields Selection**: Users endpoint uses `.select()` for minimal data transfer

#### Development Notes

- Follows existing code patterns (ES modules, async/await, consistent error handling)
- No authentication layer yet (as requested)
- Uses existing models and MongoDB connection
- Consistent response format across all endpoints
- Handles missing meta.page gracefully with "unknown" fallback
- Date validation prevents invalid ISO strings from breaking queries