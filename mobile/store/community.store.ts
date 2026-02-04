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
  userReaction?: ReactionType | null;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  username?: string;
  userAlias?: string;
  content: string;
  createdAt: string;
  reactions?: { support: number };
  userReaction?: boolean;
  timestamp?: Date;
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
  addComment: (comment: CommunityComment) => void;
  reactToPost: (postId: string, reactionType: ReactionType) => void;
  unreactToPost: (postId: string, reactionType: ReactionType) => void;
  reactToComment: (commentId: string, postId: string) => void;
  removeReaction: (postId: string) => Promise<void>;
  setPosts: (posts: CommunityPost[]) => void;
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

  addComment: (comment: CommunityComment) => {
    set((state) => {
      const postComments = state.comments[comment.postId] || [];
      return {
        comments: {
          ...state.comments,
          [comment.postId]: [...postComments, comment],
        },
      };
    });
  },

  reactToPost: (postId: string, reactionType: ReactionType) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            userReaction: reactionType,
          };
        }
        return post;
      }),
    }));
  },

  unreactToPost: (postId: string, reactionType: ReactionType) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            userReaction: null,
          };
        }
        return post;
      }),
    }));
  },

  reactToComment: (commentId: string, postId: string) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: state.comments[postId].map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              userReaction: true,
              reactions: {
                support: (comment.reactions?.support || 0) + 1,
              },
            };
          }
          return comment;
        }),
      },
    }));
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

  setPosts: (posts: CommunityPost[]) => {
    set({ posts });
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
