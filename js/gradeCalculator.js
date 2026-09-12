import { GRADE_SCALE, INITIAL_DATA, GPA_COLORS } from './constants.js';

/**
 * Grade Calculation Utilities
 * Handles all grade computation logic
 */

/**
 * Get grade and GPA for a given score
 * @param {number} totalScore - The student's total score
 * @param {Array} customCutoffs - Optional custom grade cutoffs (uses GRADE_SCALE if not provided)
 * @returns {Object} { grade: string, gpa: number }
 */
export function getGradeAndGpa(totalScore, customCutoffs = null) {
  const cutoffs = customCutoffs || GRADE_SCALE;
  
  for (const c of cutoffs) {
    if (totalScore >= c.score) {
      return { grade: c.grade, gpa: c.gpa };
    }
  }
  return { grade: "F", gpa: 0.0 };
}

/**
 * Get GPA color class based on GPA value
 * @param {number} gpa - The GPA value
 * @returns {string} Tailwind color class
 */
export function getGpaColorClass(gpa) {
  if (gpa >= GPA_COLORS.excellent.min) return GPA_COLORS.excellent.class;
  if (gpa >= GPA_COLORS.good.min) return GPA_COLORS.good.class;
  return GPA_COLORS.passing.class;
}

/**
 * Calculate total score for a subject
 * @param {Array} assessments - Array of assessment objects
 * @returns {number} Total score
 */
export function calculateSubjectScore(assessments) {
  return assessments.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
}

/**
 * Calculate max possible score for a subject
 * @param {Array} assessments - Array of assessment objects
 * @returns {number} Maximum possible score
 */
export function calculateMaxScore(assessments) {
  return assessments.reduce((sum, a) => sum + (Number(a.max) || 0), 0);
}

/**
 * Get next grade milestone
 * @param {number} totalScore - Current total score
 * @param {Array} customCutoffs - Optional custom grade cutoffs
 * @returns {Object} { nextGradeText: string, pointsNeeded: number }
 */
export function getNextGradeMilestone(totalScore, customCutoffs = null) {
  const cutoffs = customCutoffs || GRADE_SCALE;
  const sortedCutoffs = [...cutoffs].sort((a, b) => b.score - a.score);
  const currentIdx = sortedCutoffs.findIndex(c => totalScore >= c.score);
  
  if (currentIdx <= 0) {
    return { nextGradeText: "Max Grade Reached", pointsNeeded: 0 };
  }
  
  const nextGrade = sortedCutoffs[currentIdx - 1];
  const needed = nextGrade.score - totalScore;
  
  return {
    nextGradeText: `Needs <b class="text-blue-400">+${needed.toFixed(2)} pts</b> for <b class="text-emerald-400">${nextGrade.grade}</b>`,
    pointsNeeded: needed
  };
}

/**
 * Calculate dashboard metrics
 * @param {Array} subjects - Array of subject objects
 * @returns {Object} Aggregated metrics
 */
export function calculateDashboardMetrics(subjects) {
  let totalPointsGraded = 0;
  let totalCreditPoints = 0;
  let totalGradedCredits = 0;
  let filledCount = 0;
  let totalAssessments = 0;

  subjects.forEach(s => {
    const scoreSum = calculateSubjectScore(s.assessments);
    const { gpa } = getGradeAndGpa(scoreSum, s.cutoffs || GRADE_SCALE);

    totalPointsGraded += scoreSum;
    totalCreditPoints += gpa * s.credits;
    totalGradedCredits += s.credits;

    s.assessments.forEach(a => {
      totalAssessments++;
      if (a.score && a.score > 0) filledCount++;
    });
  });

  const overallGpa = totalGradedCredits > 0 
    ? (totalCreditPoints / totalGradedCredits).toFixed(2) 
    : "0.00";
  const completionRate = totalAssessments > 0 
    ? Math.round((filledCount / totalAssessments) * 100) 
    : 0;

  return {
    overallGpa,
    totalPointsGraded: totalPointsGraded.toFixed(2),
    completionRate,
    totalGradedCredits,
    totalCreditPoints
  };
}

/**
 * Validate and update a score
 * Ensures score doesn't exceed max
 * @param {Array} subjects - Array of subjects
 * @param {number} subjectIdx - Index of subject
 * @param {number} assessmentIdx - Index of assessment
 * @param {number} newScore - New score value
 * @returns {Object} { success: boolean, error?: string }
 */
export function updateSubjectScore(subjects, subjectIdx, assessmentIdx, newScore) {
  if (!subjects[subjectIdx]) {
    return { success: false, error: 'Invalid subject index' };
  }

  if (!subjects[subjectIdx].assessments[assessmentIdx]) {
    return { success: false, error: 'Invalid assessment index' };
  }

  const assessment = subjects[subjectIdx].assessments[assessmentIdx];
  const score = parseFloat(newScore) || 0;

  // Validation
  if (score < 0) {
    return { success: false, error: 'Score cannot be negative' };
  }

  if (score > assessment.max) {
    return { 
      success: false, 
      error: `Score cannot exceed ${assessment.max}` 
    };
  }

  // Update the score
  subjects[subjectIdx].assessments[assessmentIdx].score = score;
  return { success: true };
}

/**
 * Reset subjects to initial data
 * @returns {Array} Fresh copy of initial data
 */
export function getResetData() {
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

/**
 * Get chart data for visualization
 * @param {Array} subjects - Array of subjects
 * @returns {Object} { labels: string[], scores: number[] }
 */
export function getChartData(subjects) {
  const labels = [];
  const scores = [];
  const creditDistribution = [];

  subjects.forEach(s => {
    labels.push(s.name);
    scores.push(calculateSubjectScore(s.assessments));
    creditDistribution.push(s.credits);
  });

  return { labels, scores, creditDistribution };
}
