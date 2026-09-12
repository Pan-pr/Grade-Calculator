import { API_BASE_URL, STORAGE_KEYS } from './constants.js';

/**
 * Authentication Module
 * Handles user login, signup, and session management
 */

class AuthManager {
  constructor() {
    this.token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    this.userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    this.isAuthenticated = !!this.token && !!this.userId;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password requirements
   * @param {string} password - Password to validate
   * @returns {Object} { valid: boolean, error?: string }
   */
  validatePassword(password) {
    if (!password || password.length < 6) {
      return { 
        valid: false, 
        error: 'Password must be at least 6 characters' 
      };
    }
    return { valid: true };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} { success: boolean, error?: string, data?: Object }
   */
  async login(email, password) {
    // Trim inputs
    email = email?.trim() || '';
    password = password?.trim() || '';

    // Validation
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      };
    }

    if (!this.isValidEmail(email)) {
      return { 
        success: false, 
        error: 'Invalid email format' 
      };
    }

    const passwordCheck = this.validatePassword(password);
    if (!passwordCheck.valid) {
      return { success: false, error: passwordCheck.error };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Include cookies for secure sessions
      });

      if (!response.ok) {
        const data = await response.json();
        return { 
          success: false, 
          error: data.error || 'Login failed. Please check your credentials.' 
        };
      }

      const data = await response.json();
      
      // Store auth credentials
      this.token = data.token;
      this.userId = data.userId;
      this.isAuthenticated = true;
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, this.token);
      localStorage.setItem(STORAGE_KEYS.USER_ID, this.userId);

      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Network error during login' 
      };
    }
  }

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} { success: boolean, error?: string, data?: Object }
   */
  async register(email, password) {
    // Trim inputs
    email = email?.trim() || '';
    password = password?.trim() || '';

    // Validation
    if (!email || !password) {
      return { 
        success: false, 
        error: 'Email and password are required' 
      };
    }

    if (!this.isValidEmail(email)) {
      return { 
        success: false, 
        error: 'Invalid email format' 
      };
    }

    const passwordCheck = this.validatePassword(password);
    if (!passwordCheck.valid) {
      return { success: false, error: passwordCheck.error };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        return { 
          success: false, 
          error: data.error || 'Registration failed. Email may already exist.' 
        };
      }

      const data = await response.json();
      
      // Auto-login after registration
      this.token = data.token;
      this.userId = data.userId;
      this.isAuthenticated = true;
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, this.token);
      localStorage.setItem(STORAGE_KEYS.USER_ID, this.userId);

      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Network error during registration' 
      };
    }
  }

  /**
   * Logout user
   * @returns {boolean}
   */
  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    
    return true;
  }

  /**
   * Get current auth token
   * @returns {string|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Get current user ID
   * @returns {string|null}
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.isAuthenticated;
  }
}

// Export singleton instance
export const authManager = new AuthManager();
