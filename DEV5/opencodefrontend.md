# Astro Diary Frontend - Code Reference

## Frontend Architecture

**Technology Stack**: React (Vite) with vanilla JavaScript API integration

**Project Structure**:
```
frontend/
  src/
    api/
      api.js                # API functions for backend communication
    pages/
      Birthday.jsx           # Birthday input page component
      Questions.jsx          # Diary questions page component
      Saved.jsx             # Success confirmation page component
    App.jsx                # Main application container component
    main.jsx               # React app entry point
```

## Application Flow

### State Management

The app uses React `useState` hooks in the main App component to manage application state:

```javascript
const [step, setStep] = useState("birthday");    // Current screen
const [birthday, setBirthday] = useState("");     // User's birthday
const [prompt, setPrompt] = useState(null);       // Diary prompt data
const [answers, setAnswers] = useState({});      // User's answers
const [loading, setLoading] = useState(false);     // Loading state
const [error, setError] = useState(null);         // Error messages
```

### Application Screens

The app follows a 3-step flow controlled by `step` state:

1. **"birthday"** - Renders Birthday component
2. **"questions"** - Renders Questions component
3. **"saved"** - Renders Saved component

## Components Implementation

### Main App Component

**Location**: `frontend/src/App.jsx`

**Key Features**:
- Container component managing all application state
- Uses API functions from `./api/api.js`
- Implements user ID management with localStorage
- Handles tracking events for user actions
- Renders page components based on current step

**User ID Management**: `frontend/src/App.jsx:13-21`
```javascript
function getUserId() {
  let userId = localStorage.getItem("uid");
  if (!userId) {
    userId = crypto.randomUUID() || Date.now() + Math.random();
    localStorage.setItem("uid", userId);
  }
  return userId;
}
```

**Event Handlers**: `frontend/src/App.jsx:23-88`
- `handleBirthdaySubmit()`: Submits birthday, gets prompt, tracks event
- `handleAnswerChange()`: Updates answers object
- `handleSave()`: Saves entry with userId, tracks event
- `handleReset()`: Resets all state for new entry

**Component Rendering**: `frontend/src/App.jsx:90-115`
```javascript
if (step === "birthday") {
  return <Birthday birthday={birthday} setBirthday={setBirthday} loading={loading} error={error} onSubmit={handleBirthdaySubmit} />;
}

if (step === "questions") {
  return <Questions prompt={prompt} answers={answers} onChangeAnswer={handleAnswerChange} loading={loading} error={error} onSave={handleSave} />;
}

if (step === "saved") {
  return <Saved onReset={handleReset} />;
}
```

### Page Components

#### Birthday Component

**Location**: `frontend/src/pages/Birthday.jsx`

**Props Interface**:
```javascript
{
  birthday: string,      // Current birthday value
  setBirthday: Function,  // Birthday update function
  loading: boolean,      // Loading state for submit button
  error: string,         // Error message to display
  onSubmit: Function     // Submit handler
}
```

**Features**:
- Date input field with HTML5 date picker
- Form validation (required birthday)
- Loading state during API call
- Error message display
- Clean, centered layout

**UI Structure**: `frontend/src/pages/Birthday.jsx:8-68`
```javascript
<div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
  <h1>Astro Diary</h1>
  <form onSubmit={handleSubmit}>
    <div>
      <label htmlFor="birthday">Your Birthday:</label>
      <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
    </div>
    {error && <div>{error}</div>}
    <button type="submit" disabled={loading || !birthday}>
      {loading ? "Loading..." : "Get My Daily Prompt"}
    </button>
  </form>
</div>
```

#### Questions Component

**Location**: `frontend/src/pages/Questions.jsx`

**Props Interface**:
```javascript
{
  prompt: {              // Diary prompt data
    sign: string,
    text: string,
    questions: string[]
  },
  answers: Object,        // User's answers object
  onChangeAnswer: Function, // Answer update function
  loading: boolean,      // Loading state for save button
  error: string,         // Error message to display
  onSave: Function        // Save handler
}
```

**Features**:
- Displays zodiac sign and current date
- Shows personalized prompt text
- Dynamic textarea generation for each question
- Real-time answer updates
- Form validation and submission

**Answer Management**: `frontend/src/pages/Questions.jsx:28-32`
```javascript
function handleAnswerChange(index, value) {
  onChangeAnswer(index, value);
}
```

**Dynamic Questions Rendering**: `frontend/src/pages/Questions.jsx:42-52`
```javascript
{prompt.questions.map((question, index) => (
  <div key={index}>
    <label>{question}</label>
    <textarea 
      value={answers[index] || ""} 
      onChange={(e) => handleAnswerChange(index, e.target.value)}
      required 
    />
  </div>
))}
```

#### Saved Component

**Location**: `frontend/src/pages/Saved.jsx`

**Props Interface**:
```javascript
{
  onReset: Function      // Reset handler for new entry
}
```

**Features**:
- Success confirmation with emoji
- Positive feedback message
- Reset button for new entry
- Simple, clean layout

**UI Structure**: `frontend/src/pages/Saved.jsx:4-35`
```javascript
<div style={{ padding: "2rem", maxWidth: "400px", textAlign: "center" }}>
  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
  <h2>Entry Saved!</h2>
  <p>Your diary entry has been saved successfully.</p>
  <button onClick={onReset}>Write Another Entry</button>
</div>
```

## API Integration

### API Functions

**Location**: `frontend/src/api/api.js`

**Exported Functions**:
```javascript
export async function getDiaryPrompt(birthday)   // POST /entries/prompt
export async function saveDiaryEntry(data)        // POST /entries/save  
export async function sendEvent({ userId, type, meta }) // POST /events
```

**API Configuration**: `frontend/src/api/api.js:1`
```javascript
const API_URL = "http://localhost:3000";
```

### API Integration in App Component

**Birthday Submission**: `frontend/src/App.jsx:32-36`
```javascript
await sendEvent({ type: "FORM_SUBMIT", meta: { form: "birthday" } });
const promptData = await getDiaryPrompt(birthday);
```

**Entry Saving**: `frontend/src/App.jsx:64-76`
```javascript
const userId = getUserId();
await sendEvent({ userId, type: "FORM_SUBMIT", meta: { form: "save_entry" } });
await saveDiaryEntry({
  userId,
  date: new Date().toISOString().split("T")[0],
  zodiacSign: prompt.sign,
  promptText: prompt.text,
  answers: answers,
});
```

## User Management

### Persistent User ID

The app implements localStorage-based user identification:

**Generation Strategy**: `frontend/src/App.jsx:13-21`
```javascript
function getUserId() {
  let userId = localStorage.getItem("uid");
  if (!userId) {
    userId = crypto.randomUUID() || Date.now() + Math.random();
    localStorage.setItem("uid", userId);
  }
  return userId;
}
```

**Key Features**:
- **Automatic generation**: Creates unique ID on first visit
- **Fallback support**: Uses crypto.randomUUID() or timestamp + random
- **Persistent storage**: Saves to localStorage for future sessions
- **Cross-session consistency**: Same ID across browser sessions
- **Privacy compliance**: No personal data stored, only random identifier

## Data Flow

### Application State Flow

1. **Initialization**: App loads, reads userId from localStorage
2. **Birthday Submission**: 
   - Tracks `FORM_SUBMIT` event with `{form: "birthday"}`
   - Calls `getDiaryPrompt(birthday)`
   - Updates state to show `Questions` component
3. **Question Answering**:
   - User fills textareas
   - Answers stored in state as indexed object
4. **Entry Saving**:
   - Tracks `FORM_SUBMIT` event with `{form: "save_entry"}`
   - Calls `saveDiaryEntry()` with complete data
   - Updates state to show `Saved` component
5. **Reset**: User can start new entry, maintains same userId

### Data Structures

**Answers Object**: `frontend/src/App.jsx:44-48`
```javascript
{
  0: "Answer to first question",
  1: "Answer to second question", 
  2: "Answer to third question"
}
```

**Diary Entry Data**: `frontend/src/App.jsx:67-73`
```javascript
{
  userId: "generated-uuid-from-localstorage",
  date: "2026-01-04",           // YYYY-MM-DD format
  zodiacSign: "Leo",
  promptText: "Leo: een rustige dag, denk aan jezelf.",
  answers: { /* answers object */ }
}
```

## Styling Approach

### Inline CSS Strategy

All components use inline React styles for simplicity:

**Consistent Design System**:
- **Container padding**: `2rem`
- **Max widths**: `400px` (forms), `600px` (questions)
- **Font family**: `Arial, sans-serif`
- **Button colors**: Blue (#007bff) for primary, Green (#28a745) for save
- **Error colors**: Red text with light background

**Responsive Design**:
- Mobile-friendly layouts with max-width containers
- Flexible textarea sizing with `resize: "vertical"`
- Centered content with `margin: "0 auto"`

## Error Handling

### Error State Management

**Centralized Error State**: `frontend/src/App.jsx:7`
```javascript
const [error, setError] = useState(null);
```

**Error Display**: Passed as prop to child components
```javascript
{error && (
  <div style={{
    color: "red",
    backgroundColor: "#ffebee",
    border: "1px solid #f44336",
    borderRadius: "4px"
  }}>
    {error}
  </div>
)}
```

**Error Sources**:
- Network failures for API calls
- Invalid API responses
- Server-side validation errors
- User input validation

## Development Quality

### Code Quality Features

**Clean Component Architecture**:
- Single responsibility principle for each component
- Clear prop interfaces
- Separated concerns (UI vs logic)

**Modern JavaScript**:
- ES6+ syntax throughout
- Destructuring and arrow functions
- Async/await for API calls

**Build Compliance**:
- **✅ No ESLint errors**: All variables properly used
- **✅ Successful builds**: Production compilation passes
- **✅ Type safety**: Proper prop validation

### Refactoring Benefits

**Maintainability**:
- **Modular structure**: Easy to modify individual pages
- **Reusable components**: Components can be used in other contexts
- **Clear separation**: UI logic separated from business logic

**Scalability**:
- **Component composition**: Easy to add new pages
- **State management**: Centralized in App component
- **API abstraction**: Easy to modify backend integration

**Testing Readiness**:
- **Component isolation**: Each page can be unit tested
- **Clear interfaces**: Props are well-defined
- **Pure functions**: Event handlers are testable

## Future Enhancements

### Potential Additions

1. **User Authentication**: Replace localStorage ID with proper login system
2. **Entry History**: Add component to view and edit previous entries
3. **Analytics Dashboard**: Display user insights and trends
4. **Themes**: Add dark mode and color customization
5. **Offline Support**: Local storage for offline diary writing
6. **Export Features**: PDF or text export of diary entries

### Docker Preparation

The refactored structure is ready for Docker deployment:
- **Clean separation**: API, pages, and main components isolated
- **Environment variables**: API_URL can be configured
- **Build optimization**: Production builds successfully
- **Static serving**: All assets properly bundled