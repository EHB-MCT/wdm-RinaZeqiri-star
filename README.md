# Astro Diary - DEV5 Project
Application web pour suivi de journal personnel avec analyse de sentiments, suivi des événements utilisateur et tableau de bord d'administration.

## Prerequisites
- Docker
- Docker Compose
- Node.js (optionnel, pour développement local sans Docker)

## Step-by-Step Setup Guide
1. Clone the repository:

```bash
git clone https://github.com/EHB-MCT/wdm-RinaZeqiri-star.git
```

2. Configure environment variables:

```bash
cp DEV5/backend/.env.template DEV5/backend/.env
```

3. Start all services:

```bash
docker compose up --build
```

## Access URLs
- User Frontend: http://localhost:5173/
- Admin Frontend: http://localhost:5174/
- Backend API: http://localhost:3000/
- Mongo Express (DB UI): http://localhost:8081/

## Testing Flow

### User Flow
1. Open user frontend at http://localhost:5173/
2. Enter birthday in the form
3. Receive zodiac sign and personalized diary prompt questions
4. Write free-text answers to the questions
5. Submit the form
6. Entry is saved with analysis (sentiment, emotions, topics, people mentioned)
7. View saved entries in the diary

### Admin Flow
1. Open admin frontend at http://localhost:5174/
2. View platform statistics (users count, entries count, events count)
3. Browse and filter users list
4. Filter events by:
   - User ID
   - Event type (page views, clicks, form submits)
   - Date range (from/to)
   - Pagination and limits
5. Filter diary entries by:
   - User ID
   - Date range
   - Sentiment analysis
   - Emotions detected
   - Topics mentioned
   - Pagination and limits

## File Structure Overview
```
wdm-RinaZeqiri-star/
├── DEV5/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── entries.js
│   │   │   │   ├── events.js
│   │   │   │   └── admin.js
│   │   │   ├── models/
│   │   │   │   ├── User.js
│   │   │   │   ├── Entry.js
│   │   │   │   └── Event.js
│   │   │   └── utils/
│   │   │       ├── sentimentAnalysis.js
│   │   │       ├── zodiacCalculator.js
│   │   │       └── textProcessing.js
│   │   ├── .env.template
│   │   ├── server.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── admin-frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── Dockerfile
│   └── docker-compose.yml
├── docker-compose.yml
└── README.md
```

## Stopping
```bash
docker compose down
```

## Optional: Reset database completely:
```bash
docker compose down -v
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Entries
- `POST /entries/prompt` - Generate diary prompt based on birthday
  - Body: `{ birthday }`
- `POST /entries/save` - Save diary entry with analysis
  - Body: `{ userId, date, zodiacSign, promptText, answers }`
- `GET /entries/:userId` - List all entries for a specific user

### Events
- `POST /events` - Track user events
  - Body: `{ userId, type, meta }`

### Admin
- `GET /admin/users` - Get all users list
- `GET /admin/stats` - Get platform statistics
- `GET /admin/events` - Get filtered events
  - Query: `userId, type, page, from, to, limit`
- `GET /admin/entries` - Get filtered diary entries
  - Query: `userId, from, to, limit, sentiment, emotion, topic`

## Environment Variables
- **PORT**: Backend server port (default: 3000)
- **MONGO_URI**: MongoDB connection string
  - With Docker Compose: `mongodb://mongo:27017/astro-diary`
  - Local development: `mongodb://localhost:27017/astro-diary`

## Sources and References
- Docker Compose environment files: https://docs.docker.com/compose/environment-variables/

- Mongo Express image: https://hub.docker.com/_/mongo-express

- Express.js framework: https://expressjs.com/

- Mongoose ODM: https://mongoosejs.com/

- gebruikt om mongo-express toeveogen: 
https://github.com/mongo-express/mongo-express-docker/blob/master/README.md

- gebruikt voor wat zijn lexiconen: https://www.medallia.com/platform/text-analytics/?utm_campaign=monkeylearnmigration/

## AI Assistance
AI assistance used (OpenCode)