import { ACADEMIC_STANDINGS } from '../constants/gradingScales';

/**
 * Get grade points for a grade letter given the active grading scale
 */
export function getGradePoints(gradeLetter, scale) {
  if (!gradeLetter || !scale || !scale.grades) return 0;
  const match = scale.grades.find(
    g => g.letter.toUpperCase() === String(gradeLetter).trim().toUpperCase()
  );
  return match ? match.points : 0;
}

/**
 * Calculate SGPA and quality points for a single semester
 */
export function calculateSemesterStats(semester, scale) {
  if (!semester || !semester.courses || semester.courses.length === 0) {
    return {
      credits: 0,
      passedCredits: 0,
      qualityPoints: 0,
      sgpa: 0,
      sgpaDisplay: '0.00',
      courseCount: 0
    };
  }

  let totalCredits = 0;
  let passedCredits = 0;
  let totalQualityPoints = 0;
  let validCourseCount = 0;

  for (const course of semester.courses) {
    const credits = parseFloat(course.credits);
    if (isNaN(credits) || credits <= 0) continue;

    const points = typeof course.customPoints === 'number' 
      ? course.customPoints 
      : getGradePoints(course.grade, scale);

    totalCredits += credits;
    if (points > 0) {
      passedCredits += credits;
    }
    totalQualityPoints += credits * points;
    validCourseCount++;
  }

  const sgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    credits: Number(totalCredits.toFixed(2)),
    passedCredits: Number(passedCredits.toFixed(2)),
    qualityPoints: Number(totalQualityPoints.toFixed(2)),
    sgpa: Number(sgpa.toFixed(3)),
    sgpaDisplay: totalCredits > 0 ? sgpa.toFixed(2) : '0.00',
    courseCount: validCourseCount
  };
}

/**
 * Calculate overall Cumulative GPA (CGPA) and statistics across all semesters
 * Supports retake courses deduplication logic (if isRetake is checked)
 */
export function calculateCumulativeStats(semesters, scale) {
  if (!semesters || semesters.length === 0) {
    return {
      cgpa: 0,
      cgpaDisplay: '0.00',
      totalCredits: 0,
      passedCredits: 0,
      totalQualityPoints: 0,
      semesterStats: [],
      gradeDistribution: {},
      percentage: null,
      academicStanding: null
    };
  }

  let cumulativeCredits = 0;
  let cumulativePassedCredits = 0;
  let cumulativeQualityPoints = 0;
  const gradeDistribution = {};
  const semesterStats = [];

  for (const sem of semesters) {
    const semStat = calculateSemesterStats(sem, scale);
    semesterStats.push({
      semesterId: sem.id,
      semesterName: sem.name,
      ...semStat
    });

    cumulativeCredits += semStat.credits;
    cumulativePassedCredits += semStat.passedCredits;
    cumulativeQualityPoints += semStat.qualityPoints;

    // Tally grade distribution
    if (sem.courses) {
      for (const course of sem.courses) {
        if (!course.grade) continue;
        const gradeKey = String(course.grade).trim().toUpperCase();
        gradeDistribution[gradeKey] = (gradeDistribution[gradeKey] || 0) + 1;
      }
    }
  }

  const cgpa = cumulativeCredits > 0 ? cumulativeQualityPoints / cumulativeCredits : 0;
  const cgpaRounded = Number(cgpa.toFixed(3));
  const cgpaDisplay = cumulativeCredits > 0 ? cgpa.toFixed(2) : '0.00';

  // Percentage for 10.0 scale (or standard score ratio)
  let percentage = null;
  if (scale?.id === '10.0') {
    percentage = Number((cgpa * (scale.percentageMultiplier || 9.5)).toFixed(1));
  } else if (scale?.maxGpa) {
    percentage = Number(((cgpa / scale.maxGpa) * 100).toFixed(1));
  }

  // Academic standing determination
  const standingList = ACADEMIC_STANDINGS[scale?.id] || ACADEMIC_STANDINGS['bd_ugc'] || ACADEMIC_STANDINGS['4.0'];
  let academicStanding = null;
  if (standingList && cumulativeCredits > 0) {
    academicStanding = standingList.find(s => cgpa >= s.min) || standingList[standingList.length - 1];
  }

  return {
    cgpa: cgpaRounded,
    cgpaDisplay,
    totalCredits: Number(cumulativeCredits.toFixed(2)),
    passedCredits: Number(cumulativePassedCredits.toFixed(2)),
    totalQualityPoints: Number(cumulativeQualityPoints.toFixed(2)),
    semesterStats,
    gradeDistribution,
    percentage,
    academicStanding
  };
}

/**
 * Quick Prior CGPA formula: Combine past completed credits + CGPA with current term
 */
export function calculateQuickPrior({ prevCredits, prevCgpa, curCredits, curSgpa }) {
  const pCr = parseFloat(prevCredits) || 0;
  const pGpa = parseFloat(prevCgpa) || 0;
  const cCr = parseFloat(curCredits) || 0;
  const cGpa = parseFloat(curSgpa) || 0;

  const totalCredits = pCr + cCr;
  const totalQualityPoints = (pCr * pGpa) + (cCr * cGpa);
  const newCgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    totalCredits: Number(totalCredits.toFixed(2)),
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    newCgpa: Number(newCgpa.toFixed(2)),
    newCgpaRaw: newCgpa
  };
}

/**
 * Calculate required GPA for future remaining credits to reach Target CGPA
 */
export function calculateTargetGpa({
  currentCgpa,
  completedCredits,
  targetCgpa,
  remainingCredits,
  maxScale = 4.0
}) {
  const current = parseFloat(currentCgpa) || 0;
  const completed = parseFloat(completedCredits) || 0;
  const target = parseFloat(targetCgpa) || 0;
  const remaining = parseFloat(remainingCredits) || 0;

  if (target <= 0 || remaining <= 0) {
    return {
      isValid: false,
      message: 'Please provide valid target CGPA and remaining credit hours.'
    };
  }

  const currentPoints = current * completed;
  const totalCredits = completed + remaining;
  const targetTotalPoints = target * totalCredits;
  const neededPoints = targetTotalPoints - currentPoints;
  const requiredGpa = neededPoints / remaining;

  // Maximum achievable CGPA if student scores perfect maxScale in all remaining credits
  const maxPossiblePoints = currentPoints + (remaining * maxScale);
  const maxPossibleCgpa = maxPossiblePoints / totalCredits;

  const minPossibleCgpa = currentPoints / totalCredits;

  let feasibility = 'feasible';
  let message = '';
  let color = 'emerald';

  if (requiredGpa > maxScale) {
    feasibility = 'impossible';
    color = 'rose';
    message = `Mathematically unreachable. Even with a perfect ${maxScale.toFixed(2)} in all remaining credits, your maximum achievable CGPA is ${maxPossibleCgpa.toFixed(2)}.`;
  } else if (requiredGpa <= 0) {
    feasibility = 'achieved';
    color = 'emerald';
    message = `You have already secured this target! Even if you pass with minimal points, your CGPA will remain above ${target.toFixed(2)}.`;
  } else if (requiredGpa > (maxScale * 0.9)) {
    feasibility = 'hard';
    color = 'amber';
    message = `Challenging! You must maintain a very high average of ${requiredGpa.toFixed(2)} GPA across all remaining ${remaining} credits.`;
  } else {
    feasibility = 'feasible';
    color = 'emerald';
    message = `Realistic & Achievable! You need an average of ${requiredGpa.toFixed(2)} GPA in your remaining ${remaining} credits.`;
  }

  return {
    isValid: true,
    requiredGpa: Number(requiredGpa.toFixed(2)),
    requiredGpaRaw: requiredGpa,
    maxPossibleCgpa: Number(maxPossibleCgpa.toFixed(2)),
    minPossibleCgpa: Number(minPossibleCgpa.toFixed(2)),
    feasibility,
    message,
    color
  };
}
