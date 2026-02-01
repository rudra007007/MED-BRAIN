import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Moon, Sun, Coffee, Zap, Activity, AlertCircle, CheckCircle, ArrowRight, Users } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { patternInsights } from '../mocks/healthdata';
import type { PatternInsight } from '../types/health';
import { Colors } from '@/constants/theme';

export default function PatternInsightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insight = patternInsights[0] as PatternInsight;

  const signalIcons: { [key: string]: any } = {
    'Fatigue': Moon,
    'Morning Stiffness': Sun,
    'Late-night Screen': Coffee,
    'Focus Drift': Zap,
    'Energy Dips': Activity,
    'REM Interruption': AlertCircle,
  };

  const getSignalIcon = (signal: string) => {
    const Icon = signalIcons[signal] || CheckCircle;
    return Icon;
  };

  const riskData = [0.4, 0.42, 0.5, 0.58, 0.72, 0.8, 0.88];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
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

        <View style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={[styles.riskLabel, { color: colors.textSecondary }]}>LIFESTYLE RISK DRIFT</Text>
            <View style={styles.riskBadge}>
              <Text style={[styles.riskPercent, { color: colors.accent }]}>+{insight.riskChange}%</Text>
              <Text style={[styles.riskSubtext, { color: colors.textSecondary }]}>ABOVE BASELINE</Text>
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

        <View style={styles.meaningCard}>
          <View style={styles.meaningHeader}>
            <View style={styles.meaningIcon}>
              <Info size={20} color={colors.accent} />
            </View>
            <Text style={[styles.meaningTitle, { color: colors.text }]}>What this means</Text>
          </View>
          <Text style={[styles.meaningText, { color: colors.textSecondary }]}>
            Your logs suggest a strong correlation between{' '}
            <Text style={[styles.meaningHighlight, { color: colors.accent }]}>{insight.correlation}</Text>.
          </Text>
          <Text style={[styles.meaningExplanation, { color: colors.textSecondary }]}>{insight.explanation}</Text>
        </View>

        {insight.communityComparison && (
          <View style={styles.communityCard}>
            <Users size={18} color={colors.textSecondary} />
            <Text style={[styles.communityText, { color: colors.textSecondary }]}>{insight.communityComparison}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Explore Lifestyle Adjustments</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.footer}>
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
  },
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
    transform: [{ scaleX: 2 }],
  },
  heroWave2: {
    backgroundColor: '#06D6FF',
    top: -50,
    transform: [{ scaleX: 2.5 }],
  },
  heroWave3: {
    backgroundColor: '#06D6FF',
    top: 0,
    transform: [{ scaleX: 3 }],
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
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
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
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
  footer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 20,
  },
});
