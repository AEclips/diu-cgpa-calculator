export const GRADING_SCALES = {
  'bd_ugc': {
    id: 'bd_ugc',
    name: 'Bangladesh UGC / DIU (0.25 step scale)',
    maxGpa: 4.0,
    description: 'Uniform Grading Scheme used by UGC Bangladesh, DIU, BRAC, AIUB, AUST',
    grades: [
      { letter: 'A+', points: 4.00, minPercent: 80, label: 'Outstanding (80%+)' },
      { letter: 'A', points: 3.75, minPercent: 75, label: 'Excellent (75-79%)' },
      { letter: 'A-', points: 3.50, minPercent: 70, label: 'Very Good (70-74%)' },
      { letter: 'B+', points: 3.25, minPercent: 65, label: 'Good (65-69%)' },
      { letter: 'B', points: 3.00, minPercent: 60, label: 'Satisfactory (60-64%)' },
      { letter: 'B-', points: 2.75, minPercent: 55, label: 'Above Average (55-59%)' },
      { letter: 'C+', points: 2.50, minPercent: 50, label: 'Average (50-54%)' },
      { letter: 'C', points: 2.25, minPercent: 45, label: 'Below Average (45-49%)' },
      { letter: 'D', points: 2.00, minPercent: 40, label: 'Pass (40-44%)' },
      { letter: 'F', points: 0.00, minPercent: 0, label: 'Fail (Below 40%)' }
    ]
  },
  '4.0': {
    id: '4.0',
    name: 'Standard US 4.0 Scale (+/- 0.3 step)',
    maxGpa: 4.0,
    description: 'Standard 4.0 scale with +/- letter modifiers (A- 3.7, B+ 3.3, etc.)',
    grades: [
      { letter: 'A+', points: 4.0, minPercent: 90, label: 'Outstanding' },
      { letter: 'A', points: 4.0, minPercent: 85, label: 'Excellent' },
      { letter: 'A-', points: 3.7, minPercent: 80, label: 'Very Good' },
      { letter: 'B+', points: 3.3, minPercent: 75, label: 'Good' },
      { letter: 'B', points: 3.0, minPercent: 70, label: 'Above Average' },
      { letter: 'B-', points: 2.7, minPercent: 65, label: 'Average' },
      { letter: 'C+', points: 2.3, minPercent: 60, label: 'Satisfactory' },
      { letter: 'C', points: 2.0, minPercent: 55, label: 'Pass' },
      { letter: 'C-', points: 1.7, minPercent: 50, label: 'Marginal Pass' },
      { letter: 'D+', points: 1.3, minPercent: 45, label: 'Poor' },
      { letter: 'D', points: 1.0, minPercent: 40, label: 'Barely Pass' },
      { letter: 'F', points: 0.0, minPercent: 0, label: 'Fail' }
    ]
  },
  '4.3': {
    id: '4.3',
    name: '4.3 Scale (with A+ = 4.3)',
    maxGpa: 4.3,
    description: 'Used by universities offering extra honors distinction for A+',
    grades: [
      { letter: 'A+', points: 4.3, minPercent: 95, label: 'High Honors' },
      { letter: 'A', points: 4.0, minPercent: 85, label: 'Excellent' },
      { letter: 'A-', points: 3.7, minPercent: 80, label: 'Very Good' },
      { letter: 'B+', points: 3.3, minPercent: 75, label: 'Good' },
      { letter: 'B', points: 3.0, minPercent: 70, label: 'Above Average' },
      { letter: 'B-', points: 2.7, minPercent: 65, label: 'Average' },
      { letter: 'C+', points: 2.3, minPercent: 60, label: 'Satisfactory' },
      { letter: 'C', points: 2.0, minPercent: 55, label: 'Pass' },
      { letter: 'C-', points: 1.7, minPercent: 50, label: 'Marginal Pass' },
      { letter: 'D+', points: 1.3, minPercent: 45, label: 'Poor' },
      { letter: 'D', points: 1.0, minPercent: 40, label: 'Barely Pass' },
      { letter: 'F', points: 0.0, minPercent: 0, label: 'Fail' }
    ]
  },
  '5.0': {
    id: '5.0',
    name: '5.0 Scale (Singapore / Nigeria / Africa / UK align)',
    maxGpa: 5.0,
    description: 'Common in Singapore (NTU/NUS), Nigerian universities, and polytechnics',
    grades: [
      { letter: 'A', points: 5.0, minPercent: 70, label: 'First Class / Excellent' },
      { letter: 'B', points: 4.0, minPercent: 60, label: 'Second Class Upper / Very Good' },
      { letter: 'C', points: 3.0, minPercent: 50, label: 'Second Class Lower / Good' },
      { letter: 'D', points: 2.0, minPercent: 45, label: 'Third Class / Fair' },
      { letter: 'E', points: 1.0, minPercent: 40, label: 'Pass' },
      { letter: 'F', points: 0.0, minPercent: 0, label: 'Fail' }
    ]
  },
  '10.0': {
    id: '10.0',
    name: '10.0 Scale (Indian UGC / AICTE / VTU / Anna Univ)',
    maxGpa: 10.0,
    description: 'Standard 10-point SGPA/CGPA with percentage multiplier (CGPA × 9.5)',
    hasPercentageFormula: true,
    percentageMultiplier: 9.5,
    grades: [
      { letter: 'O', points: 10.0, minPercent: 90, label: 'Outstanding' },
      { letter: 'A+', points: 9.0, minPercent: 80, label: 'Excellent' },
      { letter: 'A', points: 8.0, minPercent: 70, label: 'Very Good' },
      { letter: 'B+', points: 7.0, minPercent: 60, label: 'Good' },
      { letter: 'B', points: 6.0, minPercent: 50, label: 'Above Average' },
      { letter: 'C', points: 5.0, minPercent: 45, label: 'Average' },
      { letter: 'P', points: 4.0, minPercent: 40, label: 'Pass' },
      { letter: 'F', points: 0.0, minPercent: 0, label: 'Fail' },
      { letter: 'Ab', points: 0.0, minPercent: 0, label: 'Absent' }
    ]
  }
};

export const DEFAULT_SCALE_ID = 'bd_ugc';

export const ACADEMIC_STANDINGS = {
  'bd_ugc': [
    { min: 3.80, label: "Chancellor's Award / Highest Honors", color: 'emerald', badge: '🏆 Chancellor\'s Award' },
    { min: 3.65, label: "Dean's Honor List / High Distinction", color: 'green', badge: '🎖️ Dean\'s List' },
    { min: 3.00, label: 'First Class / Good Standing', color: 'blue', badge: '⭐ First Class' },
    { min: 2.25, label: 'Second Class / Satisfactory', color: 'amber', badge: '✔️ Second Class' },
    { min: 0.00, label: 'Academic Warning / Probation Risk', color: 'rose', badge: '⚠️ Academic Probation' }
  ],
  '4.0': [
    { min: 3.8, label: "Summa Cum Laude / Dean's Highest Honors", color: 'emerald', badge: '🏆 Highest Honors' },
    { min: 3.5, label: "Magna Cum Laude / Dean's List", color: 'green', badge: '🎖️ Dean\'s List' },
    { min: 3.0, label: 'Cum Laude / Good Standing', color: 'blue', badge: '⭐ Good Standing' },
    { min: 2.0, label: 'Satisfactory Standing', color: 'amber', badge: '✔️ Satisfactory' },
    { min: 0.0, label: 'Academic Warning / Probation', color: 'rose', badge: '⚠️ Academic Probation' }
  ],
  '4.3': [
    { min: 4.0, label: 'High Honors / Presidential Scholar', color: 'emerald', badge: '🏆 High Honors' },
    { min: 3.7, label: 'Dean’s Honor List', color: 'green', badge: '🎖️ Dean\'s List' },
    { min: 3.0, label: 'Good Academic Standing', color: 'blue', badge: '⭐ Good Standing' },
    { min: 2.0, label: 'Satisfactory', color: 'amber', badge: '✔️ Satisfactory' },
    { min: 0.0, label: 'Academic Probation', color: 'rose', badge: '⚠️ Academic Probation' }
  ],
  '5.0': [
    { min: 4.5, label: 'First Class Honours (Distinction)', color: 'emerald', badge: '🏆 First Class (Distinction)' },
    { min: 3.5, label: 'Second Class Honours (Upper Division)', color: 'green', badge: '🎖️ Second Class Upper' },
    { min: 2.4, label: 'Second Class Honours (Lower Division)', color: 'blue', badge: '⭐ Second Class Lower' },
    { min: 1.5, label: 'Third Class Honours', color: 'amber', badge: '✔️ Third Class' },
    { min: 0.0, label: 'Pass / Probation', color: 'rose', badge: '⚠️ Probation' }
  ],
  '10.0': [
    { min: 9.0, label: 'First Class with Distinction (Outstanding)', color: 'emerald', badge: '🏆 Outstanding / Distinction' },
    { min: 7.5, label: 'First Class', color: 'green', badge: '🎖️ First Class' },
    { min: 6.0, label: 'Second Class (Higher)', color: 'blue', badge: '⭐ Second Class' },
    { min: 5.0, label: 'Pass Class', color: 'amber', badge: '✔️ Pass Class' },
    { min: 0.0, label: 'Backlog / Academic Warning', color: 'rose', badge: '⚠️ Backlog Warning' }
  ]
};
