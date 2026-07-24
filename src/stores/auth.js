import { reactive, computed } from 'vue';

export const authStore = reactive({
  // Read initial user state from 'currentUser' key
  user: JSON.parse(localStorage.getItem('currentUser')) || null,

  // Computed helper to check login status reactively
  get isAuthenticated() {
    return this.user !== null;
  },

  login(userData) {
    this.user = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
  },

  logout() {
    this.user = null;
    localStorage.removeItem('currentUser');
  },

  isLoggedIn() {
    return !!this.user;
  }
});