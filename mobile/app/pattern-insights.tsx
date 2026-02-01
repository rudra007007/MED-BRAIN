import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Moon, Sun, Coffee, Zap, Activity, AlertCircle, CheckCircle, ArrowRight, Users, Wind, Heart } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useInsightsStore } from '../store/insights.store';
import { useSymptomStore } from '../store/symptom.store';
import { Colors } from '@/constants/theme';

interface PatternInsight {
  title: string;
  description: string;
  signals: string[];
  riskChange: number;
  timeframe: string;
  confidence: number;
  correlation?: string;
  explanation?: string;
  communityComparison?: string;
}

export default function PatternInsightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { patternInsights, isLoading, fetchPatternInsights } = useInsightsStore();
  const { symptoms } = useSymptomStore();

  useEffect(() => {
    fetchPatternInsights();
  }, [fetchPatternInsights]);

  const insight: PatternInsight = patternInsights?.[0] || {
    title: 'Analyzing Your Symptoms',
    description: 'AI analysis in progress. We\'re examining your health patterns.',
    signals: symptoms?.map((s: any) => s.normalized) || [],
    riskChange: 0,
    timeframe: 'Current session',
    confidence: 0.5,
    correlation: 'sleep patterns and fatigue',
    explanation: 'Your data shows consistent patterns that align with community health insights.',
    communityComparison: 'Your pattern matches 87% of users with similar health logs.',
  };

  const signalIcons: { [key: string]: any } = {
    'Fatigue': Moon,
    'Morning Stiffness': Sun,
    'Late-night Screen': Coffee,
    'Focus Drift': Zap,
    'Energy Dips': Activity,
    'REM Interruption': AlertCircle,
  };

  const getSignalIcon = (signal: string) => {
    const signalLower = signal.toLowerCase();
    if (signalLower.includes('fatigue') || signalLower.includes('energy')) return Activity;
    if (signalLower.includes('screen')) return Zap;
    if (signalLower.includes('heart')) return Heart;
    return Wind;
  };

  const riskData = [0.4, 0.42, 0.5, 0.58, 0.72, 0.8, 0.88];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: colors.backgroundCard, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Symptom Insight</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading && patternInsights.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading insights...</Text>
          </View>
        ) : null}

        <View style={[styles.heroCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.heroWaves}>
            <View style={[styles.heroWave, styles.heroWave1]} />
            <View style={[styles.heroWave, styles.heroWave2]} />
            <View style={[styles.heroWave, styles.heroWave3]} />
          </View>
          <View style={styles.heroBadges}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PRIMARY EXTRACTION</Text>
            </View>
            <View style={[styles.heroBadge, styles.heroBadgeSuccess]}>
              <CheckCircle size={14} color={colors.accent} />
              <Text style={[styles.heroBadgeText, styles.heroBadgeSuccessText, { color: colors.accent }]}>PATTERN MATCH: HIGH</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>{insight.title}</Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>{insight.description}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Signals</Text>
          <Text style={[styles.signalCount, { color: colors.textSecondary }]}>{insight.signals?.length || 0} signals found</Text>
        </View>

        <View style={styles.signalsGrid}>
          {(insight.signals || []).map((signal: string, index: number) => {
            const Icon = getSignalIcon(signal);
            const isHighlighted = signal === 'Late-night Screen';
            return (
              <View
                key={index}
                style={[styles.signalChip, isHighlighted && styles.signalChipHighlighted, { backgroundColor: colors.backgroundCard }]}
              >
                <Icon size={16} color={isHighlighted ? colors.accent : colors.textSecondary} />
                <Text style={[styles.signalChipText, { color: colors.text }, isHighlighted && styles.signalChipTextHighlighted]}>
                  {signal}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.riskCard, { backgroundColor: '#FFF5E6' }]}>
          <View style={styles.riskHeader}>
            <Text style={styles.riskLabel}>LIFESTYLE RISK DRIFT</Text>
            <View style={styles.riskBadge}>
              <Text style={[styles.riskPercent, { color: colors.accent }]}>+{Math.abs(insight.riskChange)}%</Text>
              <Text style={[styles.riskSubtext, { color: colors.textSecondary }]}>ABOVE BASELINE</Text>
            </View>
          </View>
          <Text style={[styles.riskTimeframe, { color: colors.textSecondary }]}>{insight.timeframe}</Text>

          <View style={styles.riskChart}>
            {riskData.map((value, index) => (
              <View key={index} style={styles.riskBar}>
                <View
                  style={[
                    styles.riskBarFill,
                    {
                      height: `${value * 100}%`,
                      backgroundColor: index >= 4 ? colors.accent : '#B8EEFF'
                    }
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.meaningCard, { backgroundColor: '#F0F9FF' }]}>
          <View style={styles.meaningHeader}>
            <View style={styles.meaningIcon}>
              <Info size={20} color={colors.accent} />
            </View>
            <Text style={[styles.meaningTitle, { color: colors.text }]}>What this means</Text>
          </View>
          <Text style={[styles.meaningText, { color: colors.text }]}>
            Your logs suggest a strong correlation between{' '}
            <Text style={[styles.meaningHighlight, { color: colors.accent }]}>{insight.correlation ?? 'your health patterns'}</Text>.
          </Text>
          {insight.explanation ? (
            <Text style={[styles.meaningExplanation, { color: colors.textSecondary }]}>{insight.explanation}</Text>
          ) : null}
        </View>

        {insight.communityComparison ? (
          <View style={[styles.communityCard, { backgroundColor: colors.backgroundCard }]}>
            <Users size={18} color={colors.textSecondary} />
            <Text style={[styles.communityText, { color: colors.textSecondary }]}>{insight.communityComparison}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Explore Lifestyle Adjustments</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={[styles.footer, { backgroundColor: '#FFF9E6' }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Pattern Insights provides health intelligence based on user logs. This is not a medical
            diagnosis or clinical advice.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  infoButton: {
    padding: 8
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  heroCard: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8EB'
  },
  heroWaves: {
    height: 80,
    backgroundColor: '#F0F9FF',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  heroWave: {
    flex: 1,
    backgroundColor: '#06D6FF',
    opacity: 0.3,
    height: '40%',
    marginHorizontal: 2
  },
  heroWave1: {
    height: '30%'
  },
  heroWave2: {
    height: '50%'
  },
  heroWave3: {
    height: '35%'
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0'
  },
  heroBadgeSuccess: {
    backgroundColor: '#E8F5E9'
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  heroBadgeSuccessText: {
    color: '#34C759'
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    zIndex: 1,
  },
  heroSignalCount: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  signalCount: {
    fontSize: 12
  },
  signalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24
  },
  signalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8EB'
  },
  signalChipHighlighted: {
    backgroundColor: '#E0F7FF',
    borderColor: '#06D6FF'
  },
  signalChipText: {
    fontSize: 13,
    fontWeight: '500'
  },
  signalChipTextHighlighted: {
    color: '#06D6FF',
    fontWeight: '600'
  },
  riskCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase'
  },
  riskBadge: {
    backgroundColor: '#FFE8CC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center'
  },
  riskPercent: {
    fontSize: 16,
    fontWeight: '700'
  },
  riskSubtext: {
    fontSize: 10,
    marginTop: 2
  },
  riskTimeframe: {
    fontSize: 12,
    marginBottom: 16
  },
  riskChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    gap: 4
  },
  riskBar: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  riskBarFill: {
    width: '100%',
    borderRadius: 4
  },
  meaningCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10
  },
  meaningIcon: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: '#D6F5FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  meaningText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12
  },
  meaningHighlight: {
    fontWeight: '700'
  },
  meaningExplanation: {
    fontSize: 14,
    lineHeight: 21
  },
  communityCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 24
  },
  communityText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19
  },
  actionButton: {
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  footer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500'
  },
  bottomSpacing: {
    height: 20
  }
});
