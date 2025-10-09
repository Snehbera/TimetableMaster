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
      timetableNames: [
        { id: Date.now(), name: "Untitled", subdivisions: [""] },
      ],
      days: initialDays,
      periodsPerDay: 6,
      timings: [],
      subjects: [],
      faculty: [],
      rooms: [],

      // --- 1 Step:- Actions for timetables and subdivisions ---
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
          timetableNames:
            state.timetableNames.length > 1
              ? state.timetableNames.filter((tt) => tt.id !== id)
              : state.timetableNames,
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
                  subdivisions: tt.subdivisions.filter(
                    (_, i) => i !== subIndex
                  ), // ✅ allows 0 subdivisions
                }
              : tt
          ),
        })),

      setPeriodsPerDay: (newPeriods) => set({ periodsPerDay: newPeriods }),

      setTimings: (newTimings) => set({ timings: newTimings }),

      toggleDay: (dayName) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.name === dayName
              ? { ...day, isSchoolDay: !day.isSchoolDay }
              : day
          ),
        })),

      // --- 2 Step:- Actions for Subjects --- //
      addSubject: () => {
        set((state) => {
          const schoolDays = (state.days || []).filter((d) => d.isSchoolDay);
          const periodsOnly = (state.timings || []).filter(
            (t) => t.type === "period"
          );

          const newSubject = {
            id: Date.now(),
            name: "",
            shortName: "",
            color: getRandomColor(),
            // --- NEW DEFAULT VALUES ---
            lecturesPerWeek: 1,
            labsPerWeek: 0,
            isDoubleSlot: false,
            // --- END OF NEW VALUES ---
            availability: Array(periodsOnly.length)
              .fill(null)
              .map(() => Array(schoolDays.length).fill(true)),
          };
          return { subjects: [...state.subjects, newSubject] };
        });
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

      updateSubjectShortName: (id, newShortName) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, shortName: newShortName }
              : subject
          ),
        })),

      sortSubjects: () =>
        set((state) => ({
          subjects: [...state.subjects].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        })),

      bulkImportSubjects: (newSubjectsData) => {
        set((state) => {
          const { timings, days } = state;
          const schoolDays = (days || []).filter((d) => d.isSchoolDay);
          const periodsOnly = (timings || []).filter(
            (t) => t.type === "period"
          );

          const newSubjects = newSubjectsData.map((subData) => ({
            id: Date.now() + Math.random(),
            name: subData.name,
            shortName: subData.shortName,
            color: getRandomColor(),
            // --- NEW DEFAULT VALUES ---
            lecturesPerWeek: 1,
            labsPerWeek: 0,
            isDoubleSlot: false,
            // --- END OF NEW VALUES ---
            availability: Array(periodsOnly.length)
              .fill(null)
              .map(() => Array(schoolDays.length).fill(true)),
          }));

          return { subjects: [...state.subjects, ...newSubjects] };
        });
      },

      updateSubjectAvailability: (id, newAvailability) =>
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id
              ? { ...subject, availability: newAvailability }
              : subject
          ),
        })),

      // --- 3 Step:- Actions for Faculty --- //
      addFaculty: () => {
        set((state) => ({
          faculty: [
            ...state.faculty,
            {
              id: Date.now(),
              name: "",
              shortName: "",
              assignedSubjects: [], // Use an array to match the component
            },
          ],
        }));
      },

      removeFaculty: (id) => {
        set((state) => ({
          faculty: state.faculty.filter((f) => f.id !== id),
        }));
      },

      updateFacultyName: (id, newName) => {
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, name: newName } : f
          ),
        }));
      },

      updateFacultyShortName: (id, newShortName) => {
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === id ? { ...f, shortName: newShortName } : f
          ),
        }));
      },

      setAssignedSubjects: (facultyId, subjectIds) => {
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === facultyId ? { ...f, assignedSubjects: subjectIds } : f
          ),
        }));
      },

      sortFaculty: () => {
        set((state) => ({
          faculty: [...state.faculty].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }));
      },

      bulkImportFaculty: (newFacultyData) => {
        set((state) => {
          // Create a lookup map of subject short names to their IDs for efficiency
          const subjectShortNameToIdMap = new Map();
          state.subjects.forEach((subject) => {
            if (subject.shortName) {
              subjectShortNameToIdMap.set(
                subject.shortName.toLowerCase(),
                subject.id
              );
            }
          });

          const newFaculty = newFacultyData.map((facData) => {
            // Find subject IDs from the provided short names
            const assignedSubjectIds = (
              facData.assignedSubjectsShortNames || []
            )
              .map((shortName) =>
                subjectShortNameToIdMap.get(shortName.toLowerCase())
              )
              .filter((id) => id !== undefined); // Filter out any subjects that weren't found

            return {
              id: Date.now() + Math.random(),
              name: facData.name,
              shortName: facData.shortName,
              assignedSubjects: assignedSubjectIds,
            };
          });
          return { faculty: [...state.faculty, ...newFaculty] };
        });
      },

      setFacultyAvailability: (facultyId, availabilityGrid) => {
        set((state) => ({
          faculty: state.faculty.map((f) =>
            f.id === facultyId ? { ...f, availability: availabilityGrid } : f
          ),
        }));
      },
      // --- 4 Step:- Actions for Classes --- //
      updateSubjectValue: (subjectId, field, value) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, [field]: Math.max(0, value) } // Ensure value is not negative
              : s
          ),
        }));
      },

      toggleSubjectDoubleSlot: (subjectId) => {
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId ? { ...s, isDoubleSlot: !s.isDoubleSlot } : s
          ),
        }));
      },

      // --- 5 Step:- Actions for Rooms --- //
      initializeRooms: () => {
        set((state) => {
          const { timetableNames, subjects, rooms } = state;
          const newRooms = [];

          // 1. Process Classrooms for each main division
          (timetableNames || []).forEach((tt) => {
            const assignment = { timetableId: tt.id, subIndex: -1 };
            const existingRoom = rooms.find(
              (r) =>
                r.type === "classroom" &&
                JSON.stringify(r.homeRoomFor) === JSON.stringify(assignment)
            );

            if (existingRoom) {
              newRooms.push(existingRoom); // Keep existing room data
            } else {
              newRooms.push({
                id: `c_${tt.id}`, // Use a consistent ID
                name: "",
                type: "classroom",
                homeRoomFor: assignment,
              });
            }
          });

          // 2. Process Labs for each subject within each subdivision
          (timetableNames || []).forEach((tt) => {
            (tt.subdivisions || []).forEach((sub, index) => {
              if (sub) {
                // Find subjects that have labs
                (subjects || [])
                  .filter((s) => s.labsPerWeek > 0)
                  .forEach((subject) => {
                    const assignment = {
                      timetableId: tt.id,
                      subIndex: index,
                      subjectId: subject.id,
                    };
                    const existingLab = rooms.find(
                      (r) =>
                        r.type === "lab" &&
                        JSON.stringify(r.homeRoomFor) ===
                          JSON.stringify(assignment)
                    );

                    if (existingLab) {
                      newRooms.push(existingLab); // Keep existing lab data
                    } else {
                      newRooms.push({
                        id: `l_${tt.id}_${index}_${subject.id}`, // Use a consistent ID
                        name: "",
                        type: "lab",
                        homeRoomFor: assignment,
                      });
                    }
                  });
              }
            });
          });

          return { rooms: newRooms };
        });
      },

      updateRoomName: (roomId, newName) => {
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === roomId ? { ...r, name: newName } : r
          ),
        }));
      },
    }),
    {
      name: "timetable-storage",
    }
  )
);

export default useTimetableStore;
