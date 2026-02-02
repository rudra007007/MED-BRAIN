import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Heart, MessageCircle, HandHeart, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import type { CommunityPost, ReactionType, DriftTag } from '@/store/community.store';

interface PostProps {
  post: CommunityPost;
  onReact: (reactionType: ReactionType) => void;
  onComment: () => void;
}

export default function Post({ post, onReact, onComment }: PostProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTagColor = (tag: DriftTag) => {
    switch (tag) {
      case 'Stabilizing':
        return '#00D99F'; // Calm green
      case 'Recovering':
        return '#06D6FF'; // Soft blue
      case 'Drift detected':
        return '#FFB84D'; // Gentle amber
      default:
        return colors.accent;
    }
  };

  const getTagBackground = (tag: DriftTag) => {
    switch (tag) {
      case 'Stabilizing':
        return 'rgba(0, 217, 159, 0.12)';
      case 'Recovering':
        return 'rgba(6, 214, 255, 0.12)';
      case 'Drift detected':
        return 'rgba(255, 184, 77, 0.12)';
      default:
        return 'rgba(6, 214, 255, 0.12)';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundCard }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.backgroundAccent }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>
            {post.username.charAt(post.username.indexOf('_') + 1)}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.username, { color: colors.text }]}>
            {post.username}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
            {formatTimestamp(post.timestamp)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: colors.text }]}>
        {post.content}
      </Text>

      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View
              key={index}
              style={[
                styles.tag,
                { backgroundColor: getTagBackground(tag) },
              ]}
            >
              <Text style={[styles.tagText, { color: getTagColor(tag) }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Reactions & Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.reactions}>
          {/* Support Reaction */}
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => onReact('support')}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={post.userReaction === 'support' ? '#FF6B9D' : colors.textTertiary}
              fill={post.userReaction === 'support' ? '#FF6B9D' : 'none'}
            />
            {post.reactions.support > 0 && (
              <Text
                style={[
                  styles.reactionCount,
                  {
                    color:
                      post.userReaction === 'support'
                        ? '#FF6B9D'
                        : colors.textTertiary,
                  },
                ]}
              >
                {post.reactions.support}
              </Text>
            )}
          </TouchableOpacity>

          {/* Strength Reaction */}
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => onReact('strength')}
            activeOpacity={0.7}
          >
            <Sparkles
              size={20}
              color={post.userReaction === 'strength' ? '#FFB84D' : colors.textTertiary}
              fill={post.userReaction === 'strength' ? '#FFB84D' : 'none'}
            />
            {post.reactions.strength > 0 && (
              <Text
                style={[
                  styles.reactionCount,
                  {
                    color:
                      post.userReaction === 'strength'
                        ? '#FFB84D'
                        : colors.textTertiary,
                  },
                ]}
              >
                {post.reactions.strength}
              </Text>
            )}
          </TouchableOpacity>

          {/* Solidarity Reaction */}
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => onReact('solidarity')}
            activeOpacity={0.7}
          >
            <HandHeart
              size={20}
              color={post.userReaction === 'solidarity' ? '#00D99F' : colors.textTertiary}
              fill={post.userReaction === 'solidarity' ? '#00D99F' : 'none'}
            />
            {post.reactions.solidarity > 0 && (
              <Text
                style={[
                  styles.reactionCount,
                  {
                    color:
                      post.userReaction === 'solidarity'
                        ? '#00D99F'
                        : colors.textTertiary,
                  },
                ]}
              >
                {post.reactions.solidarity}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.commentButton}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <MessageCircle size={20} color={colors.textTertiary} />
          {post.commentCount > 0 && (
            <Text style={[styles.commentCount, { color: colors.textTertiary }]}>
              {post.commentCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  reactions: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});
