# Admin Frontend Documentation

## Overview
This is a Vite + React admin dashboard that connects to a backend API running on `http://localhost:3000`. The dashboard provides administrative interfaces for viewing users, statistics, events, and entries with filtering capabilities.

## Project Structure
```
admin-frontend/
├── src/
│   ├── api/
│   │   └── adminApi.js          # API client functions
│   ├── pages/
│   │   └── Dashboard.jsx        # Main dashboard component
│   ├── App.jsx                  # Root component (renders Dashboard)
│   ├── main.jsx                 # React app entry point
│   └── ...                      # Other Vite/React files
├── package.json
├── vite.config.js
└── index.html
```

## API Integration (`src/api/adminApi.js`)

### Configuration
```javascript
export const ADMIN_API_URL = "http://localhost:3000";
```

### Available Functions

#### `getUsers()`
- **Endpoint**: `GET /admin/users`
- **Returns**: Array of user objects
- **Usage**: `const users = await getUsers();`

#### `getStats()`
- **Endpoint**: `GET /admin/stats`
- **Returns**: Stats object with `totalEvents`, `eventsByType`, `topPages`, `eventsPerDay`
- **Usage**: `const stats = await getStats();`

#### `getEvents(filters = {})`
- **Endpoint**: `GET /admin/events`
- **Query Parameters**:
  - `userId`: Filter by specific user
  - `type`: Filter by event type
  - `page`: Pagination
  - `from`: Start date filter
  - `to`: End date filter
  - `limit`: Maximum results to return
- **Returns**: Array of event objects
- **Usage**: `const events = await getEvents({ userId: 'user123', limit: 50 });`

#### `getEntries(filters = {})`
- **Endpoint**: `GET /admin/entries`
- **Query Parameters**:
  - `userId`: Filter by specific user
  - `from`: Start date filter
  - `to`: End date filter
  - `limit`: Maximum results to return
- **Returns**: Array of entry objects
- **Usage**: `const entries = await getEntries({ limit: 25 });`

### Error Handling
The API client automatically handles:
- Network connectivity issues
- HTTP error responses
- JSON parsing errors
- Provides user-friendly error messages

## Dashboard Component (`src/pages/Dashboard.jsx`)

### Features
- **Real-time Filtering**: Instant updates when filter values change
- **Data Visualization**: Statistics cards with key metrics
- **Data Tables**: Sortable, responsive tables for events and entries
- **Loading States**: User feedback during data fetching
- **Error Handling**: Graceful error display and recovery

### Filter Controls
1. **Event Type Dropdown**: Filter events by type (populated dynamically)
2. **User Dropdown**: Filter by specific user (populated from API)
3. **Limit Input**: Control the number of results returned (default: 50)

### Dashboard Sections

#### Statistics Cards
- **Total Events**: Overall event count
- **Events by Type**: Breakdown of events by category
- **Top Pages**: Most visited pages with hit counts
- **Events Per Day**: Daily event activity over time

#### Events Table
Columns displayed:
- `createdAt`: Event timestamp (formatted)
- `type`: Event category/type
- `meta.page`: Page where event occurred
- `meta.button`: Button clicked (if applicable)
- `userId`: User who triggered the event

#### Entries Table
Columns displayed:
- `createdAt`: Entry timestamp (formatted)
- `zodiacSign`: User's zodiac sign
- `analysis.sentiment`: Sentiment analysis result
- `analysis.sentimentScore`: Sentiment score (numeric)
- `userId`: User who created the entry

### React Hooks Used
- `useState`: Manage component state (data, filters, loading, errors)
- `useEffect`: Handle data fetching lifecycle
- `useMemo`: Optimize expensive computations (event types list)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Backend API running on `http://localhost:3000` with CORS enabled

### Installation Steps
```bash
# Navigate to admin-frontend directory
cd admin-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Environment Configuration

### Development
The development server runs on `http://localhost:5173` by default (Vite's default).

### Production
Build artifacts are output to `dist/` directory and can be served by any static web server.

## Backend API Requirements

The dashboard expects the following API responses:

### `/admin/users`
```json
{
  "ok": true,
  "users": [
    {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

### `/admin/stats`
```json
{
  "ok": true,
  "stats": {
    "totalEvents": 1500,
    "eventsByType": {
      "click": 800,
      "pageview": 500,
      "form_submit": 200
    },
    "topPages": [
      { "page": "/home", "count": 300 },
      { "page": "/about", "count": 200 }
    ],
    "eventsPerDay": {
      "2024-01-01": 100,
      "2024-01-02": 120
    }
  }
}
```

### `/admin/events` and `/admin/entries`
Both return arrays of objects with the appropriate fields as described in the tables section above.

## Styling
The dashboard uses inline CSS for simplicity and to avoid additional dependencies. The design is:
- Clean and minimal
- Responsive with mobile-friendly layouts
- Uses a card-based layout for statistics
- Tables with hover effects and proper spacing
- Color-coded sections for visual hierarchy

## Performance Considerations
- Data fetching is done in parallel where possible
- `useMemo` prevents unnecessary recalculations
- Filter debouncing could be added for large datasets
- Pagination support is built into the API layer

## Future Enhancements
- [ ] Add date range pickers for `from`/`to` filters
- [ ] Implement pagination for large result sets
- [ ] Add export functionality for data tables
- [ ] Implement real-time updates with WebSockets
- [ ] Add user authentication and role-based access
- [ ] Create dedicated components for reusable UI elements
- [ ] Add unit and integration tests
- [ ] Implement proper error boundary handling
- [ ] Add dark mode support
- [ ] Create data visualization charts

## Troubleshooting

### Common Issues

**Network Error**: Ensure backend is running on port 3000 with CORS enabled
```javascript
// Backend CORS configuration example
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

**No Data Displayed**: Check that API endpoints return expected data structure
**Slow Loading**: Consider implementing pagination or reducing default limit
**Filter Not Working**: Verify filter state updates and API parameter mapping

## Dependencies
The project uses minimal dependencies:
- `react` (v19.2.0) - UI framework
- `react-dom` (v19.2.0) - DOM renderer
- `vite` (v7.2.4) - Build tool and dev server

No additional UI libraries are required, keeping the bundle size minimal and maintainability high.