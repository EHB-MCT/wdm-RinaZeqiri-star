# Astro Diary Frontend - Code Reference

## Frontend Architecture

**Technology Stack**: React (Vite) with vanilla JavaScript API integration

**Project Structure**:
```
frontend/
  src/
    api.js          # API functions for backend communication
    App.jsx         # Main application component
    main.jsx        # React app entry point
```

## Application Flow

### State Management

The app uses React `useState` hooks to manage application state:

```javascript
const [step, setStep] = useState("birthday");    // Current screen
const [birthday, setBirthday] = useState("");     // User's birthday
const [prompt, setPrompt] = useState(null);       // Diary prompt data
const [answers, setAnswers] = useState({});      // User's answers
const [loading, setLoading] = useState(false);     // Loading state
const [error, setError] = useState(null);         // Error messages
const [saved, setSaved] = useState(false);       // Success state
```

### Application Screens

The app follows a 3-step flow controlled by the `step` state:

1. **"birthday"** - Date input screen
2. **"questions"** - Diary questions screen
3. **"saved"** - Success confirmation screen

## Components Implementation

### Main App Component

**Location**: `frontend/src/App.jsx`

**Key Features**:
- Self-contained single component
- Uses existing API functions from `./api.js`
- Implements tracking events for user actions
- Clean UI with inline CSS styling
- Responsive design with loading and error states

### Screen 1: Birthday Input

**Implementation**: `App.jsx:52-98`

**Features**:
- Date input field with validation
- Form submission handler
- Loading state during API call
- Error display with styled messages
- Tracks `FORM_SUBMIT` event with `{ form: "birthday" }`

**Key Code**:
```javascript
async function handleBirthdaySubmit(e) {
  e.preventDefault();
  if (!birthday) return;
  
  setLoading(true);
  setError(null);
  
  try {
    // Track birthday form submission
    await sendEvent({ type: "FORM_SUBMIT", meta: { form: "birthday" } });
    
    // Get diary prompt
    const promptData = await getDiaryPrompt(birthday);
    setPrompt(promptData);
    
    // Initialize answers object
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
```

### Screen 2: Diary Questions

**Implementation**: `App.jsx:100-170`

**Features**:
- Displays zodiac sign and prompt text
- Dynamic textarea generation for each question
- Real-time answer state management
- Form validation and submission
- Tracks `FORM_SUBMIT` event with `{ form: "save_entry" }`

**Answer Management**:
```javascript
function handleAnswerChange(index, value) {
  setAnswers(prev => ({
    ...prev,
    [index]: value
  }));
}
```

**Save Implementation**:
```javascript
async function handleSave(e) {
  e.preventDefault();
  
  if (!prompt) return;
  
  setLoading(true);
  setError(null);
  
  try {
    // Track save entry form submission
    await sendEvent({ type: "FORM_SUBMIT", meta: { form: "save_entry" } });
    
    // Save diary entry
    await saveDiaryEntry({
      userId: "temp-user-123", // Hardcoded for now
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      zodiacSign: prompt.sign,
      promptText: prompt.text,
      answers: answers
    });
    
    setSaved(true);
    setStep("saved");
  } catch (err) {
    setError("Failed to save entry. Please try again.");
  } finally {
    setLoading(false);
  }
}
```

### Screen 3: Success Confirmation

**Implementation**: `App.jsx:172-210`

**Features**:
- Success message with emoji
- Option to write another entry
- Complete state reset functionality

## API Integration

### API Functions Usage

**Location**: `frontend/src/api.js`

The app imports and uses three main API functions:

```javascript
import { getDiaryPrompt, saveDiaryEntry, sendEvent } from "./api.js";
```

### API Calls Flow

1. **Get Diary Prompt**: `getDiaryPrompt(birthday)`
   - Called on birthday submission
   - Returns zodiac sign, prompt text, and questions

2. **Save Entry**: `saveDiaryEntry(data)`
   - Called with complete diary entry data
   - Includes userId, date, zodiacSign, promptText, answers

3. **Track Events**: `sendEvent({ type, meta })`
   - Called twice: birthday form and save entry form
   - Tracks user interactions for analytics

### Data Structure

**Diary Entry Data**:
```javascript
{
  userId: "temp-user-123",
  date: "2026-01-04",           // YYYY-MM-DD format
  zodiacSign: "Leo",
  promptText: "Leo: een rustige dag, denk aan jezelf.",
  answers: {
    0: "Answer to question 1",
    1: "Answer to question 2", 
    2: "Answer to question 3"
  }
}
```

**Tracking Events**:
```javascript
// Birthday form submission
{
  type: "FORM_SUBMIT",
  meta: { form: "birthday" }
}

// Entry save form submission
{
  type: "FORM_SUBMIT", 
  meta: { form: "save_entry" }
}
```

## User Experience Features

### Loading States

- Buttons disabled during API calls
- Loading text displayed
- Prevents double submissions

### Error Handling

- User-friendly error messages
- Styled error containers
- Graceful fallback states

### Form Validation

- Required field validation
- Date input validation
- Answer completion requirement

### Responsive Design

- Mobile-friendly layouts
- Max-width containers
- Flexible textarea sizing
- Centered content alignment

## Styling Approach

### Inline CSS Strategy

All styling uses inline React styles for simplicity:

```javascript
style={{
  padding: "2rem",
  maxWidth: "400px", 
  margin: "0 auto",
  fontFamily: "Arial, sans-serif"
}}
```

### Design Principles

- **Consistent spacing**: 2rem containers, 1rem margins
- **Clean typography**: Arial font family, consistent font sizes
- **Color scheme**: Blue for primary actions, green for success, red for errors
- **Accessible forms**: Proper labels, required attributes, semantic HTML

## State Management Patterns

### Answer Storage

Answers stored as object with question indices:
```javascript
{
  0: "Answer to first question",
  1: "Answer to second question",
  2: "Answer to third question"
}
```

### Step Navigation

Controlled by single `step` state:
```javascript
setStep("birthday");    // Show birthday screen
setStep("questions");   // Show questions screen  
setStep("saved");       // Show success screen
```

### Error Handling

Centralized error state with styled display:
```javascript
{error && (
  <div style={{
    color: "red",
    marginBottom: "1rem",
    padding: "0.5rem",
    backgroundColor: "#ffebee",
    border: "1px solid #f44336",
    borderRadius: "4px"
  }}>
    {error}
  </div>
)}
```

## Development Notes

### Hardcoded Values

- `userId: "temp-user-123"` - Temporary user identification
- API URL defined in `api.js` - Points to backend server

### Extensibility

The component structure allows easy addition of:
- User authentication integration
- Multiple diary entries per day
- Entry history and editing
- Advanced analytics and insights

### Performance Considerations

- Minimal state updates with proper spread operators
- Efficient event handlers
- Clean component lifecycle management
- No unnecessary re-renders

## Future Enhancements

### Potential Additions

1. **Authentication**: Replace hardcoded userId with real user system
2. **History**: Add entry listing and navigation
3. **Editing**: Allow users to modify previous entries
4. **Insights**: Display analysis results from backend
5. **Themes**: Add dark mode and color customization
6. **Offline**: Add local storage for offline capability

### Code Quality

- Self-contained single component
- Clear separation of concerns
- Consistent error handling patterns
- Maintainable state management
- Readable and documented code structure