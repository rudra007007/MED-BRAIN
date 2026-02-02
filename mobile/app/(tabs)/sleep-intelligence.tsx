import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';

export default function SleepIntelligenceScreen() {
  const sleepTrendData = [60, 72, 68, 80, 75, 70, 82];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreSection}>
          <View style={styles.scoreGlow} />
          <Text style={styles.scoreValue}>82%</Text>
          <Text style={styles.scoreLabel}>QUALITY SCORE</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>DURATION</Text>
            <Text style={styles.metricValue}>7h 42m</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>EFFICIENCY</Text>
            <Text style={styles.metricValue}>91%</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>7-Day Sleep Trend</Text>
          <View style={{ height: 140, marginVertical: 12 }}>
            <ChartScrubber
              data={sleepTrendData}
              height={140}
              gradientFrom="#2DD4BF"
              gradientTo="#3B82F6"
            />
          </View>
          <View style={styles.trendLabels}>
            <Text style={styles.trendLabel}>M</Text>
            <Text style={styles.trendLabel}>T</Text>
            <Text style={styles.trendLabel}>W</Text>
            <Text style={styles.trendLabel}>T</Text>
            <Text style={styles.trendLabel}>F</Text>
            <Text style={styles.trendLabel}>S</Text>
            <Text style={[styles.trendLabel, styles.trendLabelActive]}>S</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>AI INSIGHT</Text>
          <Text style={styles.insightText}>Deep sleep was 15% lower than your 30-day average.</Text>
          <Text style={styles.insightDescription}>
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
    backgroundColor: '#0F171A'
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
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center'
  },
  shareButton: {
    padding: 8
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
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 6
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: '#8E8E93'
  },
  trendLabelActive: {
    color: '#2DD4BF'
  },
  insightCard: {
    backgroundColor: 'rgba(21, 28, 36, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24
  },
  insightTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2DD4BF',
    letterSpacing: 1,
    marginBottom: 8
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 22
  },
  insightDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 20
  },
  bottomSpacing: {
    height: 20
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(15, 23, 26, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navItemActive: {
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5
  },
  navLabelActive: {
    color: '#2DD4BF'
  }
});
