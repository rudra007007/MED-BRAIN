import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Smartphone, Zap, AlertCircle, BarChart2 } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const mockScreenTimeData = {
    dailyAverage: '4h 12m',
    trend: '-15% vs last week',
    totalToday: '3h 45m',
    weeklyData: [
        { day: 'M', hours: 4.5 },
        { day: 'T', hours: 3.2 },
        { day: 'W', hours: 5.1 },
        { day: 'T', hours: 4.2 },
        { day: 'F', hours: 3.8 },
        { day: 'S', hours: 6.5 },
        { day: 'S', hours: 5.2 },
    ],
    categories: [
        { name: 'Social', time: '1h 30m', percentage: 40, color: '#FF6B6B' },
        { name: 'Productivity', time: '1h 15m', percentage: 33, color: '#4CC9F0' },
        { name: 'Entertainment', time: '45m', percentage: 20, color: '#FFD166' },
        { name: 'Other', time: '15m', percentage: 7, color: '#06D6A0' },
    ],
    mostUsed: [
        { name: 'Instagram', time: '55m', icon: 'camera' },
        { name: 'WhatsApp', time: '35m', icon: 'message-circle' },
        { name: 'Mail', time: '30m', icon: 'mail' },
    ]
};

export default function ScreenTimeScreen() {
    const router = useRouter();
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    const maxHours = Math.max(...mockScreenTimeData.weeklyData.map(d => d.hours));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                >
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Screen Time</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Summary Card */}
                <View style={[styles.summaryCard, { backgroundColor: colors.backgroundCard }]}>
                    <View style={styles.summaryHeader}>
                        <View>
                            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>DAILY AVERAGE</Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>{mockScreenTimeData.dailyAverage}</Text>
                        </View>
                        <View style={[styles.trendBadge, { backgroundColor: 'rgba(52, 199, 89, 0.15)' }]}>
                            <Text style={[styles.trendText, { color: '#34C759' }]}>{mockScreenTimeData.trend}</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        {mockScreenTimeData.weeklyData.map((d, i) => (
                            <View key={i} style={styles.barWrapper}>
                                <View style={styles.barTrack}>
                                    <LinearGradient
                                        colors={['#06D6FF', '#005bea']}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0, y: 0 }}
                                        style={[
                                            styles.barFill,
                                            { height: `${(d.hours / maxHours) * 100}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.dayLabel, { color: colors.textTertiary }]}>{d.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Breakdown</Text>
                    <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
                        {mockScreenTimeData.categories.map((cat, index) => (
                            <View key={index} style={styles.categoryRow}>
                                <View style={styles.categoryInfo}>
                                    <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                                    <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                                </View>
                                <View style={styles.categoryStats}>
                                    <Text style={[styles.categoryTime, { color: colors.textSecondary }]}>{cat.time}</Text>
                                    <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                        <View style={[styles.progressFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Insight Card */}
                <View style={[styles.insightCard, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                    <View style={styles.insightHeader}>
                        <AlertCircle size={20} color="#FFC107" />
                        <Text style={[styles.insightTitle, { color: isDark ? '#FFD54F' : '#F57F17' }]}>Wellness Tip</Text>
                    </View>
                    <Text style={[styles.insightText, { color: colors.text }]}>
                        High screen time before bed correlates with your recent dip in sleep recovery scores. Try enabling "Wind Down" mode at 10 PM.
                    </Text>
                </View>

                {/* Most Used Apps */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Used</Text>
                    <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
                        {mockScreenTimeData.mostUsed.map((app, index) => (
                            <View key={index} style={[styles.appRow, index !== mockScreenTimeData.mostUsed.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <View style={styles.appInfo}>
                                    <View style={[styles.appIconPlaceholder, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                                        <Smartphone size={16} color={colors.textSecondary} />
                                    </View>
                                    <Text style={[styles.appName, { color: colors.text }]}>{app.name}</Text>
                                </View>
                                <Text style={[styles.appTime, { color: colors.text }]}>{app.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 40 }} />

            </ScrollView>
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
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    summaryCard: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '700',
        opacity: 0.6,
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: '800',
    },
    trendBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '700',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
    },
    barWrapper: {
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    barTrack: {
        width: 8,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 4,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    card: {
        borderRadius: 20,
        padding: 20,
    },
    categoryRow: {
        marginBottom: 16,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    categoryDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
    },
    categoryStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryTime: {
        fontSize: 13,
        fontWeight: '500',
        width: 60,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    insightCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    insightTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    insightText: {
        fontSize: 14,
        lineHeight: 22,
        opacity: 0.9,
    },
    appRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appIconPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 15,
        fontWeight: '600',
    },
    appTime: {
        fontSize: 15,
        fontWeight: '600',
        opacity: 0.8,
    },
});
