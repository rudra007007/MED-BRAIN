import { create } from 'zustand';
import { communityApi } from '../services/api.service';
import { useAuthStore } from './auth.store';

export type ReactionType = 'support' | 'encouraging' | 'celebrate';
export type DriftTag = 'Stabilizing' | 'Recovering' | 'Drift detected';

export interface CommunityPost {
  id: string;
  userId: string;
  userAlias: string;
  postType: 'insight' | 'progress' | 'support';
  content: string;
  optionalMetrics?: {
    sleepHours?: number;
    steps?: number;
    stressLevel?: string;
    mood?: string;
  };
  reactions: Array<{
    userId: string;
    type: ReactionType;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    userId: string;
    userAlias: string;
    content: string;
    createdAt: string;
  }>;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  userAlias: string;
  content: string;
  createdAt: string;
}

interface CommunityState {
  posts: CommunityPost[];
  comments: Record<string, CommunityComment[]>;
  selectedPostId: string | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // Actions
  fetchPosts: (params?: { page?: number; limit?: number; postType?: string }) => Promise<void>;
  createPost: (data: { postType: string; content: string; optionalMetrics?: any }) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  reactToPost: (postId: string, reactionType: ReactionType) => Promise<void>;
  removeReaction: (postId: string) => Promise<void>;
  setComments: (postId: string, comments: CommunityComment[]) => void;
  setSelectedPost: (postId: string | null) => void;
  clearError: () => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  comments: {},
  selectedPostId: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  fetchPosts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await communityApi.getFeed({
        page: params.page || 1,
        limit: params.limit || 20,
        postType: params.postType,
      });

      if (response.success && response.data) {
        set({
          posts: response.data,
          isLoading: false,
          pagination: {
            page: 1,
            limit: 20,
            total: response.data.length,
            pages: 1,
          },
        });
      } else {
        set({
          error: response.message || 'Failed to fetch posts',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Fetch failed',
        isLoading: false,
      });
    }
  },

  createPost: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await communityApi.createPost(data);
      if (response.success && response.data) {
        set((state) => ({
          posts: [response.data, ...state.posts],
          isLoading: false,
        }));
      } else {
        set({
          error: response.message || 'Failed to create post',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Create failed',
        isLoading: false,
      });
      throw error;
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await communityApi.addComment(postId, content);
      if (response.success && response.data) {
        set((state) => {
          const postComments = state.comments[postId] || [];
          return {
            comments: {
              ...state.comments,
              [postId]: [...postComments, response.data],
            },
            posts: state.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments: [...post.comments, response.data],
                };
              }
              return post;
            }),
          };
        });
      } else {
        set({ error: response.message || 'Failed to add comment' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Add comment failed',
      });
      throw error;
    }
  },

  reactToPost: async (postId, reactionType) => {
    try {
      const response = await communityApi.addReaction(postId, reactionType);
      if (response.success) {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                reactions: response.data,
              };
            }
            return post;
          }),
        }));
      }
    } catch (error) {
      // Ignore reaction errors
    }
  },

  removeReaction: async (postId) => {
    try {
      const response = await communityApi.removeReaction(postId);
      if (response.success) {
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                reactions: response.data,
              };
            }
            return post;
          }),
        }));
      }
    } catch (error) {
      // Ignore reaction errors
    }
  },

  setComments: (postId, newComments) => set((state) => ({
    comments: {
      ...state.comments,
      [postId]: newComments,
    },
  })),

  setSelectedPost: (postId) => set({ selectedPostId: postId }),

  clearError: () => set({ error: null }),
}));
