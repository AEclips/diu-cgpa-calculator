export const SAMPLE_SEMESTERS = [
  {
    id: 'sem-1',
    name: '1st Semester (Fall)',
    collapsed: false,
    courses: [
      { id: 'c-101', code: 'CSE 112', title: 'Structured Programming (C)', credits: 3.0, grade: 'A+', isRetake: false },
      { id: 'c-102', code: 'CSE 113', title: 'Structured Programming Lab', credits: 1.5, grade: 'A+', isRetake: false },
      { id: 'c-103', code: 'MAT 101', title: 'Mathematics I (Differential & Integral)', credits: 3.0, grade: 'A', isRetake: false },
      { id: 'c-104', code: 'PHY 101', title: 'Physics (Mechanics, Waves & Optics)', credits: 3.0, grade: 'A-', isRetake: false },
      { id: 'c-105', code: 'ENG 101', title: 'Basic Functional English', credits: 3.0, grade: 'A', isRetake: false }
    ]
  },
  {
    id: 'sem-2',
    name: '2nd Semester (Spring)',
    collapsed: false,
    courses: [
      { id: 'c-201', code: 'CSE 122', title: 'Discrete Mathematics', credits: 3.0, grade: 'A', isRetake: false },
      { id: 'c-202', code: 'CSE 123', title: 'Object Oriented Programming (Java)', credits: 3.0, grade: 'A+', isRetake: false },
      { id: 'c-203', code: 'CSE 124', title: 'Object Oriented Programming Lab', credits: 1.5, grade: 'A+', isRetake: false },
      { id: 'c-204', code: 'MAT 102', title: 'Mathematics II (Linear Algebra & Diff Eq)', credits: 3.0, grade: 'B+', isRetake: false },
      { id: 'c-205', code: 'EEE 101', title: 'Electrical Circuits & Electronics', credits: 3.0, grade: 'A-', isRetake: false }
    ]
  },
  {
    id: 'sem-3',
    name: '3rd Semester (Summer)',
    collapsed: false,
    courses: [
      { id: 'c-301', code: 'CSE 212', title: 'Data Structures', credits: 3.0, grade: 'A+', isRetake: false },
      { id: 'c-302', code: 'CSE 213', title: 'Data Structures Lab', credits: 1.5, grade: 'A+', isRetake: false },
      { id: 'c-303', code: 'CSE 214', title: 'Digital Logic Design', credits: 3.0, grade: 'A', isRetake: false },
      { id: 'c-304', code: 'STA 201', title: 'Basic Statistics & Probability', credits: 3.0, grade: 'A-', isRetake: false },
      { id: 'c-305', code: 'AOL 101', title: 'Art of Living', credits: 3.0, grade: 'A+', isRetake: false }
    ]
  },
  {
    id: 'sem-4',
    name: '4th Semester (Fall)',
    collapsed: false,
    courses: [
      { id: 'c-401', code: 'CSE 221', title: 'Algorithms Design and Analysis', credits: 3.0, grade: 'A+', isRetake: false },
      { id: 'c-402', code: 'CSE 222', title: 'Algorithms Lab', credits: 1.5, grade: 'A', isRetake: false },
      { id: 'c-403', code: 'CSE 223', title: 'Database Management Systems', credits: 3.0, grade: 'A', isRetake: false },
      { id: 'c-404', code: 'CSE 224', title: 'Database Management Systems Lab', credits: 1.5, grade: 'A+', isRetake: false }
    ]
  }
];

export const INITIAL_EMPTY_SEMESTERS = [
  {
    id: 'sem-1',
    name: '1st Semester',
    collapsed: false,
    courses: [
      { id: 'c-1', code: '', title: '', credits: 3.0, grade: '', isRetake: false }
    ]
  }
];
