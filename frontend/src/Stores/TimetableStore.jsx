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

// This initial configuration will be used for new timetables
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
      timetableNames: [
        {
          name: "Untitled",
          subdivisions: [""],
          workingDays: { ...initialWorkingDays },
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

      // --- ACTION TO CALCULATE TOTALS (MODIFIED) ---
      calculateWeeklyTotals: () =>
        set((state) => {
          const totals = state.subjects.reduce(
            (acc, subject) => {
              // Calculate lecture hours based on isDoubleSlot
              const lectureHours = subject.isDoubleSlot
                ? subject.lecturesPerWeek * 2
                : subject.lecturesPerWeek;
              // Calculate lab hours
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

      // --- 1 Step:- Actions for timetables and subdivisions ---
      addTimetableName: () =>
        set((state) => ({
          timetableNames: [
            ...state.timetableNames,
            {
              name: "",
              subdivisions: [""],
              workingDays: { ...initialWorkingDays },
            },
          ],
        })),
      updateTimetableName: (
        index,
        value // CHANGED: from id to index
      ) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) =>
            i === index ? { ...tt, name: value } : tt
          ),
        })),
      updateTimetableSemester: (
        index,
        value // CHANGED: from id to index
      ) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) =>
            i === index ? { ...tt, semester: value } : tt
          ),
        })),
      removeTimetableName: (
        index // CHANGED: from id to index
      ) =>
        set((state) => ({
          timetableNames:
            state.timetableNames.length > 1
              ? state.timetableNames.filter((_, i) => i !== index)
              : state.timetableNames,
        })),
      // 🔁 CHANGED: Now uses timetableIndex
      addSubdivision: (timetableIndex) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) =>
            i === timetableIndex
              ? { ...tt, subdivisions: [...tt.subdivisions, ""] }
              : tt
          ),
        })),
      updateSubdivision: (
        timetableIndex,
        subIndex,
        value // CHANGED
      ) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) =>
            i === timetableIndex
              ? {
                  ...tt,
                  subdivisions: tt.subdivisions.map((sub, j) =>
                    j === subIndex ? value : sub
                  ),
                }
              : tt
          ),
        })),
      removeSubdivision: (
        timetableIndex,
        subIndex // CHANGED
      ) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) =>
            i === timetableIndex
              ? {
                  ...tt,
                  subdivisions: tt.subdivisions.filter(
                    (_, j) => j !== subIndex
                  ),
                }
              : tt
          ),
        })),

      setSemester: (value) => set({ semester: value }),

      setPeriodsPerDay: (newPeriods) => set({ periodsPerDay: newPeriods }),

      setTimings: (newTimings) => set({ timings: newTimings }),

      // --- Action to toggle working days per timetable ---
      toggleWorkingDayForTimetable: (
        timetableIndex,
        dayName // CHANGED
      ) =>
        set((state) => ({
          timetableNames: state.timetableNames.map((tt, i) => {
            if (i === timetableIndex) {
              const currentWorkingDays = tt.workingDays || initialWorkingDays;
              return {
                ...tt,
                workingDays: {
                  ...currentWorkingDays,
                  [dayName]: !currentWorkingDays[dayName],
                },
              };
            }
            return tt;
          }),
        })),
      // --- 2 Step:- Actions for Subjects (MODIFIED) --- //
      addSubject: () => {
        set((state) => {
          const newSubject = {
            name: "",
            shortName: "",
            color: getRandomColor(),
            lecturesPerWeek: 1,
            labsPerWeek: 0,
            isDoubleSlot: false,
          };
          return { subjects: [...state.subjects, newSubject] };
        });
        get().calculateWeeklyTotals(); // Trigger calculation
      },

      removeSubject: (index) => {
        // CHANGED
        set((state) => ({
          subjects: state.subjects.filter((_, i) => i !== index),
        }));
        get().calculateWeeklyTotals();
      },
      updateSubjectName: (
        index,
        newName // CHANGED
      ) =>
        set((state) => ({
          subjects: state.subjects.map((subject, i) =>
            i === index ? { ...subject, name: newName } : subject
          ),
        })),
      updateSubjectShortName: (
        index,
        newShortName // CHANGED
      ) =>
        set((state) => ({
          subjects: state.subjects.map((subject, i) =>
            i === index ? { ...subject, shortName: newShortName } : subject
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
          const newSubjects = newSubjectsData.map((subData) => ({
            id: Date.now() + Math.random(),
            name: subData.name,
            shortName: subData.shortName,
            color: getRandomColor(),
            lecturesPerWeek: 1,
            labsPerWeek: 0,
            isDoubleSlot: false,
          }));
          return { subjects: [...state.subjects, ...newSubjects] };
        });
        get().calculateWeeklyTotals(); // Trigger calculation
      },

      // 🔁 CHANGED: Now uses index instead of ID
      updateSubjectAvailability: (index, newAvailability) =>
        set((state) => ({
          subjects: state.subjects.map((subject, i) =>
            i === index
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
              name: "",
              shortName: "",
              assignedSubjects: [], // Use an array to match the component
            },
          ],
        }));
      },

      removeFaculty: (index) => {
        // CHANGED
        set((state) => ({
          faculty: state.faculty.filter((_, i) => i !== index),
        }));
      },
      updateFacultyName: (index, newName) => {
        // CHANGED
        set((state) => ({
          faculty: state.faculty.map((f, i) =>
            i === index ? { ...f, name: newName } : f
          ),
        }));
      },
      updateFacultyShortName: (index, newShortName) => {
        // CHANGED
        set((state) => ({
          faculty: state.faculty.map((f, i) =>
            i === index ? { ...f, shortName: newShortName } : f
          ),
        }));
      },
      setAssignedSubjects: (facultyIndex, subjectNames) => {
        // CHANGED & WARNING
        set((state) => ({
          faculty: state.faculty.map((f, i) =>
            i === facultyIndex ? { ...f, assignedSubjects: subjectNames } : f
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

          const newFaculty = newFacultyData.map((facData) => ({
            // - REMOVED 'id'
            name: facData.name,
            shortName: facData.shortName,
            // Assuming you assign by name/shortname now
            assignedSubjects: facData.assignedSubjectsShortNames || [],
          }));
          return { faculty: [...state.faculty, ...newFaculty] };
        });
      },

      // 🔁 CHANGED: Now uses index instead of ID
      setFacultyAvailability: (facultyIndex, availabilityGrid) => {
        set((state) => ({
          faculty: state.faculty.map((f, i) =>
            i === facultyIndex ? { ...f, availability: availabilityGrid } : f
          ),
        }));
      },

      // 4----
      // 🔁 CHANGED: Now uses index instead of ID
      updateSubjectValue: (subjectIndex, field, value) => {
        set((state) => ({
          subjects: state.subjects.map((s, i) =>
            i === subjectIndex ? { ...s, [field]: Math.max(0, value) } : s
          ),
        }));
        get().calculateWeeklyTotals();
      },

      // 🔁 CHANGED: Now uses index instead of ID
      toggleSubjectDoubleSlot: (subjectIndex) => {
        set((state) => ({
          subjects: state.subjects.map((s, i) =>
            i === subjectIndex ? { ...s, isDoubleSlot: !s.isDoubleSlot } : s
          ),
        }));
      },

      // --- 5 Step:- Actions for Rooms --- //
      initializeRooms: () => {
        set((state) => {
          const { timetableNames, subjects, rooms } = state;
          const newRooms = [];

          (timetableNames || []).forEach((tt, ttIndex) => {
            const assignment = { timetableIndex: ttIndex, subIndex: -1 };
            const existingRoom = rooms.find(
              (r) =>
                JSON.stringify(r.homeRoomFor) === JSON.stringify(assignment)
            );
            if (!existingRoom) {
              newRooms.push({
                // - REMOVED 'id'
                name: "",
                type: "classroom",
                homeRoomFor: assignment,
              });
            }
          });

          (timetableNames || []).forEach((tt, ttIndex) => {
            (tt.subdivisions || []).forEach((sub, subIndex) => {
              if (sub) {
                (subjects || [])
                  .filter((s) => s.labsPerWeek > 0)
                  .forEach((subject, subjectIndex) => {
                    const assignment = {
                      timetableIndex: ttIndex,
                      subIndex: subIndex,
                      subjectIndex: subjectIndex, // Use index
                    };
                    const existingLab = rooms.find(
                      (r) =>
                        JSON.stringify(r.homeRoomFor) ===
                        JSON.stringify(assignment)
                    );
                    if (!existingLab) {
                      newRooms.push({
                        // - REMOVED 'id'
                        name: "",
                        type: "lab",
                        homeRoomFor: assignment,
                      });
                    }
                  });
              }
            });
          });

          // Combine existing and new, ensuring no duplicates
          const allRooms = [...rooms, ...newRooms];
          const uniqueRooms = allRooms.filter(
            (v, i, a) =>
              a.findIndex(
                (t) =>
                  JSON.stringify(t.homeRoomFor) ===
                  JSON.stringify(v.homeRoomFor)
              ) === i
          );
          return { rooms: uniqueRooms };
        });
      },

      // 🔁 CHANGED: Now uses index instead of ID
      updateRoomName: (roomId, newName) =>
        set((state) => ({
          rooms: state.rooms.map((room) => {
            // If this is the room we want to update...
            if (room.id === roomId) {
              // ...return a new object with the updated name.
              return { ...room, name: newName };
            }
            // Otherwise, return the original, unchanged room.
            return room;
          }),
        })),
    }),
    {
      name: "timetable-storage",
    }
  )
);

export default useTimetableStore;
