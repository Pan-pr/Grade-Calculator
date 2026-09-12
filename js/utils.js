/**
 * Utility Functions
 * Debouncing, error handling, and DOM helpers
 */

/**
 * Debounce function - delays execution until after delay ms of inactivity
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Show temporary status message
 * @param {string} elementId - ID of element to update
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - How long to show message (ms)
 */
export function showStatus(elementId, message, type = 'info', duration = 3000) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let className = 'text-slate-400';
  if (type === 'success') className = 'text-green-400';
  if (type === 'error') className = 'text-red-400';

  element.textContent = message;
  element.className = className;

  if (duration > 0) {
    setTimeout(() => {
      element.textContent = '';
    }, duration);
  }
}

/**
 * Clear all error messages
 * @param {string[]} errorElementIds - Array of element IDs to clear
 */
export function clearErrors(errorElementIds) {
  errorElementIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = '';
  });
}

/**
 * Set button to loading state
 * @param {string} buttonId - ID of button element
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} originalText - Original button text
 */
export function setButtonLoading(buttonId, isLoading, originalText = '') {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading...';
    button.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    button.disabled = false;
    button.textContent = originalText;
    button.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Value to return on parse error
 * @returns {*}
 */
export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('JSON parse error:', err);
    return fallback;
  }
}

/**
 * Format number to 2 decimal places
 * @param {number} num - Number to format
 * @returns {string}
 */
export function formatDecimal(num, places = 2) {
  return parseFloat(num || 0).toFixed(places);
}

/**
 * Validate API response
 * @param {Response} response - Fetch response object
 * @returns {Object} { isValid: boolean, error?: string }
 */
export async function validateApiResponse(response) {
  if (!response.ok) {
    try {
      const data = await response.json();
      return { 
        isValid: false, 
        error: data.error || `HTTP ${response.status}: ${response.statusText}` 
      };
    } catch (err) {
      return { 
        isValid: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }
  }
  return { isValid: true };
}

/**
 * Get auth headers for API requests
 * @param {string} token - Auth token
 * @returns {Object} Headers object
 */
export function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Retry logic for failed API calls
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries (ms)
 * @returns {Promise<*>}
 */
export async function retryAsync(fn, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if arrays are equal
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean}
 */
export function arraysEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}
