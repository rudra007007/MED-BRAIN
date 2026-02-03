import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, Clock, AlertTriangle, Activity, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

type NotificationType = 'alert' | 'update' | 'insight' | 'reminder';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'alert',
        title: 'Irregular Heart Rate Detected',
        message: 'We noticed a slight irregularity in your heart rate pattern during your sleep last night.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
    },
    {
        id: '2',
        type: 'insight',
        title: 'Weekly Recovery Analysis',
        message: 'Your recovery score has improved by 15% this week compared to last week.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
    },
    {
        id: '3',
        type: 'reminder',
        title: 'Medication Reminder',
        message: 'It\'s time for your evening supplement.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
    },
    {
        id: '4',
        type: 'update',
        title: 'App Update Available',
        message: 'Version 2.1 is now available with new sleep tracking features.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
    },
    {
        id: '5',
        type: 'insight',
        title: 'Sleep Goal Achieved',
        message: 'You hit your sleep duration goal 5 days in a row! Great job.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day, 2 hours ago
        read: true,
    },
];

export default function NotificationScreen() {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'alert':
                return <AlertTriangle size={20} color="#FF6B6B" />;
            case 'insight':
                return <Activity size={20} color="#4CC9F0" />;
            case 'reminder':
                return <Calendar size={20} color="#FFD166" />;
            case 'update':
                return <Bell size={20} color="#06D6A0" />;
            default:
                return <Bell size={20} color={colors.text} />;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[
                styles.notificationItem,
                {
                    backgroundColor: item.read ? 'transparent' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                }
            ]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
                {getIcon(item.type)}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: colors.text, fontWeight: item.read ? '500' : '700' }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.time, { color: colors.textTertiary }]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
                <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.message}
                </Text>
            </View>
            {!item.read && (
                <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <TouchableOpacity onPress={markAllAsRead}>
                    <Text style={[styles.markReadText, { color: colors.accent }]}>Mark all as read</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Bell size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications yet</Text>
                    </View>
                }
            />
        </View>
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    markReadText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
        alignSelf: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
    },
});
