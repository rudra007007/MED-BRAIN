import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Moon, Sun, Coffee, Zap, Activity, AlertCircle, CheckCircle, ArrowRight, Users } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { patternInsights } from '../mocks/healthdata';
import type { PatternInsight } from '../types/health';

export default function PatternInsightsScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Symptom Insight</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color="#8E8E93" />
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
              <Text style={styles.heroBadgeText}>PRIMARY EXTRACTION</Text>
            </View>
            <View style={[styles.heroBadge, styles.heroBadgeSuccess]}>
              <CheckCircle size={14} color="#34C759" />
              <Text style={[styles.heroBadgeText, styles.heroBadgeSuccessText]}>PATTERN MATCH: HIGH</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{insight.title}</Text>
          <Text style={styles.heroDescription}>{insight.description}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Extracted Signals</Text>
          <Text style={styles.signalCount}>{insight.signals.length} signals found</Text>
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
                <Icon size={16} color={isHighlighted ? '#06D6FF' : '#636366'} />
                <Text style={[styles.signalChipText, isHighlighted && styles.signalChipTextHighlighted]}>
                  {signal}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={styles.riskLabel}>LIFESTYLE RISK DRIFT</Text>
            <View style={styles.riskBadge}>
              <Text style={styles.riskPercent}>+{insight.riskChange}%</Text>
              <Text style={styles.riskSubtext}>ABOVE BASELINE</Text>
            </View>
          </View>
          <Text style={styles.riskTimeframe}>{insight.timeframe}</Text>

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
              <Info size={20} color="#06D6FF" />
            </View>
            <Text style={styles.meaningTitle}>What this means</Text>
          </View>
          <Text style={styles.meaningText}>
            Your logs suggest a strong correlation between{' '}
            <Text style={styles.meaningHighlight}>{insight.correlation}</Text>.
          </Text>
          <Text style={styles.meaningExplanation}>{insight.explanation}</Text>
        </View>

        {insight.communityComparison && (
          <View style={styles.communityCard}>
            <Users size={18} color="#8E8E93" />
            <Text style={styles.communityText}>{insight.communityComparison}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>Explore Lifestyle Adjustments</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
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
    color: '#1C1C1E',
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroBadgeSuccessText: {
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.85)',
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
    color: '#1C1C1E',
  },
  signalCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06D6FF',
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
    color: '#636366',
  },
  signalChipTextHighlighted: {
    color: '#06D6FF',
    fontWeight: '600',
  },
  riskCard: {
    backgroundColor: '#1C1C1E',
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
    color: '#8E8E93',
    letterSpacing: 1,
  },
  riskBadge: {
    alignItems: 'flex-end',
  },
  riskPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: '#06D6FF',
  },
  riskSubtext: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  riskTimeframe: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color: '#06D6FF',
  },
  meaningText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1C1C1E',
    marginBottom: 12,
  },
  meaningHighlight: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  meaningExplanation: {
    fontSize: 14,
    lineHeight: 21,
    color: '#636366',
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
    color: '#636366',
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
    color: '#FFFFFF',
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
    color: '#636366',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 20,
  },
});
