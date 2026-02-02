import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useInsightsStore } from '../../store/insights.store';
import { useBotStore } from '../../store/bot.store';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function ViewAnalysisScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { fetchPatternInsights } = useInsightsStore();
  const { botMessage, setBotMessage, sendBotMessage } = useBotStore();
  const { bottom: safeBottomInset } = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your health assistant. Ask me anything about your lifestyle analysis.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardHeight = useRef(new Animated.Value(0));
  const [inputHeight, setInputHeight] = useState(44);
  const [chatBarHeight, setChatBarHeight] = useState(0);

  useEffect(() => {
    fetchPatternInsights();
  }, [fetchPatternInsights]);

  useEffect(() => {
    const keyboardWillShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardWillHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(keyboardWillShow, (event) => {
      const nextHeight = Math.max(0, event.endCoordinates.height - safeBottomInset);
      Animated.timing(keyboardHeight.current, {
        duration: event.duration || 250,
        toValue: nextHeight,
        useNativeDriver: false,
      }).start();
    });

    const hideSubscription = Keyboard.addListener(keyboardWillHide, (event) => {
      Animated.timing(keyboardHeight.current, {
        duration: event.duration || 250,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [safeBottomInset]);


  const handleSend = () => {
    if (botMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: botMessage.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      sendBotMessage();
      setBotMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I\'ve analyzed your lifestyle data. Your risk drift indicator shows stable patterns. Is there anything specific you\'d like to know?',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={undefined}
        keyboardVerticalOffset={0}
        enabled={false}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: chatBarHeight + 24 },
          ]}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.messagesContainer}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.isUser ? styles.messageRowUser : styles.messageRowBot,
                ]}
              >
                {!message.isUser && (
                  <View style={[styles.avatar, styles.avatarBot]}>
                    <Bot size={16} color="#4A90E2" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser
                      ? [styles.messageBubbleUser, { backgroundColor: colors.accent }]
                      : [styles.messageBubbleBot, { backgroundColor: colors.backgroundCard }],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser ? { color: '#000' } : { color: colors.text },
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                {message.isUser && (
                  <View style={[styles.avatar, styles.avatarUser]}>
                    <User size={16} color="#fff" />
                  </View>
                )}
              </View>
            ))}
            <View style={styles.messagesBottomSpacing} />
          </View>
        </ScrollView>

        <Animated.View
          style={[
            styles.chatBar,
            {
              backgroundColor: colors.backgroundCard,
              borderTopColor: colors.border,
              transform: [{ translateY: Animated.multiply(keyboardHeight.current, -0.87) }],
            },
          ]}
          onLayout={(event) => setChatBarHeight(event.nativeEvent.layout.height)}
        >
          <View style={[styles.chatInputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.chatInput, { color: colors.text, height: inputHeight }]}
              placeholder="Ask the health assistant..."
              placeholderTextColor={colors.textSecondary}
              value={botMessage}
              onChangeText={setBotMessage}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              multiline
              scrollEnabled
              textAlignVertical="top"
              onContentSizeChange={(event) => {
                const nextHeight = Math.min(120, Math.max(44, event.nativeEvent.contentSize.height + 8));
                if (nextHeight !== inputHeight) {
                  setInputHeight(nextHeight);
                }
              }}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !botMessage.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!botMessage.trim()}
              activeOpacity={0.8}
            >
              <Send size={18} color={botMessage.trim() ? colors.accent : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingTop: 16,
  },
  messagesContainer: {
    paddingHorizontal: 16,
  },
  messagesBottomSpacing: {
    height: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBot: {
    backgroundColor: '#E3F2FD',
    marginRight: 8,
  },
  avatarUser: {
    backgroundColor: '#4A90E2',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  messageBubbleUser: {
    borderBottomRightRadius: 4,
  },
  messageBubbleBot: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  chatBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    minHeight: 48,
    maxHeight: 140,
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    maxHeight: 120,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
