import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SleepIntelligenceScreen() {
  const sleepTrendData = [60, 72, 68, 80, 75, 70, 82];

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'tint');
  const cardItemBg = useThemeColor({}, 'backgroundAccent');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreSection}>
          <View style={styles.scoreGlow} />
          <Text style={styles.scoreValue}>82%</Text>
          <Text style={styles.scoreLabel}>QUALITY SCORE</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={[styles.metricLabel, { color: subTextColor }]}>DURATION</Text>
            <Text style={[styles.metricValue, { color: textColor }]}>7h 42m</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={[styles.metricLabel, { color: subTextColor }]}>EFFICIENCY</Text>
            <Text style={[styles.metricValue, { color: textColor }]}>91%</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardItemBg, borderColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>7-Day Sleep Trend</Text>
          <View style={{ height: 140, marginVertical: 12 }}>
            <ChartScrubber
              data={sleepTrendData}
              height={140}
              gradientFrom="#2DD4BF"
              gradientTo="#3B82F6"
            />
          </View>
          <View style={styles.trendLabels}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <Text key={i} style={[
                styles.trendLabel,
                { color: subTextColor },
                day === 'S' && { color: accentColor } // Example highlighting last one
              ]}>{day}</Text>
            ))}
          </View>
        </View>

        <View style={[styles.insightCard, { borderColor: accentColor + '30', backgroundColor: cardColor + 'F0' }]}>
          <Text style={[styles.insightTitle, { color: accentColor }]}>AI INSIGHT</Text>
          <Text style={[styles.insightText, { color: textColor }]}>Deep sleep was 15% lower than your 30-day average.</Text>
          <Text style={[styles.insightDescription, { color: subTextColor }]}>
            {"Your body's physical recovery may be slightly hindered. Try to avoid blue light exposure at least 60 minutes before your target sleep time tomorrow."}
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative'
  },
  scoreGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
    top: -40,
    left: '50%',
    marginLeft: -90
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2DD4BF',
    letterSpacing: 2,
    marginTop: 4
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 6
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 12
  },
  trendLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  insightCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 22
  },
  insightDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20
  },
  bottomSpacing: {
    height: 20
  }
});
