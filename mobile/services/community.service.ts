import { API_ENDPOINTS } from '../constants/api';
import type { CommunityPost, CommunityComment } from '../store/community.store';

export interface CreatePostRequest {
  userId: string;
  content: string;
  tags: string[];
}

export interface CreateCommentRequest {
  postId: string;
  userId: string;
  content: string;
}

export interface ReactToPostRequest {
  postId: string;
  userId: string;
  reactionType: string;
}

class CommunityService {
  /**
   * Fetch all community posts
   */
  async getPosts(): Promise<CommunityPost[]> {
    try {
      const response = await fetch(API_ENDPOINTS.COMMUNITY_POSTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  /**
   * Create a new community post
   */
  async createPost(data: CreatePostRequest): Promise<CommunityPost> {
    try {
      const response = await fetch(API_ENDPOINTS.COMMUNITY_POSTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  /**
   * React to a post
   */
  async reactToPost(data: ReactToPostRequest): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.COMMUNITY_POSTS}/${data.postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          reactionType: data.reactionType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to react to post:', error);
      throw error;
    }
  }

  /**
   * Fetch comments for a post
   */
  async getComments(postId: string): Promise<CommunityComment[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.COMMUNITY_POSTS}/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }

  /**
   * Add a comment to a post
   */
  async createComment(data: CreateCommentRequest): Promise<CommunityComment> {
    try {
      const response = await fetch(`${API_ENDPOINTS.COMMUNITY_POSTS}/${data.postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.userId,
          content: data.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  }
}

export const communityService = new CommunityService();
