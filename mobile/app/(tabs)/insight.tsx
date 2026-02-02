import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, BarChart3, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { trendDataList } from '../../mocks/healthdata';
import { TrendData } from '../../types/health';
import { Colors } from '@/constants/theme';



export default function InsightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderMiniChart = (data: number[]) => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.baselineLine} />
        <View style={styles.chartPoints}>
          {data.map((value, index) => {
            const isLast = index === data.length - 1;
            
            return (
              <View key={index} style={styles.pointColumn}>
                {index < data.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      {
                        height: Math.abs(data[index + 1] - value) * 80,
                        transform: [
                          {
                            translateY: Math.min(
                              (1 - value) * 80,
                              (1 - data[index + 1]) * 80
                            ),
                          },
                        ],
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.point,
                    { bottom: (value * 80) },
                    isLast && styles.pointHighlight,
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'drifting-later':
      case 'drifting-earlier':
        return colors.accent;
      case 'high-variance':
        return colors.accent;
      case 'stable':
      default:
        return colors.accent;
    }
  };

  const renderTrendCard = (trend: TrendData) => {
    const statusColor = getStatusColor(trend.status);

    return (
      <View key={trend.metric} style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={[styles.trendLabel, { color: colors.text }]}>{trend.label}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {trend.statusLabel}
            </Text>
          </View>
        </View>

        {renderMiniChart(trend.data)}

        {trend.changePoint && trend.changePoint.detected && (
          <View style={styles.changePointBox}>
            <View style={styles.changePointIcon}>
              <BarChart3 size={20} color="#06D6FF" />
            </View>
            <View style={styles.changePointContent}>
              <Text style={[styles.changePointTitle, { color: colors.text }]}>Change Point Identified</Text>
              <Text style={[styles.changePointDesc, { color: colors.textSecondary }]}>{trend.changePoint.description}</Text>
            </View>
          </View>
        )}

        {trend.description && !trend.changePoint?.detected && (
          <Text style={[styles.trendDescription, { color: colors.textSecondary }]}>{trend.description}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>30-Day Relative Trends</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textTertiary }]}>
            Comparing current signals to your personal baseline. Highlights indicate significant change
            points where your habits shifted.
          </Text>
        </View>

        {trendDataList.map(renderTrendCard)}

        <View style={styles.communityCard}>
          <View style={styles.communityIcon}>
            <Users size={20} color="#8E8E93" />
          </View>
          <View style={styles.communityContent}>
            <Text style={[styles.communityLabel, { color: colors.textSecondary }]}>COMMUNITY PULSE</Text>
            <Text style={[styles.communityText, { color: colors.text }] }>
              You are currently experiencing a similar &quot;late-shift&quot; drift as{' '}
              <Text style={[styles.communityHighlight, { color: colors.accent }]}>14% of people</Text> in your city this week.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  trendCard: {
    backgroundColor: '#1A2942',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  trendLabel: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chartContainer: {
    height: 100,
    marginBottom: 20,
    position: 'relative',
  },
  baselineLine: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E5EA',
    opacity: 0.5,
  },
  chartPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 100,
    alignItems: 'flex-end',
  },
  pointColumn: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    height: 100,
  },
  connector: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#06D6FF',
    opacity: 0.3,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06D6FF',
    position: 'absolute',
  },
  pointHighlight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#06D6FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePointBox: {
    backgroundColor: '#0F1D2E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#06D6FF',
  },
  changePointIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A2942',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePointContent: {
    flex: 1,
  },
  changePointTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  changePointDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  trendDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  communityCard: {
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  communityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F1D2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityContent: {
    flex: 1,
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  communityText: {
    fontSize: 14,
    lineHeight: 20,
  },
  communityHighlight: {
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 20,
  },
});
