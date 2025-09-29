const generateJsonForBackend = (state) => {
  // Create helper maps for quick lookups by ID
  const divisionIdToName = Object.fromEntries(
    state.timetableNames.map((tt) => [tt.id, tt.name])
  );
  
  // --- 1. SETTINGS ---
  const settings = {
    working_days: state.days.filter((d) => d.isSchoolDay).map((d) => d.fullName),
    periods_per_day: state.timings
      .filter((t) => t.type === "period")
      .map((t) => `${t.startTime}-${t.endTime}`), // Assumes timings have startTime and endTime
    breaks_after_period: state.timings.reduce((acc, timing, index) => {
      if (timing.type === "break") {
        const precedingPeriods = state.timings
          .slice(0, index)
          .filter((t) => t.type === "period").length;
        if (precedingPeriods > 0) {
          acc[precedingPeriods] = `${timing.name} (${timing.startTime}-${timing.endTime})`;
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
        off_day: tt.offDay || null, // Assumes you add 'offDay' to your timetableNames objects
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

  // --- 5. FACULTY ASSIGNMENTS (Correctly Implemented) ---
  const faculty_assignments = {};

  // For each subject...
  state.subjects.forEach((subject) => {
    if (!subject.shortName) return; // Skip if no short name
    
    const assignmentsForSubject = {};
    
    // Find which faculty teaches it and in which division
    state.faculty.forEach((fac) => {
      // Check if this faculty has an assignment for the current subject
      const assignedDivisionIds = fac.assignments?.[subject.id];
      
      if (assignedDivisionIds && fac.shortName) {
        // If yes, add an entry for each division they teach it in
        assignedDivisionIds.forEach((divId) => {
          const divisionName = divisionIdToName[divId];
          if (divisionName) {
            assignmentsForSubject[divisionName] = fac.shortName;
          }
        });
      }
    });

    if (Object.keys(assignmentsForSubject).length > 0) {
      faculty_assignments[subject.shortName] = assignmentsForSubject;
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