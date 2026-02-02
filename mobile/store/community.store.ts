import { create } from 'zustand';

// Types for community posts and comments
export type ReactionType = 'support' | 'strength' | 'solidarity';
export type DriftTag = 'Stabilizing' | 'Recovering' | 'Drift detected';

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  tags: DriftTag[];
  reactions: Record<ReactionType, number>;
  commentCount: number;
  timestamp: Date;
  userReaction?: ReactionType | null;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  reactions: Record<string, number>;
  userReaction: boolean;
  timestamp: Date;
}

interface CommunityState {
  posts: CommunityPost[];
  comments: Record<string, CommunityComment[]>;
  selectedPostId: string | null;
  
  // Actions
  setPosts: (posts: CommunityPost[]) => void;
  setComments: (postId: string, comments: CommunityComment[]) => void;
  reactToPost: (postId: string, reactionType: ReactionType) => void;
  unreactToPost: (postId: string, reactionType: ReactionType) => void;
  reactToComment: (commentId: string, postId: string) => void;
  setSelectedPost: (postId: string | null) => void;
  addComment: (comment: CommunityComment) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  comments: {},
  selectedPostId: null,

  setPosts: (posts) => set({ posts }),
  
  setComments: (postId, newComments) => set((state) => ({
    comments: {
      ...state.comments,
      [postId]: newComments,
    },
  })),

  reactToPost: (postId, reactionType) => set((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        const currentReaction = post.userReaction;
        const newReactions = { ...post.reactions };
        
        // Remove previous reaction if any
        if (currentReaction) {
          newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
        }
        
        // Add new reaction if different from current
        if (currentReaction !== reactionType) {
          newReactions[reactionType] = newReactions[reactionType] + 1;
        }
        
        return {
          ...post,
          reactions: newReactions,
          userReaction: currentReaction === reactionType ? null : reactionType,
        };
      }
      return post;
    }),
  })),

  unreactToPost: (postId, reactionType) => set((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId && post.userReaction === reactionType) {
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: Math.max(0, post.reactions[reactionType] - 1),
          },
          userReaction: null,
        };
      }
      return post;
    }),
  })),

  reactToComment: (commentId, postId) => set((state) => {
    const postComments = state.comments[postId] || [];
    return {
      comments: {
        ...state.comments,
        [postId]: postComments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              userReaction: !comment.userReaction,
              reactions: {
                ...comment.reactions,
                support: comment.userReaction
                  ? Math.max(0, comment.reactions.support - 1)
                  : comment.reactions.support + 1,
              },
            };
          }
          return comment;
        }),
      },
    };
  }),

  setSelectedPost: (postId) => set({ selectedPostId: postId }),

  addComment: (comment) => set((state) => {
    const postComments = state.comments[comment.postId] || [];
    return {
      comments: {
        ...state.comments,
        [comment.postId]: [...postComments, comment],
      },
      posts: state.posts.map((post) => {
        if (post.id === comment.postId) {
          return {
            ...post,
            commentCount: post.commentCount + 1,
          };
        }
        return post;
      }),
    };
  }),
}));
