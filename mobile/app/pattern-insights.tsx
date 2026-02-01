import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  Info,
  Users,
  Wind,
  Zap
} from 'lucide-react-native';
import { useInsightsStore } from '../store/insights.store';

export default function PatternInsightsScreen() {
  const router = useRouter();
  const { patternInsights, loadingInsights } = useInsightsStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(loadingInsights);
  }, [loadingInsights]);

  const insight = patternInsights[0] || {
    title: 'Sleep Quality Decline',
    description: 'Your sleep patterns show significant changes',
    signals: ['Fatigue', 'Late-night Screen', 'Morning Stiffness'],
    riskChange: 12,
    timeframe: 'Last 7 days',
    confidence: 0.85,
    explanation: 'Late evening screen exposure correlates with reduced sleep duration.',
    communityComparison:
      '73% of users with similar patterns report improved sleep after lifestyle adjustments',
    correlation: 'evening screen usage and sleep quality'
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Symptom Insight</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading && patternInsights.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#06D6FF" />
            <Text style={styles.loadingText}>Loading insights...</Text>
          </View>
        ) : null}

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
              <Text style={[styles.heroBadgeText, styles.heroBadgeSuccessText]}>
                PATTERN MATCH: HIGH
              </Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{insight.title}</Text>
          <Text style={styles.heroDescription}>{insight.description}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Extracted Signals</Text>
          <Text style={styles.signalCount}>{insight.signals?.length || 0} signals found</Text>
        </View>

        {chartSections.map((section) => (
          <View key={section.id} style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.chartTitle}>{section.title}</Text>
                <Text style={styles.chartSubtitle}>{section.subtitle}</Text>
              </View>
              <View
                key={index}
                style={[styles.signalChip, isHighlighted && styles.signalChipHighlighted]}
              >
                <Icon size={16} color={isHighlighted ? '#06D6FF' : '#636366'} />
                <Text style={[styles.signalChipText, isHighlighted && styles.signalChipTextHighlighted]}>
                  {signal}
                </Text>
              </View>
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
                      backgroundColor: index >= 4 ? '#06D6FF' : '#B8EEFF'
                    }
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

        {insight.communityComparison ? (
          <View style={styles.communityCard}>
            <Users size={18} color="#8E8E93" />
            <Text style={styles.communityText}>{insight.communityComparison}</Text>
          </View>
        ) : null}

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

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/community')}>
          <Text style={styles.navLabel}>Community</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E'
  },
  infoButton: {
    padding: 8
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1C1C1E',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  heroDescription: {
    fontSize: 14,
    color: '#636366',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20
  },
  sectionHeader: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  signalCount: {
    fontSize: 12,
    color: '#8E8E93'
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
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E8E8EB'
  },
  signalChipHighlighted: {
    backgroundColor: '#E0F7FF',
    borderColor: '#06D6FF'
  },
  signalChipText: {
    fontSize: 13,
    color: '#636366',
    fontWeight: '500'
  },
  signalChipTextHighlighted: {
    color: '#06D6FF',
    fontWeight: '600'
  },
  riskCard: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4
  },
  chartSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)'
  },
  riskPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35'
  },
  riskSubtext: {
    fontSize: 10,
    color: '#FF6B35',
    marginTop: 2
  },
  riskTimeframe: {
    fontSize: 12,
    color: '#636366',
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
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  insightHeader: {
    flexDirection: 'row',
    gap: 12
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  meaningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#06D6FF'
  },
  meaningText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1C1C1E',
    marginBottom: 12
  },
  meaningHighlight: {
    fontWeight: '700',
    color: '#1C1C1E'
  },
  communityText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#636366'
  },
  communityCard: {
    backgroundColor: '#F5F5F7',
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
    lineHeight: 19,
    color: '#636366'
  },
  actionButton: {
    backgroundColor: '#06D6FF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8
  },
  navItemActive: {
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  footer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#636366',
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
    color: '#8E8E93',
    fontWeight: '500'
  },
  bottomSpacing: {
    height: 20
  }
});
