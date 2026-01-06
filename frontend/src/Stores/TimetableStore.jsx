import { create } from "zustand";
import { persist } from "zustand/middleware";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const initialWorkingDays = {
  Sun: false,
  Mon: true,
  Tue: true,
  Wed: true,
  Thu: true,
  Fri: true,
  Sat: false,
};

const useTimetableStore = create(
  persist(
    (set, get) => ({
      // --------------------------------------------------------
      // STATE
      // --------------------------------------------------------
      timetableNames: [
        {
          id: "TT-" + Date.now(),
          name: "Untitled",
          subdivisions: [{ id: "SUB-" + Date.now(), name: "" }],
          workingDays: { ...initialWorkingDays },
          semester: "",
        },
      ],
      semester: "",
      periodsPerDay: 6,
      timings: [],
      subjects: [],
      weeklyTotals: {
        totalLectureHours: 0,
        totalLabHours: 0,
        grandTotalHours: 0,
      },
      faculty: [],
      rooms: [],

      // --------------------------------------------------------
      // CALCULATIONS
      // --------------------------------------------------------
      calculateWeeklyTotals: () =>
        set((state) => {
          const totals = state.subjects.reduce(
            (acc, subject) => {
              const lectureHours = subject.isDoubleSlot
                ? subject.lecturesPerWeek * 2
                : subject.lecturesPerWeek;
              const labHours = subject.labsPerWeek * 2;

              acc.totalLectureHours += lectureHours;
              acc.totalLabHours += labHours;
              return acc;
            },
            { totalLectureHours: 0, totalLabHours: 0 }
          );

          const grandTotalHours =
            totals.totalLectureHours + totals.totalLabHours;

          return {
            weeklyTotals: {
              totalLectureHours: totals.totalLectureHours,
              totalLabHours: totals.totalLabHours,
              grandTotalHours,
            },
          };
        }),

      // --------------------------------------------------------
      // TIMETABLE MANAGEMENT (ID BASED)
      // --------------------------------------------------------
      addTimetableName: () =>
        set((state) => ({
          timetableNames: [
            ...state.timetableNames,
            {
              id: "TT-" + Date.now(),
              name: "",
              subdivisions: [{ id: "SUB-" + Date.now(), name: "" }],
              workingDays: { ...initialWorkingDays },
              semester: "",
            },
          ],
        })),

      updateTimetableName: (id, value) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === id ? { ...tt, name: value } : tt
          ),
        })),

      updateTimetableSemester: (id, value) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === id ? { ...tt, semester: value } : tt
          ),
        })),

      removeTimetableName: (id) =>
        set((state) => ({
          timetableNames:
            state.timetableNames.length > 1
              ? state.timetableNames.filter((tt) => tt.id !== id)
              : state.timetableNames,
        })),

      toggleWorkingDayForTimetable: (id, dayName) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === id
              ? {
                ...tt,
                workingDays: {
                  ...tt.workingDays,
                  [dayName]: !tt.workingDays[dayName],
                },
              }
              : tt
          ),
        })),

      // --------------------------------------------------------
      // SUBDIVISION MANAGEMENT (ID BASED)
      // --------------------------------------------------------
      addSubdivision: (timetableId) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? {
                ...tt,
                subdivisions: [
                  ...tt.subdivisions,
                  { id: "SUB-" + Date.now(), name: "" },
                ],
              }
              : tt
          ),
        })),

      updateSubdivision: (timetableId, subId, value) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? {
                ...tt,
                subdivisions: tt.subdivisions.map((sub) =>
                  sub.id === subId ? { ...sub, name: value } : sub
                ),
              }
              : tt
          ),
        })),

      removeSubdivision: (timetableId, subId) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt) =>
            tt.id === timetableId
              ? {
                ...tt,
                subdivisions: tt.subdivisions.filter(
                  (sub) => sub.id !== subId
                ),
              }
              : tt
          ),
        })),

      // --------------------------------------------------------
      // GLOBAL SETTINGS
      // --------------------------------------------------------
      setSemester: (value) => set({ semester: value }),
      setPeriodsPerDay: (newPeriods) => set({ periodsPerDay: newPeriods }),
      setTimings: (newTimings) => set({ timings: newTimings }),

      // --------------------------------------------------------
      // SUBJECTS MANAGEMENT (ID BASED)
      // --------------------------------------------------------
      addSubject: () => {
        set((state) => ({
          subjects: [
            ...state.subjects,
            {
              id: "SUBJ-" + Date.now(),
              name: "",
              shortName: "",
              color: getRandomColor(),
              lecturesPerWeek: 1,
              labsPerWeek: 0,
              isDoubleSlot: false,
            },
          ],
        }));
        get().calculateWeeklyTotals();
      },

      removeSubject: (id) => {
        set((state) => ({
          subjects: state.subjects.filter((sub) => sub.id !== id),
        }));
        get().calculateWeeklyTotals();
      },

      updateSubjectName: (id, newName) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, name: newName } : subject
          ),
        })),

      updateSubjectShortName: (id, newShortName) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, shortName: newShortName }
              : subject
          ),
        })),

      updateSubjectValue: (id, field, value) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, [field]: Math.max(0, value) } : s
          ),
        }));
        get().calculateWeeklyTotals();
      },

      toggleSubjectDoubleSlot: (id) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, isDoubleSlot: !s.isDoubleSlot } : s
          ),
        }));
        get().calculateWeeklyTotals();
      },

      sortSubjects: () =>
        set((state) => ({
          subjects: [...state.subjects].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        })),

      bulkImportSubjects: (newSubjectsData) => {
        set((state) => {
          const newSubjects = newSubjectsData.map((subData) => ({
            id: "SUBJ-" + Date.now() + Math.random(),
            name: subData.name,
            shortName: subData.shortName,
            color: getRandomColor(),
            lecturesPerWeek: 1,
            labsPerWeek: 0,
            isDoubleSlot: false,
          }));
          return { subjects: [...state.subjects, ...newSubjects] };
        });
        get().calculateWeeklyTotals();
      },

      // 🔥 THIS FUNCTION WAS MISSING, CAUSING THE DONE BUTTON TO FAIL 🔥
      updateSubjectAvailability: (id, availabilityGrid) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, availability: availabilityGrid } : s
          ),
        })),

      // --------------------------------------------------------
      // FACULTY MANAGEMENT (ID BASED)
      // --------------------------------------------------------
      addFaculty: () =>
        set((state) => ({
          faculty: [
            ...state.faculty,
            {
              id: "FAC-" + Date.now(),
              name: "",
              shortName: "",
              assignedSubjects: [],
            },
          ],
        })),

      removeFaculty: (id) =>
        set((state) => ({
          faculty: state.faculty.filter((f) => f.id !== id),
        })),

      updateFacultyName: (id, newName) =>
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, name: newName } : f
          ),
        })),

      updateFacultyShortName: (id, newShortName) =>
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, shortName: newShortName } : f
          ),
        })),

      setAssignedSubjects: (facultyId, subjectNames) =>
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === facultyId
              ? { ...f, assignedSubjects: subjectNames }
              : f
          ),
        })),

      setFacultyAvailability: (id, availabilityGrid) =>
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, availability: availabilityGrid } : f
          ),
        })),

      sortFaculty: () =>
        set((state) => ({
          faculty: [...state.faculty].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        })),

      bulkImportFaculty: (newFacultyData) =>
        set((state) => ({
          faculty: newFacultyData.map((facData) => ({
            id: "FAC-" + Date.now() + Math.random(),
            name: facData.name,
            shortName: facData.shortName,
            assignedSubjects: facData.assignedSubjectsShortNames || [],
          })),
        })),

      // -----------------------------------------------------------------------
      //  🔥 HERE IS THE FIX: UPDATED initializeRooms FUNCTION 🔥
      // -----------------------------------------------------------------------
      initializeRooms: () =>
        set((state) => {
          const newRooms = [];

          // Helper to check if a room already exists to prevent duplicates
          // We create a "signature" key for each room
          const existingSignatures = new Set(
            state.rooms.map((r) => {
              if (r.type === "classroom") return `CLASS-${r.homeRoomFor.timetableId}`;
              if (r.type === "lab") return `LAB-${r.homeRoomFor.timetableId}-${r.homeRoomFor.subdivisionId}-${r.homeRoomFor.subjectId}`;
              return r.id;
            })
          );

          // 1. Create Classrooms (One per Timetable/Division)
          state.timetableNames.forEach((tt) => {
            const classSignature = `CLASS-${tt.id}`;

            if (!existingSignatures.has(classSignature)) {
              newRooms.push({
                id: "ROOM-C-" + Date.now() + Math.random(),
                name: "",
                type: "classroom",
                homeRoomFor: {
                  timetableId: tt.id,
                  subdivisionId: null, // Null means it belongs to the whole division
                },
              });
            }

            // 2. Create Lab Rooms (One per Subdivision per Subject-with-Labs)
            const subjectsWithLabs = state.subjects.filter((s) => s.labsPerWeek > 0);

            tt.subdivisions.forEach((sub) => {
              subjectsWithLabs.forEach((subj) => {
                const labSignature = `LAB-${tt.id}-${sub.id}-${subj.id}`;

                if (!existingSignatures.has(labSignature)) {
                  newRooms.push({
                    id: "ROOM-L-" + Date.now() + Math.random(),
                    name: "", // User will fill this in
                    type: "lab",
                    homeRoomFor: {
                      timetableId: tt.id,
                      subdivisionId: sub.id,
                      subjectId: subj.id, // We must link the lab room to a specific subject
                    },
                  });
                }
              });
            });
          });

          return { rooms: [...state.rooms, ...newRooms] };
        }),

      updateRoomName: (id, newName) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === id ? { ...room, name: newName } : room
          ),
        })),

      removeRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
        })),
    }),
    { name: "timetable-storage" }
  )
);

export default useTimetableStore;