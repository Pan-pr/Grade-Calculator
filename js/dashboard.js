import { 
  getGradeAndGpa, 
  getGpaColorClass, 
  calculateSubjectScore, 
  calculateMaxScore,
  getNextGradeMilestone,
  calculateDashboardMetrics,
  getChartData
} from './gradeCalculator.js';
import { GRADE_SCALE } from './constants.js';

/**
 * Dashboard Module
 * Handles all UI rendering and updates
 */

let scoresChart = null;
let creditChart = null;

/**
 * Render all subject cards
 * @param {Array} subjects - Array of subject objects
 * @param {Function} onScoreChange - Callback when score is updated
 */
export function renderSubjects(subjects, onScoreChange) {
  const container = document.getElementById('subjects-container');
  if (!container) return;
  
  container.innerHTML = '';

  subjects.forEach((subj, sIdx) => {
    const totalScore = calculateSubjectScore(subj.assessments);
    const maxScore = calculateMaxScore(subj.assessments);
    const cutoffs = subj.cutoffs || GRADE_SCALE;
    const { grade, gpa } = getGradeAndGpa(totalScore, cutoffs);
    const { nextGradeText } = getNextGradeMilestone(totalScore, cutoffs);
    const gpaColor = getGpaColorClass(gpa);

    const cardHtml = `
      <div class="glass-card rounded-2xl p-6 transition">
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700/60 pb-4 mb-4 gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-bold text-white">${escapeHtml(subj.name)}</h3>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">${subj.credits} Credits</span>
            </div>
            <div class="text-xs text-slate-400 mt-1">${nextGradeText}</div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-right">
              <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Score</div>
              <div class="text-2xl font-bold text-white">${totalScore.toFixed(2)} <span class="text-xs text-slate-400">/ ${maxScore}</span></div>
            </div>
            <div class="text-right">
              <div class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Predicted Grade</div>
              <div class="text-2xl font-extrabold ${gpaColor}">
                ${grade} <span class="text-sm font-normal text-slate-400">(${gpa.toFixed(1)})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-800/60 text-slate-400 uppercase text-xs">
              <tr>
                <th class="py-2.5 px-3 rounded-l-lg">Assessment Item</th>
                <th class="py-2.5 px-3">Score Earned</th>
                <th class="py-2.5 px-3">Full Score</th>
                <th class="py-2.5 px-3 rounded-r-lg">Weight / Contribution</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/40">
              ${subj.assessments.map((item, aIdx) => `
                <tr>
                  <td class="py-2 px-3 font-medium text-slate-200">${escapeHtml(item.name)}</td>
                  <td class="py-2 px-3">
                    <input type="number" step="0.01" min="0" max="${item.max}" value="${item.score || 0}" 
                      onchange="window.onScoreChange(${sIdx}, ${aIdx}, this.value)"
                      class="w-24 px-2 py-1 text-sm bg-slate-800 text-white border border-slate-600 rounded focus:outline-2 focus:outline-blue-500">
                  </td>
                  <td class="py-2 px-3 text-slate-400">${item.max}</td>
                  <td class="py-2 px-3">
                    <div class="w-full bg-slate-700 rounded-full h-2 max-w-xs">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: ${item.max > 0 ? ((item.score || 0) / item.max) * 100 : 0}%"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

/**
 * Update dashboard metrics display
 * @param {Array} subjects - Array of subject objects
 */
export function updateMetrics(subjects) {
  const metrics = calculateDashboardMetrics(subjects);

  const overallGpaEl = document.getElementById('overall-gpa');
  if (overallGpaEl) overallGpaEl.textContent = metrics.overallGpa;

  const totalPointsEl = document.getElementById('total-points-earned');
  if (totalPointsEl) totalPointsEl.textContent = metrics.totalPointsGraded;

  const completionRateEl = document.getElementById('completion-rate');
  if (completionRateEl) completionRateEl.textContent = `${metrics.completionRate}%`;
}

/**
 * Initialize charts
 */
export function initCharts() {
  const ctx1 = document.getElementById('scoresChart');
  const ctx2 = document.getElementById('creditChart');

  if (!ctx1 || !ctx2) {
    console.warn('Chart containers not found');
    return;
  }

  // Initialize scores bar chart
  if (scoresChart) scoresChart.destroy();
  scoresChart = new Chart(ctx1.getContext('2d'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Total Score Achieved',
        data: [],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { 
          beginAtZero: true, 
          max: 100, 
          grid: { color: 'rgba(255,255,255,0.05)' }, 
          ticks: { color: '#94a3b8' } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: '#94a3b8' } 
        }
      },
      plugins: { 
        legend: { display: false },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
      }
    }
  });

  // Initialize credit distribution doughnut chart
  if (creditChart) creditChart.destroy();
  creditChart = new Chart(ctx2.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: 'bottom', 
          labels: { color: '#94a3b8', boxWidth: 12, padding: 15 } 
        }
      }
    }
  });
}

/**
 * Update charts with data
 * @param {Array} subjects - Array of subject objects
 */
export function updateCharts(subjects) {
  const { labels, scores, creditDistribution } = getChartData(subjects);

  if (scoresChart) {
    scoresChart.data.labels = labels;
    scoresChart.data.datasets[0].data = scores;
    scoresChart.update('none'); // 'none' prevents animation for better performance
  }

  if (creditChart) {
    creditChart.data.labels = labels;
    creditChart.data.datasets[0].data = creditDistribution;
    creditChart.update('none');
  }
}

/**
 * Toggle between auth and dashboard views
 * @param {string} view - 'auth' or 'dashboard'
 */
export function switchView(view) {
  const authContainer = document.querySelector('.auth-container');
  const dashContainer = document.querySelector('.dash-container');

  if (!authContainer || !dashContainer) return;

  if (view === 'dashboard') {
    authContainer.classList.remove('active');
    dashContainer.classList.add('active');
  } else {
    dashContainer.classList.remove('active');
    authContainer.classList.add('active');
  }
}

/**
 * Update sync status display
 * @param {string} status - 'syncing', 'success', 'error', or empty string
 * @param {string} message - Status message
 */
export function updateSyncStatus(status, message = '') {
  const syncStatusEl = document.getElementById('sync-status');
  if (!syncStatusEl) return;

  if (status === 'syncing') {
    syncStatusEl.textContent = '⏳ Saving...';
  } else if (status === 'success') {
    syncStatusEl.textContent = '✅ Synced to cloud';
  } else if (status === 'error') {
    syncStatusEl.textContent = '❌ Sync failed: ' + message;
  } else {
    syncStatusEl.textContent = '';
  }
}

/**
 * Clear auth form
 */
export function clearAuthForm() {
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');

  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string}
 */
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Get chart instances (for testing or advanced usage)
 */
export function getCharts() {
  return { scoresChart, creditChart };
}
