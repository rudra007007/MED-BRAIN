import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Activity as ActivityIcon, Heart, Lightbulb, Smartphone, TrendingUp, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { currentHealthSignals, riskDriftData, recentIntelligence, lifestyleTrajectoryRing } from '../../mocks/healthdata';
import type { HealthSignal } from '../../types/health';
import { useAnalyticsStore } from '../../store/analytics.store';
import { useHealthStore } from '../../store/health.store';
import { useInsightsStore } from '../../store/insights.store';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import LifestyleTrajectoryRing from '@/components/ui/LifestyleTrajectoryRing';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { checkBackend } = useAnalyticsStore();
  const { fetchHealthData } = useHealthStore();
  const { patternInsights, fetchPatternInsights } = useInsightsStore();

  useEffect(() => {
    checkBackend();
    fetchHealthData();
    fetchPatternInsights();
  }, [checkBackend, fetchHealthData, fetchPatternInsights]);

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
      case 'screen':
        return <Smartphone size={28} color="#06D6FF" />;
      default:
        return null;
    }
  };



  // ... imports

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: colors.text }]}>{getTimeGreeting()}, Alex</Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.statusSuccess }]} />
            <Text style={[styles.statusText, { color: colors.text }]}>{riskDriftData.message}</Text>
          </View>
        </View>

        <LifestyleTrajectoryRing
          lifestyleDrift={lifestyleTrajectoryRing.lifestyleDrift}
          riskTrajectory={lifestyleTrajectoryRing.riskTrajectory}
          routineConsistency={lifestyleTrajectoryRing.routineConsistency}
          onPress={() => router.push('/pattern-insights')}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Health Signals</Text>
          <TouchableOpacity onPress={() => router.push('/pattern-insights')}>
            <Text style={[styles.historyLink, { color: colors.accent }]}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signalsGrid}>
          {currentHealthSignals.map((signal: HealthSignal, index: number) => (
            <TouchableOpacity
              key={signal.id}
              onPress={() => {
                if (signal.type === 'sleep') router.push('/sleep-intelligence');
                else if (signal.type === 'activity') router.push('/activity-detail');
                else if (signal.type === 'recovery') router.push('/recovery-signal');
              }}
              style={styles.signalCardWrapper}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[
                  colorScheme === 'dark' ? 'rgba(20, 241, 217, 0.08)' : 'rgba(20, 241, 217, 0.05)',
                  colorScheme === 'dark' ? 'rgba(74, 144, 226, 0.06)' : 'rgba(74, 144, 226, 0.03)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.signalCard, { backgroundColor: colors.backgroundCard }]}
              >
                <View style={[styles.signalIconWrapper, { backgroundColor: colorScheme === 'dark' ? 'rgba(20, 241, 217, 0.15)' : 'rgba(20, 241, 217, 0.1)' }]}>
                  {getSignalIcon(signal.type)}
                </View>
                <Text style={[styles.signalLabel, { color: colors.textSecondary }]}>{signal.label}</Text>
                <Text style={[styles.signalValue, { color: colors.text }]}>{signal.value}</Text>
                <View style={styles.signalArrow}>
                  <ArrowRight size={14} color={colors.accent} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Insights</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllLink, { color: colors.accent }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {patternInsights.length > 0 && (
          <TouchableOpacity
            style={[styles.insightCardWrapper, { backgroundColor: colors.backgroundCard }]}
            activeOpacity={0.85}
            onPress={() => router.push('/pattern-insights')}
          >
            <View style={[styles.insightIconGradient, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.1)' }]}>
              <Lightbulb size={22} color="#FFC107" fill="#FFC107" />
            </View>
            <View style={styles.insightContent}>
              <View style={styles.insightHeader}>
                <Text style={[styles.insightLabel, { color: colors.textSecondary }]}>LATEST PATTERN</Text>
                {patternInsights[0].riskChange && (
                  <View style={[styles.riskBadge, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                    <TrendingUp size={12} color="#FF3B30" />
                    <Text style={styles.riskText}>+{patternInsights[0].riskChange}%</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.insightTitle, { color: colors.text }]}>{patternInsights[0].title}</Text>
              <Text style={[styles.insightDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {patternInsights[0].description}
              </Text>
            </View>
            <ArrowRight size={18} color={colors.textSecondary} style={styles.insightArrow} />
          </TouchableOpacity>
        )}

        <View style={[styles.quickTipCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.quickTipHeader}>
            <View style={[styles.quickTipIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.1)' }]}>
              <Heart size={18} color="#34C759" />
            </View>
            <Text style={[styles.quickTipLabel, { color: colors.textSecondary }]}>PERSONALIZED TIP</Text>
          </View>
          <Text style={[styles.quickTipText, { color: colors.text }]}>{recentIntelligence.message}</Text>
          <Text style={[styles.quickTipSuggestion, { color: colors.textSecondary }]}>{recentIntelligence.suggestion}</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileText: {
    fontSize: 18,
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
  },
  logoContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
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
    borderColor: '#F2F2F7'
  },
  statusDotActive: {
    backgroundColor: '#34C759'
  },
  greetingSection: {
    marginBottom: 28,
    marginTop: 8,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 1
  },
  historyLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06D6FF'
  },
  signalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 36,
  },
  signalCardWrapper: {
    width: '48%',
  },
  signalCard: {
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  signalIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  signalLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signalValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  signalArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.4,
  },
  insightCardWrapper: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  insightIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  insightContent: {
    flex: 1,
    paddingRight: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.7,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF3B30',
  },
  insightTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.85,
  },
  insightArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.5,
  },
  quickTipCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  quickTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  quickTipIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTipLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.7,
  },
  quickTipText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  quickTipSuggestion: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.85,
  },
  viewAllLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20
  }
});
