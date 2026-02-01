<<<<<<< Updated upstream
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
=======
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Activity as ActivityIcon, Heart, Lightbulb, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { currentHealthSignals, riskDriftData, recentIntelligence } from '../../mocks/healthdata';
import type { HealthSignal } from '../../types/health';
<<<<<<< Updated upstream
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
=======
import { useAnalyticsStore } from '../../store/analytics.store';
import { useHealthStore } from '../../store/health.store';
import { useInsightsStore } from '../../store/insights.store';

export default function HomeScreen() {
  const router = useRouter();
  const { backendStatus, checkBackend } = useAnalyticsStore();
  const { healthData, fetchHealthData } = useHealthStore();
  const { patternInsights, fetchPatternInsights } = useInsightsStore();

  useEffect(() => {
    checkBackend();
    fetchHealthData();
    fetchPatternInsights();
  }, []);
>>>>>>> Stashed changes

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <Moon size={28} color="#06D6FF" />;
      case 'activity':
        return <ActivityIcon size={28} color="#06D6FF" />;
      case 'recovery':
        return <Heart size={28} color="#06D6FF" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profilePic}>
            <Text style={[styles.profileText, { color: colors.text }]}>A</Text>
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Health Intelligence</Text>
          <View style={styles.logoContainer}>
<<<<<<< Updated upstream
            <Sparkles size={24} color={colors.accent} />
=======
            <View style={[styles.statusDot, backendStatus && styles.statusDotActive]} />
            <Sparkles size={24} color="#06D6FF" />
>>>>>>> Stashed changes
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: colors.text }]}>{getTimeGreeting()}, Alex</Text>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>{riskDriftData.message}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.riskCard, { backgroundColor: colors.backgroundCard }]}
          activeOpacity={0.9}
          onPress={() => router.push('/pattern-insights')}
        >
          <View style={[styles.riskCardHeader, { backgroundColor: colors.backgroundAccent }]}>
            <View style={styles.waveBackground}>
              <View style={[styles.wave, { backgroundColor: colors.backgroundAccentSecondary }]} />
              <View style={[styles.wave, styles.wave2, { backgroundColor: colors.backgroundAccentSecondary }]} />
            </View>
            <Text style={[styles.riskStatus, { color: colors.accent }]}>Stable</Text>
            <View style={styles.riskBadge}>
              <Text style={[styles.riskBadgeText, { color: colors.accent }]}>→ LOW RISK DRIFT</Text>
            </View>
          </View>

          <View style={styles.riskCardContent}>
            <Text style={[styles.aiLabel, { color: colors.textSecondary }]}>AI ANALYSIS</Text>
            <Text style={[styles.riskTitle, { color: colors.text }]}>Risk Drift Indicator</Text>
            <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>{riskDriftData.description}</Text>
            <View style={styles.viewButton}>
              <Text style={[styles.viewButtonText, { color: '#FFFFFF' }]}>View Analysis</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Health Signals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/insight')}>
            <Text style={[styles.historyLink, { color: colors.accent }]}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signalsGrid}>
          {currentHealthSignals.map((signal: HealthSignal) => (
            <View key={signal.id} style={[styles.signalCard, { backgroundColor: colors.backgroundCard }]}>
              <View style={styles.signalIcon}>{getSignalIcon(signal.type)}</View>
              <Text style={[styles.signalLabel, { color: colors.textSecondary }]}>{signal.label}</Text>
              <Text style={[styles.signalValue, { color: colors.text }]}>{signal.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What changed recently</Text>
        </View>

<<<<<<< Updated upstream
        <View style={[styles.insightCard, { backgroundColor: colors.backgroundCard }]}>
=======
        {patternInsights.length > 0 && (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Lightbulb size={24} color="#06D6FF" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>LATEST INSIGHT</Text>
              <Text style={styles.insightTitle}>{patternInsights[0].title}</Text>
              <Text style={styles.insightDescription}>{patternInsights[0].description}</Text>
            </View>
          </View>
        )}

        <View style={styles.insightCard}>
>>>>>>> Stashed changes
          <View style={styles.insightIcon}>
            <Lightbulb size={24} color={colors.accent} />
          </View>
          <View style={styles.insightContent}>
            <Text style={[styles.insightText, { color: colors.text }]}>{recentIntelligence.message}</Text>
            <Text style={[styles.insightSuggestion, { color: colors.textSecondary }]}>{recentIntelligence.suggestion}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  logoContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: 2,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E8E93',
    borderWidth: 2,
    borderColor: '#F2F2F7',
  },
  statusDotActive: {
    backgroundColor: '#34C759',
  },
  greetingSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 22,
  },
  riskCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  riskCardHeader: {
    backgroundColor: '#D6F5FF',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#B8EEFF',
    opacity: 0.4,
    borderRadius: 100,
    transform: [{ scaleX: 3 }],
    top: 20,
  },
  wave2: {
    top: 40,
    opacity: 0.3,
  },
  riskStatus: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 8,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 214, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  riskCardContent: {
    padding: 24,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  riskDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: '#06D6FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  historyLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06D6FF',
  },
  signalsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  signalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signalIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F0FBFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  signalLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  signalValue: {
    fontSize: 13,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  insightIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#D6F5FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#636366',
    lineHeight: 20,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  insightSuggestion: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
