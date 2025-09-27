import { create } from "zustand";
import { persist } from "zustand/middleware";

const DYNAMIC_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const initializeAvailability = (numPeriods, numDays) => {
  if (numPeriods <= 0 || numDays <= 0) return [];
  return Array(numPeriods)
    .fill(null)
    .map(() => Array(numDays).fill(true));
};

const initialDays = [
  { name: "Sun", fullName: "Sunday", isSchoolDay: false },
  { name: "Mon", fullName: "Monday", isSchoolDay: true },
  { name: "Tue", fullName: "Tuesday", isSchoolDay: true },
  { name: "Wed", fullName: "Wednesday", isSchoolDay: true },
  { name: "Thu", fullName: "Thursday", isSchoolDay: true },
  { name: "Fri", fullName: "Friday", isSchoolDay: true },
  { name: "Sat", fullName: "Saturday", isSchoolDay: false },
];

const useTimetableStore = create(
  persist(
    (set, get) => ({
      periodsPerDay: 6,
      timings: [],
      subjects: [],
      // --- NEW: Updated state structure for timetable names and subdivisions ---
      timetableNames: [{ id: Date.now(), name: "Untitled", subdivisions: [""] }],
      days: initialDays,

      setPeriodsPerDay: (newPeriods) => set({ periodsPerDay: newPeriods }),
      setTimings: (newTimings) => set({ timings: newTimings }),
      toggleDay: (dayName) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.name === dayName ? { ...day, isSchoolDay: !day.isSchoolDay } : day
          ),
        })),

      // --- NEW: Actions for managing timetables and subdivisions ---
      addTimetableName: () =>
        set((state) => ({
          timetableNames: [
            ...state.timetableNames,
            { id: Date.now(), name: "", subdivisions: [""] },
          ],
        })),
      updateTimetableName: (id, value) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === id ? { ...tt, name: value } : tt
          ),
        })),
      removeTimetableName: (id) =>
        set((state) => ({
          timetableNames: state.timetableNames.length > 1 ? state.timetableNames.filter((tt) => tt.id !== id) : state.timetableNames,
        })),
      addSubdivision: (timetableId) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? { ...tt, subdivisions: [...tt.subdivisions, ""] }
              : tt
          ),
        })),
      updateSubdivision: (timetableId, subIndex, value) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? {
                  ...tt,
                  subdivisions: tt.subdivisions.map((sub, i) =>
                    i === subIndex ? value : sub
                  ),
                }
              : tt
          ),
        })),
      removeSubdivision: (timetableId, subIndex) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? {
                  ...tt,
                  subdivisions: tt.subdivisions.length > 1 ? tt.subdivisions.filter((_, i) => i !== subIndex) : tt.subdivisions,
                }
              : tt
          ),
        })),

      addSubject: () => {
        const { timings, subjects } = get();
        const newSubject = {
          id: Date.now(),
          name: "",
          color: getRandomColor(),
          availability: initializeAvailability(timings.length, DYNAMIC_DAYS.length),
        };
        set({ subjects: [...subjects, newSubject] });
      },
      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((subject) => subject.id !== id),
        })),
      updateSubjectName: (id, newName) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, name: newName } : subject
          ),
        })),
      sortSubjects: () =>
        set((state) => ({
          subjects: [...state.subjects].sort((a, b) => a.name.localeCompare(b.name)),
        })),
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
      updateSubjectAvailability: (id, newAvailability) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, availability: newAvailability } : subject
          ),
        })),
    }),
    {
      name: "timetable-storage",
    }
  )
);

export default useTimetableStore;