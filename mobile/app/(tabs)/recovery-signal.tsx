import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ChartScrubber from '../../components/ui/ChartScrubber';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RecoverySignalScreen() {
  const hrvData = [60, 55, 70, 50, 75, 55, 62];

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
        <View style={styles.hrvSection}>
          <View style={styles.hrvIcon}>
            <Text style={styles.hrvIconText}>💓</Text>
          </View>
          <Text style={[styles.hrvValue, { color: textColor }]}>55</Text>
          <Text style={[styles.hrvUnit, { color: subTextColor }]}>ms</Text>
          <Text style={[styles.hrvLabel, { color: subTextColor }]}>Heart Rate Variability (HRV)</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>SLIGHTLY SUPPRESSED</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardItemBg, borderColor }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardTitle, { color: textColor }]}>Trend Analysis</Text>
              <Text style={[styles.cardSubtitle, { color: subTextColor }]}>Vs. 60-day baseline (62ms)</Text>
            </View>
          </View>

          <View style={{ height: 140, marginVertical: 20 }}>
            <ChartScrubber
              data={hrvData}
              height={140}
              gradientFrom="#3B82F6"
              gradientTo="#2DD4BF"
            />
          </View>

          <View style={styles.dayLabels}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
              <Text key={day} style={[
                styles.dayLabel,
                { color: subTextColor },
                day === 'SUN' && { color: textColor }
              ]}>{day}</Text>
            ))}
          </View>
        </View>

        <View style={[styles.insightCard, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.insightTitle, { color: tintColor }]}>AI CORRELATION INSIGHT</Text>
          <Text style={[styles.insightText, { color: textColor }]}>
            Recovery signal is slightly suppressed today, likely linked to the{' '}
            <Text style={[styles.insightHighlight, { color: tintColor }]}>late meal detected last night</Text>.
          </Text>

          <View style={[styles.correlationList, { borderTopColor: borderColor }]}>
            <View style={styles.correlationItem}>
              <Text style={styles.correlationIcon}>🍽️</Text>
              <View style={styles.correlationContent}>
                <Text style={[styles.correlationTitle, { color: textColor }]}>Metabolic activity spike</Text>
                <Text style={[styles.correlationDesc, { color: subTextColor }]}>Digestion at 11:45 PM elevated resting heart rate.</Text>
              </View>
            </View>

            <View style={styles.correlationItem}>
              <Text style={styles.correlationIcon}>🛏️</Text>
              <View style={styles.correlationContent}>
                <Text style={[styles.correlationTitle, { color: textColor }]}>Reduced REM stability</Text>
                <Text style={[styles.correlationDesc, { color: subTextColor }]}>
                  Body focused on processing nutrients during peak rest cycles.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={[styles.recommendationsTitle, { color: textColor }]}>Recommendations</Text>
          <TouchableOpacity style={[styles.recommendationItem, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={styles.recommendationIcon}>💧</Text>
            <Text style={[styles.recommendationText, { color: textColor }]}>Increase hydration today</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recommendationItem, { backgroundColor: cardItemBg, borderColor }]}>
            <Text style={styles.recommendationIcon}>⏰</Text>
            <Text style={[styles.recommendationText, { color: textColor }]}>Set meal reminder for 7 PM</Text>
          </TouchableOpacity>
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
  hrvSection: {
    alignItems: 'center',
    marginBottom: 32
  },
  hrvIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.2)'
  },
  hrvIconText: {
    fontSize: 32
  },
  hrvValue: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1
  },
  hrvUnit: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4
  },
  hrvLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 12
  },
  statusBadge: {
    backgroundColor: 'rgba(251, 146, 60, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.2)'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FB923C',
    letterSpacing: 1
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
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8
  },
  dayLabel: {
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
    marginBottom: 12
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16
  },
  insightHighlight: {
    fontWeight: '700'
  },
  correlationList: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 12
  },
  correlationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  correlationIcon: {
    fontSize: 20,
    marginTop: 2
  },
  correlationContent: {
    flex: 1
  },
  correlationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  correlationDesc: {
    fontSize: 12,
    lineHeight: 16
  },
  recommendationsSection: {
    marginBottom: 24
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },
  recommendationItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  recommendationIcon: {
    fontSize: 20
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20
  }
});
