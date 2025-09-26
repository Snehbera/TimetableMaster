import { create } from "zustand";

// --- Helper Functions (can be in this file or a utils file) ---
const DYNAMIC_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// This function now creates a grid based on the number of timings and days
const initializeAvailability = (numPeriods, numDays) => {
  if (numPeriods <= 0 || numDays <= 0) return [];
  return Array(numPeriods)
    .fill(null)
    .map(() => Array(numDays).fill(true));
};

// --- Zustand Store Definition ---
const useTimetableStore = create((set, get) => ({
  // --- Existing State ---
  periodsPerDay: 6,
  timings: [],

  // --- New State for Subjects ---
  subjects: [ ],

  // --- Existing Actions ---
  setPeriodsPerDay: (newPeriods) => set({ periodsPerDay: newPeriods }),
  setTimings: (newTimings) => set({ timings: newTimings }),

  // --- New Actions for Managing Subjects ---
  addSubject: () => {
    const { timings, subjects } = get();
    const newSubject = {
      id: Date.now(),
      name: "",
      color: getRandomColor(),
      // Create availability grid matching the current number of timings
      availability: initializeAvailability(timings.length, DYNAMIC_DAYS.length),
    };
    set({ subjects: [...subjects, newSubject] });
  },

  removeSubject: (id) => {
    set((state) => ({
      subjects: state.subjects.filter((subject) => subject.id !== id),
    }));
  },

  updateSubjectName: (id, newName) => {
    set((state) => ({
      subjects: state.subjects.map((subject) =>
        subject.id === id ? { ...subject, name: newName } : subject
      ),
    }));
  },

  sortSubjects: () => {
    set((state) => ({
      subjects: [...state.subjects].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }));
  },

  bulkImportSubjects: (newSubjectNames) => {
    const { timings, subjects } = get();
    const newSubjects = newSubjectNames.map((name) => ({
      id: Date.now() + Math.random(),
      name,
      color: getRandomColor(),
      availability: initializeAvailability(timings.length, DYNAMIC_DAYS.length),
    }));
    set({ subjects: [...subjects, ...newSubjects] });
  },

  updateSubjectAvailability: (id, newAvailability) => {
    set((state) => ({
      subjects: state.subjects.map((subject) =>
        subject.id === id
          ? { ...subject, availability: newAvailability }
          : subject
      ),
    }));
  },
}));

export default useTimetableStore;
