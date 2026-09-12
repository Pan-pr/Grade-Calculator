/**
 * Application constants
 */

// API Configuration
export const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:5000/api';
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const AUTO_SAVE_DEBOUNCE = 2000; // 2 seconds of inactivity before saving
export const SYNC_STATUS_TIMEOUT = 3000; // 3 seconds to show sync status

// Grade Scale - Standard university grading
export const GRADE_SCALE = [
  { grade: "A", score: 80, gpa: 4.0 },
  { grade: "B+", score: 75, gpa: 3.5 },
  { grade: "B", score: 70, gpa: 3.0 },
  { grade: "C+", score: 65, gpa: 2.5 },
  { grade: "C", score: 60, gpa: 2.0 },
  { grade: "D+", score: 55, gpa: 1.5 },
  { grade: "D", score: 50, gpa: 1.0 },
  { grade: "F", score: 0, gpa: 0.0 }
];

// GPA Color Thresholds
export const GPA_COLORS = {
  excellent: { min: 3.5, class: 'text-emerald-400' }, // A/B+
  good: { min: 2.5, class: 'text-amber-400' },        // B/C+
  passing: { min: 0, class: 'text-rose-400' }         // C and below
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_ID: 'userId',
  GRADES: 'grades'
};

// Initial Course Data
export const INITIAL_DATA = [
  {
    id: "comprog",
    name: "Com Prog",
    credits: 3,
    assessments: [
      { name: "Test 1", score: 18.75, max: 25 },
      { name: "Test 2", score: 0, max: 25 },
      { name: "Test 3", score: 0, max: 30 },
      { name: "Project", score: 0, max: 10 },
      { name: "Grader", score: 5, max: 5 },
      { name: "Attendance", score: 5, max: 5 }
    ]
  },
  {
    id: "physics1",
    name: "Physics I",
    credits: 3,
    assessments: [
      { name: "Midterm", score: 0, max: 50 },
      { name: "Final", score: 0, max: 50 }
    ]
  },
  {
    id: "calc1",
    name: "Calculus I",
    credits: 3,
    assessments: [
      { name: "Midterm", score: 0, max: 45 },
      { name: "Final", score: 0, max: 45 },
      { name: "Quiz", score: 8.75, max: 10 }
    ]
  },
  {
    id: "commeng",
    name: "Comm Eng",
    credits: 3,
    assessments: [
      { name: "Presentation 1", score: 4.14, max: 5 },
      { name: "Presentation 2", score: 0, max: 5 },
      { name: "Essay 1", score: 0, max: 10 },
      { name: "Essay 2", score: 0, max: 10 },
      { name: "Classwork", score: 9.875, max: 10 },
      { name: "Midterm", score: 0, max: 25 },
      { name: "Final", score: 0, max: 25 }
    ]
  },
  {
    id: "phylab",
    name: "Physics Lab",
    credits: 1,
    assessments: [
      { name: "Lab 1", score: 7, max: 7 },
      { name: "Lab 2", score: 7, max: 7 },
      { name: "Lab 3", score: 7, max: 7 },
      { name: "Lab 4", score: 6, max: 7 },
      { name: "Lab 5", score: 6, max: 7 },
      { name: "Lab 6", score: 0, max: 7 },
      { name: "Lab 7", score: 0, max: 7 },
      { name: "Lab 8", score: 0, max: 7 },
      { name: "Lab 9", score: 0, max: 7 },
      { name: "Lab 10", score: 0, max: 7 },
      { name: "Final Exam", score: 0, max: 30 }
    ]
  },
  {
    id: "explore",
    name: "Explore Engineering",
    credits: 3,
    assessments: [
      { name: "Presentation 1", score: 0, max: 5 },
      { name: "Presentation 2", score: 0, max: 5 },
      { name: "Essay 1", score: 0, max: 10 },
      { name: "Essay 2", score: 0, max: 10 },
      { name: "Classwork", score: 0, max: 10 },
      { name: "Midterm", score: 0, max: 25 },
      { name: "Final", score: 0, max: 25 }
    ]
  }
];
