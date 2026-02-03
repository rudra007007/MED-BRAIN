import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ActivityDetailScreen() {
  const activityTrendData = [50, 45, 48, 52, 49, 51, 47];

  // Theme Hooks
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const cardItemBg = useThemeColor({}, 'backgroundAccent');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={[styles.metricLabel, { color: subTextColor }]}>VOLUME</Text>
            <Text style={[styles.metricValue, { color: textColor }]}>6.4k</Text>
            <Text style={[styles.metricUnit, { color: subTextColor }]}>steps</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.trendText}>12% VS LAST WK</Text>
            </View>
          </View>
          <View style={[styles.metricCard, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={[styles.metricLabel, { color: subTextColor }]}>INTENSITY</Text>
            <Text style={[styles.metricValue, { color: textColor }]}>High</Text>
            <Text style={[styles.metricUnit, { color: subTextColor }]}>active zone</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardItemBg, borderColor }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: textColor }]}>Consistency vs Baseline</Text>
              <Text style={[styles.cardSubtitle, { color: subTextColor }]}>Last 30 days movement variance</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(45, 212, 191, 0.1)' }]}>
              <Text style={styles.statusBadgeText}>STABLE</Text>
            </View>
          </View>

          <View style={{ height: 160, marginVertical: 20 }}>
            <ChartScrubber
              data={activityTrendData}
              height={160}
              gradientFrom="#2DD4BF"
              gradientTo="#3B82F6"
            />
          </View>

          <View style={styles.chartLabels}>
            <Text style={[styles.chartLabel, { color: subTextColor }]}>30 DAYS AGO</Text>
            <Text style={[styles.chartLabel, { color: subTextColor }]}>BASELINE</Text>
            <Text style={[styles.chartLabel, { color: subTextColor }]}>TODAY</Text>
          </View>
        </View>

        <View style={[styles.insightCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.insightTitle, { color: tintColor }]}>INTELLIGENCE INSIGHT</Text>
          <Text style={[styles.insightText, { color: textColor }]}>Activity patterns are stable, though late-evening movement has decreased.</Text>
          <Text style={[styles.insightDescription, { color: subTextColor }]}>
            This shift might correlate with your improved sleep onset latency recorded this week.
          </Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: cardItemBg, borderColor }]}>
          <Text style={[styles.infoLabel, { color: textColor }]}>Active Frequency</Text>
          <Text style={[styles.infoValue, { color: subTextColor }]}>5.2 days per week</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: cardItemBg, borderColor }]}>
          <Text style={[styles.infoLabel, { color: textColor }]}>Longest Streak</Text>
          <Text style={[styles.infoValue, { color: subTextColor }]}>12 Days (Current)</Text>
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
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 8
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4
  },
  trendText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981'
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2DD4BF',
    letterSpacing: 0.5
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8
  },
  chartLabel: {
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
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20
  },
  insightDescription: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18
  },
  infoRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 20
  }
});
