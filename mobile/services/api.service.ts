import { API_ENDPOINTS } from '../constants/api';
import { useAuthStore } from '../store/auth.store';

// Generic API request helper with auth
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> => {
  const { token } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

// User API functions
export const userApi = {
  getProfile: () => apiRequest<any>(API_ENDPOINTS.profile),
  
  saveOnboarding: (data: any) =>
    apiRequest<any>(API_ENDPOINTS.onboarding, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updatePreferences: (data: any) =>
    apiRequest<any>(API_ENDPOINTS.preferences, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Lifestyle API functions
export const lifestyleApi = {
  getData: (params?: { startDate?: string; endDate?: string; days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.days) queryParams.append('days', params.days.toString());
    
    const query = queryParams.toString();
    return apiRequest<any>(`${API_ENDPOINTS.lifestyle}${query ? `?${query}` : ''}`);
  },
  
  saveData: (data: any) =>
    apiRequest<any>(API_ENDPOINTS.lifestyle, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getAnalysis: (days?: number) => {
    const query = days ? `?days=${days}` : '';
    return apiRequest<any>(`${API_ENDPOINTS.lifestyleAnalysis}${query}`);
  },
};

// Community API functions
export const communityApi = {
  getFeed: (params?: { page?: number; limit?: number; postType?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.postType) queryParams.append('postType', params.postType);
    
    const query = queryParams.toString();
    return apiRequest<any>(`${API_ENDPOINTS.communityFeed}${query ? `?${query}` : ''}`);
  },
  
  createPost: (data: { postType: string; content: string; optionalMetrics?: any; isAnonymous?: boolean }) =>
    apiRequest<any>(API_ENDPOINTS.createPost, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMyPosts: () => apiRequest<any>(API_ENDPOINTS.myPosts),
  
  addComment: (postId: string, content: string) =>
    apiRequest<any>(`${API_ENDPOINTS.createPost}/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  addReaction: (postId: string, type: string) =>
    apiRequest<any>(`${API_ENDPOINTS.createPost}/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
  
  removeReaction: (postId: string) =>
    apiRequest<any>(`${API_ENDPOINTS.createPost}/${postId}/reactions`, {
      method: 'DELETE',
    }),
};
