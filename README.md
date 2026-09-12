# Grade Calculator

A modern, interactive grade tracking and calculation dashboard for students to monitor their academic performance in real-time.

## Features

✨ **Core Functionality**
- 📊 Real-time GPA calculation and grade prediction
- 📈 Visual progress tracking with charts
- 📝 Editable assessment scores for all courses
- ☁️ Cloud synchronization of grades
- 🔐 Secure user authentication (login/signup)
- 🎨 Dark mode glass-morphism UI with Tailwind CSS

## Architecture

The application is now modularized into separate JavaScript files for better maintainability and testability:

```
├── index.html                 # Main HTML with module imports
├── js/
│   ├── constants.js          # Configuration & constants
│   ├── auth.js               # Authentication logic
│   ├── gradeCalculator.js    # Grade computation utilities
│   ├── dashboard.js          # UI rendering & updates
│   └── utils.js              # Helper functions
├── .env.example              # Environment configuration template
└── README.md                 # This file
```

### Module Descriptions

**`constants.js`**
- API configuration
- Grade scale definitions
- Local storage keys
- Initial course data
- UI constants (timeouts, intervals)

**`auth.js`**
- `AuthManager` class for handling login/signup
- Email and password validation
- Secure token storage with httpOnly cookies support
- Session management

**`gradeCalculator.js`**
- Pure calculation functions for grades and GPA
- `getGradeAndGpa()` - Calculate grade based on score
- `calculateDashboardMetrics()` - Aggregate course statistics
- `updateSubjectScore()` - Validated score updates
- `getNextGradeMilestone()` - Calculate points needed for next grade

**`dashboard.js`**
- `renderSubjects()` - Generate subject cards HTML
- `updateMetrics()` - Update metric displays
- `initCharts()` - Initialize Chart.js instances
- `updateCharts()` - Update chart data
- `switchView()` - Toggle between auth and dashboard views

**`utils.js`**
- `debounce()` - Delay function execution
- `showStatus()` - Display temporary messages
- `setButtonLoading()` - Button state management
- `getAuthHeaders()` - Prepare API request headers
- `retryAsync()` - Retry failed API calls
- Utility functions for validation and formatting

## Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js/npm (if running locally with a backend)
- Backend API server running on `http://localhost:5000`

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pan-pr/Grade-Calculator.git
   cd Grade-Calculator
   ```

2. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # Edit .env to match your backend URL
   ```

3. **Run a local server** (to avoid CORS issues)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8000`

### Backend API Requirements

The application expects the following API endpoints:

**Authentication**
- `POST /api/auth/login` - Login user
  - Request: `{ email, password }`
  - Response: `{ token, userId }`

- `POST /api/auth/register` - Register new user
  - Request: `{ email, password }`
  - Response: `{ token, userId }`

**Grades**
- `GET /api/grades` - Fetch user's saved grades
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ subjects: [] }`

- `POST /api/grades` - Save user's grades
  - Headers: `Authorization: Bearer {token}`
  - Request: `{ subjects: [] }`
  - Response: `{ success: true }`

## Usage

### Login/Sign Up
1. Enter your email and password
2. Click "Login" or toggle to "Sign Up" for new accounts
3. Password must be at least 6 characters

### Dashboard
- **View Grades**: All your courses and assessments are displayed in card format
- **Enter Scores**: Click the score input field and enter your earned points
- **Real-time Updates**: GPA and metrics update automatically
- **Save to Cloud**: Click "Save to Cloud" to persist grades (auto-saves every 30 seconds)
- **Reset**: Click "Reset" to restore default data
- **Logout**: Click "Logout" to sign out

### Adding Assessment Scores
1. Find the course in the dashboard
2. Scroll to the assessment table
3. Enter the score earned in the "Score Earned" column
4. Press Enter or click elsewhere to update
5. The dashboard metrics and charts update automatically

## Improvements Implemented

### Code Organization ✅
- Extracted 350+ lines of inline JavaScript into modular files
- Separated concerns: auth, calculations, UI rendering, utilities
- Easier to test, maintain, and extend

### Security Enhancements ✅
- Input validation and sanitization
- XSS protection with HTML escaping
- Secure token handling with httpOnly cookie support
- Email format validation
- Password minimum length enforcement

### Performance Optimizations ✅
- **Debounced auto-save**: Waits 2 seconds after last change before syncing
- **Efficient chart updates**: Uses `.update('none')` to prevent unnecessary animations
- **Targeted DOM updates**: Only re-renders affected components
- **Event delegation**: Centralized event handling

### User Experience Improvements ✅
- Loading states on buttons during async operations
- Detailed error messages with context
- Sync status indicators
- Better keyboard navigation with focus visible outlines
- Confirmation dialogs for destructive actions

### Accessibility ✅
- Proper ARIA labels on form inputs
- Role attributes for dynamic content
- Live region updates with `aria-live="polite"`
- Focus-visible outlines for keyboard navigation
- Semantic HTML structure

## Configuration

Edit `js/constants.js` to customize:

```javascript
// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const AUTO_SAVE_DEBOUNCE = 2000;  // 2 seconds

// Grade Scale
export const GRADE_SCALE = [
  { grade: "A", score: 80, gpa: 4.0 },
  { grade: "B+", score: 75, gpa: 3.5 },
  // ... more grades
];

// Initial course data
export const INITIAL_DATA = [
  {
    id: "comprog",
    name: "Com Prog",
    credits: 3,
    assessments: [...]
  },
  // ... more courses
];
```

## Error Handling

The application handles:
- ❌ Network errors with retry logic
- ❌ Invalid authentication attempts
- ❌ Score validation (must not exceed max)
- ❌ Corrupted localStorage data (graceful fallback)
- ❌ Missing API endpoints

All errors are displayed to the user with actionable messages.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers supported

## Future Enhancements

- [ ] Undo/Redo functionality for score changes
- [ ] Export grades to PDF
- [ ] Conflict resolution for concurrent edits
- [ ] Assignment prediction simulator
- [ ] Multiple term tracking
- [ ] Grade distribution analytics
- [ ] Dark/Light theme toggle
- [ ] Offline-first with service workers

## Development

### Running Tests (Coming Soon)
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Troubleshooting

**Q: API calls failing with CORS error**
- Ensure backend is running on correct port
- Check `API_BASE_URL` in `js/constants.js`
- Verify backend has CORS headers enabled

**Q: Changes not saving**
- Check browser console for errors
- Verify auth token is valid (check localStorage)
- Ensure backend `/api/grades` endpoint is accessible

**Q: Grades not loading after login**
- Clear browser cache/localStorage
- Check if grades exist on backend
- Try resetting to defaults

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open a [GitHub Issue](https://github.com/Pan-pr/Grade-Calculator/issues).

---

**Built with ❤️ using Vanilla JS, Tailwind CSS, and Chart.js**
