import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, BarChart3, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { trendDataList } from '../../mocks/healthdata';
import { TrendData } from '../../types/health';



export default function InsightsScreen() {
  const router = useRouter();

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
        return '#FFB800';
      case 'high-variance':
        return '#FF3B30';
      case 'stable':
      default:
        return '#34C759';
    }
  };

  const renderTrendCard = (trend: TrendData) => {
    const statusColor = getStatusColor(trend.status);

    return (
      <View key={trend.metric} style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendLabel}>{trend.label}</Text>
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
              <Text style={styles.changePointTitle}>Change Point Identified</Text>
              <Text style={styles.changePointDesc}>{trend.changePoint.description}</Text>
            </View>
          </View>
        )}

        {trend.description && !trend.changePoint?.detected && (
          <Text style={styles.trendDescription}>{trend.description}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lifestyle Drift</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>30-Day Relative Trends</Text>
          <Text style={styles.pageSubtitle}>
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
            <Text style={styles.communityLabel}>COMMUNITY PULSE</Text>
            <Text style={styles.communityText}>
              You are currently experiencing a similar &quot;late-shift&quot; drift as{' '}
              <Text style={styles.communityHighlight}>14% of people</Text> in your city this week.
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
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#636366',
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#1C1C1E',
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
    backgroundColor: '#F0F9FF',
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
    backgroundColor: '#E0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePointContent: {
    flex: 1,
  },
  changePointTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  changePointDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636366',
  },
  trendDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  communityCard: {
    backgroundColor: '#F5F5F7',
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
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityContent: {
    flex: 1,
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  communityText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636366',
  },
  communityHighlight: {
    fontWeight: '700',
    color: '#06D6FF',
  },
  bottomSpacing: {
    height: 20,
  },
});
