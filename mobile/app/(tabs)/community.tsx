import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { X, Send, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommunityStore, type ReactionType, type CommunityPost } from '@/store/community.store';
import Post from '@/components/community/Post';
import Comment from '@/components/community/Comment';
import { mockCommunityPosts, mockCommunityComments } from '@/mocks/communitydata';
import { useTheme } from '@/context/ThemeContext';

export default function CommunityScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const {
    posts,
    comments,
    selectedPostId,
    setPosts,
    setComments,
    reactToPost,
    unreactToPost,
    reactToComment,
    setSelectedPost,
    addComment,
  } = useCommunityStore();

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Stabilizing' | 'Recovering' | 'Drift detected'>('Stabilizing');

  // Load mock data on mount
  useEffect(() => {
    setPosts(mockCommunityPosts);
    // Load comments for each post
    Object.keys(mockCommunityComments).forEach((postId) => {
      setComments(postId, mockCommunityComments[postId]);
    });
  }, [setComments, setPosts]);

  const handleReact = (postId: string, reactionType: ReactionType) => {
    const post = posts.find((p) => p.id === postId);
    if (post?.userReaction === reactionType) {
      unreactToPost(postId, reactionType);
    } else {
      reactToPost(postId, reactionType);
    }
  };

  const handleCommentPress = (postId: string) => {
    setSelectedPost(postId);
    setCommentModalVisible(true);
  };

  const handleCloseCommentModal = () => {
    setCommentModalVisible(false);
    setCommentText('');
    setTimeout(() => setSelectedPost(null), 300);
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !selectedPostId) return;

    const newComment = {
      id: `c${Date.now()}`,
      postId: selectedPostId,
      userId: 'current-user',
      username: 'User_' + Math.floor(Math.random() * 900 + 100),
      content: commentText.trim(),
      reactions: { support: 0 },
      userReaction: false,
      timestamp: new Date(),
    };

    addComment(newComment);
    setCommentText('');
  };

  const handleCommentReact = (commentId: string, postId: string) => {
    reactToComment(commentId, postId);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `p${Date.now()}`,
      userId: 'current-user',
      username: 'User_' + Math.floor(Math.random() * 900 + 100),
      content: newPostContent.trim(),
      tags: [selectedTag],
      reactions: { support: 0, strength: 0, solidarity: 0 },
      commentCount: 0,
      timestamp: new Date(),
      userReaction: null,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostModalVisible(false);
  };

  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const postComments = selectedPostId ? comments[selectedPostId] || [] : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            Share insights, support each other
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => setNewPostModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#000" />
          <Text style={styles.addButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onReact={(reactionType: ReactionType) => handleReact(post.id, reactionType)}
            onComment={() => handleCommentPress(post.id)}
          />
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseCommentModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Comments</Text>
              <TouchableOpacity onPress={handleCloseCommentModal} style={styles.closeButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Original Post Summary */}
            {selectedPost && (
              <View style={[styles.postSummary, { backgroundColor: colors.background }]}>
                <Text style={[styles.postSummaryUsername, { color: colors.accent }]}>
                  {selectedPost.username}
                </Text>
                <Text style={[styles.postSummaryContent, { color: colors.text }]} numberOfLines={2}>
                  {selectedPost.content}
                </Text>
              </View>
            )}

            {/* Comments List */}
            <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
              {postComments.length === 0 ? (
                <Text style={[styles.noComments, { color: colors.textTertiary }]}>
                  Be the first to share encouragement
                </Text>
              ) : (
                postComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onReact={() => handleCommentReact(comment.id, comment.postId)}
                  />
                ))
              )}
            </ScrollView>

            {/* Comment Input */}
            <View style={[styles.commentInputContainer, { backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.commentInput, { color: colors.text }]}
                placeholder="Share something kind..."
                placeholderTextColor={colors.textTertiary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={300}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: commentText.trim() ? colors.accent : colors.backgroundAccent },
                ]}
                onPress={handleSendComment}
                disabled={!commentText.trim()}
                activeOpacity={0.8}
              >
                <Send size={20} color={commentText.trim() ? '#000' : colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* New Post Modal */}
      <Modal
        visible={newPostModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Share with Community</Text>
              <TouchableOpacity
                onPress={() => setNewPostModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Tag Selection */}
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {"What's on your mind?"}
            </Text>

            <View style={styles.tagSelector}>
              {(['Stabilizing', 'Recovering', 'Drift detected'] as const).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    {
                      backgroundColor:
                        selectedTag === tag
                          ? tag === 'Stabilizing'
                            ? 'rgba(0, 217, 159, 0.2)'
                            : tag === 'Recovering'
                              ? 'rgba(6, 214, 255, 0.2)'
                              : 'rgba(255, 184, 77, 0.2)'
                          : colors.background,
                      borderColor:
                        selectedTag === tag
                          ? tag === 'Stabilizing'
                            ? '#00D99F'
                            : tag === 'Recovering'
                              ? '#06D6FF'
                              : '#FFB84D'
                          : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedTag(tag)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      {
                        color:
                          selectedTag === tag
                            ? tag === 'Stabilizing'
                              ? '#00D99F'
                              : tag === 'Recovering'
                                ? '#06D6FF'
                                : '#FFB84D'
                            : colors.textTertiary,
                      },
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Post Content Input */}
            <TextInput
              style={[styles.postInput, { color: colors.text }]}
              placeholder="Share a small win, insight, or what you've been noticing..."
              placeholderTextColor={colors.textTertiary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>
              {newPostContent.length}/500
            </Text>

            {/* Post Guidelines */}
            <View style={styles.guidelines}>
              <Text style={[styles.guidelinesTitle, { color: colors.text }]}>
                Community Guidelines
              </Text>

              <Text style={[styles.guidelinesText, { color: colors.textTertiary }]}>
                {`• Share experiences, not medical advice
                  • Be kind and supportive
                  • Respect everyone’s journey`}
              </Text>
            </View>


            {/* Post Button */}
            <TouchableOpacity
              style={[
                styles.postButton,
                { backgroundColor: newPostContent.trim() ? colors.accent : colors.backgroundAccent },
              ]}
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.postButtonText,
                  { color: newPostContent.trim() ? '#000' : colors.textTertiary },
                ]}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  postSummary: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  postSummaryUsername: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  postSummaryContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentsList: {
    paddingHorizontal: 16,
    maxHeight: 350,
  },
  noComments: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
  // New Post Modal
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  tagSelector: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tagButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tagButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  postInput: {
    height: 140,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 8,
    marginRight: 20,
  },
  guidelines: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 214, 255, 0.08)',
  },
  guidelinesTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 12,
    lineHeight: 18,
  },
  postButton: {
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
