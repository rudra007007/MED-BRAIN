import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import type { CommunityComment } from '@/store/community.store';

interface CommentProps {
  comment: CommunityComment;
  onReact: () => void;
}

export default function Comment({ comment, onReact }: CommentProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.backgroundAccent }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>
            {comment.username.charAt(comment.username.indexOf('_') + 1)}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.username, { color: colors.text }]}>
            {comment.username}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
            {formatTimestamp(comment.timestamp)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text style={[styles.content, { color: colors.text }]}>
        {comment.content}
      </Text>

      {/* Support Reaction */}
      <TouchableOpacity
        style={styles.reactionButton}
        onPress={onReact}
        activeOpacity={0.7}
      >
        <Heart
          size={18}
          color={comment.userReaction ? '#FF6B9D' : colors.textTertiary}
          fill={comment.userReaction ? '#FF6B9D' : 'none'}
        />
        {comment.reactions.support > 0 && (
          <Text
            style={[
              styles.reactionCount,
              {
                color: comment.userReaction ? '#FF6B9D' : colors.textTertiary,
              },
            ]}
          >
            {comment.reactions.support}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 42,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 42,
  },
  reactionCount: {
    fontSize: 13,
    fontWeight: '500',
  },
});
