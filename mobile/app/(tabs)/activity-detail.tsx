import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';

export default function ActivityDetailScreen() {
  const activityTrendData = [50, 45, 48, 52, 49, 51, 47];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>VOLUME</Text>
            <Text style={styles.metricValue}>6.4k</Text>
            <Text style={styles.metricUnit}>steps</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={12} color="#10B981" />
              <Text style={styles.trendText}>12% VS LAST WK</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>INTENSITY</Text>
            <Text style={styles.metricValue}>High</Text>
            <Text style={styles.metricUnit}>active zone</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Consistency vs Baseline</Text>
              <Text style={styles.cardSubtitle}>Last 30 days movement variance</Text>
            </View>
            <View style={styles.statusBadge}>
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
            <Text style={styles.chartLabel}>30 DAYS AGO</Text>
            <Text style={styles.chartLabel}>BASELINE</Text>
            <Text style={styles.chartLabel}>TODAY</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>INTELLIGENCE INSIGHT</Text>
          <Text style={styles.insightText}>Activity patterns are stable, though late-evening movement has decreased.</Text>
          <Text style={styles.insightDescription}>
            This shift might correlate with your improved sleep onset latency recorded this week.
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Active Frequency</Text>
          <Text style={styles.infoValue}>5.2 days per week</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Longest Streak</Text>
          <Text style={styles.infoValue}>12 Days (Current)</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 4
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
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
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
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
    color: '#FFFFFF',
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8E8E93'
  },
  statusBadge: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
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
    color: '#8E8E93'
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
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20
  },
  insightDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 18
  },
  infoRow: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
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
    color: '#FFFFFF'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93'
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
