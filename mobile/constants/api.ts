// API Configuration
// Update this to your backend URL in production
export const API_BASE_URL = 'http://10.180.39.138:5000/api';

export const API_ENDPOINTS = {
  // Auth
  signup: `${API_BASE_URL}/auth/signup`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  getMe: `${API_BASE_URL}/auth/me`,

  // User
  profile: `${API_BASE_URL}/user/profile`,
  onboarding: `${API_BASE_URL}/user/onboarding`,
  preferences: `${API_BASE_URL}/user/preferences`,

  // Lifestyle
  lifestyle: `${API_BASE_URL}/lifestyle`,
  lifestyleAnalysis: `${API_BASE_URL}/lifestyle/analysis`,

  // Community
  communityFeed: `${API_BASE_URL}/community/posts`,
  createPost: `${API_BASE_URL}/community/posts`,
  myPosts: `${API_BASE_URL}/community/my-posts`,
};
