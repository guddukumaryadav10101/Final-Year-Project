# Mock Test Platform - Changes Made

## Backend Updates (Express API)

**backend/routes/questionRoutes.js** (New)
- GET `/api/questions?mockTestName=...` : Fetches questions sorted by questionNumber (1-120)
- POST `/api/questions/bulk` : Protected bulk upload (admin auth), auto-maps section to marks (+12/-3 Maths, etc.)
- POST `/api/questions/calculate-score` : Takes userAnswers {1:'A', ...}, computes score with details

**backend/middleware/adminAuth.js** (New)
- Simple Basic Auth (username: 'admin', password: 'password123')

**backend/controllers/questionController.js** (Updated)
- bulkUploadQuestions: Fixed to use `section` (not subject), maps to marks obj {positive, negative}, adds mockTestName
- Added getAllQuestions: Finds by mockTestName, sorts questionNumber asc
- Added calculateScore: Matches user letter vs correctAnswer, applies marks/negative, returns total + details

**backend/server.js** (Updated)
- Mounted `/api/questions` routes after /api/test

## Frontend Updates (Next.js)

**frontend/src/app/exam/live/page.tsx** (Updated)
- Removed dummy data, useEffect fetch `/api/questions?mockTestName=Grand Mock Test 1`
- Answers now 'A'-'D' letters (matches DB correctAnswer)
- getMetaData uses q.section/marks if available, fallback ranges
- Submit button calls backend calculateScore, stores 'examResult' localStorage, navigates /exam/result

**frontend/src/app/admin/upload/page.tsx** (Updated)
- Added "PUSH TO DATABASE" below preview table
- Maps Excel rows to Question schema (flexible cols: Question/optionA/Answer/section)
- POST /api/questions/bulk with Basic auth
- Alert success/error, handles server connection

**frontend/src/app/admin/dashboard/add-mock/page.tsx** (Updated)
- Manual mode: Full form UI (questionNumber, text, options A-D, correctAnswer select, section select)
- Ready for state/logic to POST single question as bulk [q]

## Usage
1. `cd backend && npm start` (port 5000)
2. `cd frontend && npm run dev` (port 3000)
3. /admin/upload → Excel upload → PUSH
4. /exam/live → real questions + score calc

**Note:** Frontend XLSX needs `npm i xlsx @types/xlsx` if TS error.
Manual form needs JS logic for POST.

Full Admin → DB → Exam flow complete!

