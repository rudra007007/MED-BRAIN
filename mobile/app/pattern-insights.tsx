<<<<<<< Updated upstream
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
=======
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Moon, Sun, Coffee, Zap, Activity, AlertCircle, CheckCircle, ArrowRight, Users } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
<<<<<<< Updated upstream
import { patternInsights } from '../mocks/healthdata';
import type { PatternInsight } from '../types/health';
import { Colors } from '@/constants/theme';

export default function PatternInsightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insight = patternInsights[0] as PatternInsight;
=======
import { useInsightsStore } from '../store/insights.store';
import { useSymptomStore } from '../store/symptom.store';

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
  const { patternInsights, isLoading, fetchPatternInsights } = useInsightsStore();
  const { symptoms } = useSymptomStore();

  useEffect(() => {
    fetchPatternInsights();
  }, []);

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
>>>>>>> Stashed changes

  const signalIcons: { [key: string]: any } = {
    'Fatigue': Moon,
    'Morning Stiffness': Sun,
    'Late-night Screen': Coffee,
    'Focus Drift': Zap,
    'Energy Dips': Activity,
    'REM Interruption': AlertCircle,
  };

  const getSignalIcon = (signal: string) => {
    return signalIcons[signal] || CheckCircle;
  };

  const riskData = [0.4, 0.42, 0.5, 0.58, 0.72, 0.8, 0.88];

  const signals = insight.signals && insight.signals.length > 0 
    ? insight.signals 
    : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
<<<<<<< Updated upstream
      <View style={[styles.header, { backgroundColor: colors.backgroundCard, borderBottomColor: colors.border }]}>
=======
      
      <View style={styles.header}>
>>>>>>> Stashed changes
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Symptom Insight</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading && (!patternInsights || patternInsights.length === 0) ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06D6FF" />
            <Text style={styles.loadingText}>Loading insights...</Text>
          </View>
        ) : null}

        {/* Hero Card Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroWaves}>
            <View style={[styles.heroWave, styles.heroWave1]} />
            <View style={[styles.heroWave, styles.heroWave2]} />
            <View style={[styles.heroWave, styles.heroWave3]} />
          </View>

          <View style={styles.heroBadges}>
            <View style={styles.heroBadge}>
              <Text style={[styles.heroBadgeText, { color: '#FFFFFF' }]}>PRIMARY EXTRACTION</Text>
            </View>
            <View style={[styles.heroBadge, styles.heroBadgeSuccess]}>
<<<<<<< Updated upstream
              <CheckCircle size={14} color={colors.accent} />
              <Text style={[styles.heroBadgeText, styles.heroBadgeSuccessText, { color: colors.accent }]}>PATTERN MATCH: HIGH</Text>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>{insight.title}</Text>
          <Text style={[styles.heroDescription, { color: '#FFFFFF' }]}>{insight.description}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Signals</Text>
          <Text style={[styles.signalCount, { color: colors.textSecondary }]}>{insight.signals.length} signals found</Text>
        </View>

        <View style={styles.signalsGrid}>
          {insight.signals.map((signal: string, index: number) => {
            const Icon = getSignalIcon(signal);
            const isHighlighted = signal === 'Late-night Screen';
            return (
              <View
                key={index}
                style={[styles.signalChip, isHighlighted && styles.signalChipHighlighted]}
              >
                <Icon size={16} color={isHighlighted ? colors.accent : colors.textSecondary} />
                <Text style={[styles.signalChipText, { color: colors.text }, isHighlighted && styles.signalChipTextHighlighted]}>
                  {signal}
                </Text>
              </View>
            );
          })}
        </View>
=======
              <CheckCircle size={14} color="#34C759" />
              <Text style={[styles.heroBadgeText, styles.heroBadgeSuccessText]}>
                PATTERN MATCH: HIGH
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{insight.title}</Text>
          <Text style={styles.heroDescription}>{insight.description}</Text>
          <Text style={styles.heroSignalCount}>
            {signals.length > 0 ? `${signals.length} signals found` : 'No signals detected'}
          </Text>
        </View>

        {/* Extracted Signals Section */}
        {signals.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Extracted Signals</Text>
              <Text style={styles.signalCount}>{signals.length} signals</Text>
            </View>

            <View style={styles.signalsGrid}>
              {signals.map((signal: string, index: number) => {
                const Icon = getSignalIcon(signal);
                const isHighlighted = signal === 'Late-night Screen';
                return (
                  <View
                    key={index}
                    style={[
                      styles.signalChip,
                      isHighlighted && styles.signalChipHighlighted,
                    ]}
                  >
                    <Icon 
                      size={16} 
                      color={isHighlighted ? '#06D6FF' : '#636366'} 
                    />
                    <Text 
                      style={[
                        styles.signalChipText,
                        isHighlighted && styles.signalChipTextHighlighted,
                      ]}
                    >
                      {signal}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
>>>>>>> Stashed changes

        {/* Risk Drift Card Section */}
        <View style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={[styles.riskLabel, { color: colors.textSecondary }]}>LIFESTYLE RISK DRIFT</Text>
            <View style={styles.riskBadge}>
<<<<<<< Updated upstream
              <Text style={[styles.riskPercent, { color: colors.accent }]}>+{insight.riskChange}%</Text>
              <Text style={[styles.riskSubtext, { color: colors.textSecondary }]}>ABOVE BASELINE</Text>
=======
              <Text style={styles.riskPercent}>
                +{Math.abs(insight.riskChange)}%
              </Text>
              <Text style={styles.riskSubtext}>ABOVE BASELINE</Text>
>>>>>>> Stashed changes
            </View>
          </View>
          <Text style={[styles.riskTimeframe, { color: colors.text }]}>{insight.timeframe}</Text>

          <View style={styles.riskChart}>
            {riskData.map((value, index) => (
              <View key={index} style={styles.riskBar}>
                <View
                  style={[
                    styles.riskBarFill,
                    {
                      height: `${value * 100}%`,
                      backgroundColor: index >= 4 ? '#06D6FF' : '#B8EEFF',
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* What This Means Section */}
        <View style={styles.meaningCard}>
          <View style={styles.meaningHeader}>
            <View style={styles.meaningIcon}>
              <Info size={20} color={colors.accent} />
            </View>
            <Text style={[styles.meaningTitle, { color: colors.text }]}>What this means</Text>
          </View>
          <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
            Your logs suggest a strong correlation between{' '}
<<<<<<< Updated upstream
            <Text style={[styles.meaningHighlight, { color: colors.accent }]}>{insight.correlation}</Text>.
          </Text>
          <Text style={[styles.meaningExplanation, { color: colors.textSecondary }]}>{insight.explanation}</Text>
=======
            <Text style={styles.meaningHighlight}>
              {insight.correlation || 'your health patterns'}
            </Text>
            .
          </Text>
          {insight.explanation && (
            <Text style={styles.meaningExplanation}>{insight.explanation}</Text>
          )}
>>>>>>> Stashed changes
        </View>

        {/* Community Comparison Section */}
        {insight.communityComparison && (
          <View style={styles.communityCard}>
            <Users size={18} color={colors.textSecondary} />
            <Text style={[styles.communityText, { color: colors.textSecondary }]}>{insight.communityComparison}</Text>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Explore Lifestyle Adjustments</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Footer Notice */}
        <View style={styles.footer}>
<<<<<<< Updated upstream
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Pattern Insights provides health intelligence based on user logs. This is not a medical
            diagnosis or clinical advice.
=======
          <Text style={styles.footerText}>
            Pattern Insights provides health intelligence based on user logs. This is not a 
            medical diagnosis or clinical advice.
>>>>>>> Stashed changes
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  /* Hero Card Styles */
  heroCard: {
    backgroundColor: '#2C5364',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  heroWaves: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroWave: {
    position: 'absolute',
    left: -50,
    right: -50,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
  },
  heroWave1: {
    backgroundColor: '#06D6FF',
    top: -100,
  },
  heroWave2: {
    backgroundColor: '#06D6FF',
    top: -50,
  },
  heroWave3: {
    backgroundColor: '#06D6FF',
    top: 0,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
    zIndex: 1,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroBadgeSuccess: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroBadgeSuccessText: {
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    zIndex: 1,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
<<<<<<< Updated upstream
=======
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
    zIndex: 1,
>>>>>>> Stashed changes
  },
  heroSignalCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06D6FF',
    zIndex: 1,
  },

  /* Section Header Styles */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  signalCount: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* Signals Grid Styles */
  signalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  signalChip: {
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalChipHighlighted: {
    backgroundColor: '#E0F4FF',
    borderWidth: 1,
    borderColor: '#06D6FF',
  },
  signalChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signalChipTextHighlighted: {
    fontWeight: '600',
  },

  /* Risk Card Styles */
  riskCard: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  riskBadge: {
    alignItems: 'flex-end',
  },
  riskPercent: {
    fontSize: 24,
    fontWeight: '800',
  },
  riskSubtext: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  riskTimeframe: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  riskChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
  },
  riskBar: {
    flex: 1,
    height: 100,
    justifyContent: 'flex-end',
  },
  riskBarFill: {
    width: '100%',
    borderRadius: 4,
  },

  /* Meaning Card Styles */
  meaningCard: {
    backgroundColor: '#E8F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  meaningIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D6F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  meaningText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  meaningHighlight: {
    fontWeight: '700',
  },
  meaningExplanation: {
    fontSize: 14,
    lineHeight: 21,
  },

  /* Community Card Styles */
  communityCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  communityText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },

  /* Action Button Styles */
  actionButton: {
    backgroundColor: '#06D6FF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  /* Footer Styles */
  footer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  /* Loading Styles */
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },

  /* Bottom Spacing */
  bottomSpacing: {
    height: 20,
  },
});
