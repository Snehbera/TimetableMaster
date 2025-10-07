const generateJsonForBackend = (state) => {
  // --- Helper maps for quick lookups ---
  const subjectIdToShortName = Object.fromEntries(
    state.subjects.map((s) => [s.id, s.shortName])
  );

  // --- 1. SETTINGS ---
   const settings = {
    working_days: state.days.filter((d) => d.isSchoolDay).map((d) => d.fullName),
    periods_per_day: state.timings
      .filter((t) => t.type === "period")
      .map((t) => `${t.startTime}-${t.endTime}`),
    breaks_after_period: state.timings.reduce((acc, timing, index) => {
      if (timing.type === "break") {
        const precedingPeriods = state.timings.slice(0, index).filter((t) => t.type === "period").length;
        if (precedingPeriods > 0) {
          acc[precedingPeriods] = `${timing.startTime}-${timing.endTime}`;
        }
      }
      return acc;
    }, {}),
  };

  // --- 2. DIVISIONS ---
    const divisions = Object.fromEntries(
    state.timetableNames.map((tt) => [
      tt.name,
      {
        partitions: tt.subdivisions,
      },
    ])
  );

  // --- 3. SUBJECTS ---
  const subjects = Object.fromEntries(
    state.subjects.map((s) => [
      s.shortName,
      {
        name: s.name,
        lectures: s.lecturesPerWeek,
        labs: s.labsPerWeek,
      },
    ])
  );

  // --- 4. FACULTY ---
  const faculty = Object.fromEntries(
    state.faculty.map((f) => [f.shortName, { name: f.name }])
  );

  // --- 5. FACULTY ASSIGNMENTS (✅ CORRECTED LOGIC) ---
  // This logic now works with your simplified `assignedSubjects` array.
  const faculty_assignments = {};
  state.faculty.forEach((fac) => {
    if (fac.shortName && fac.assignedSubjects) {
      fac.assignedSubjects.forEach((subjectId) => {
        const subjectShortName = subjectIdToShortName[subjectId];
        if (subjectShortName) {
          // If this subject isn't in our map yet, add it with an empty array
          if (!faculty_assignments[subjectShortName]) {
            faculty_assignments[subjectShortName] = [];
          }
          // Add the current faculty member's short name to the list for this subject
          faculty_assignments[subjectShortName].push(fac.shortName);
        }
      });
    }
  });


  return {
    settings,
    divisions,
    subjects,
    faculty,
    faculty_assignments,
  };
};

export default generateJsonForBackend;
