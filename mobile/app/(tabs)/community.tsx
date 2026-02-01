import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Activity, Shield } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { communityTrends } from '../../mocks/healthdata';
import type { CommunityTrend } from '../../types/health';

export default function CommunityScreen() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rising':
        return <TrendingUp size={16} color="#FF3B30" />;
      case 'improving':
        return <TrendingDown size={16} color="#34C759" />;
      case 'emerging':
        return <Activity size={16} color="#FFB800" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rising':
        return '#FF3B30';
      case 'improving':
        return '#34C759';
      case 'emerging':
        return '#FFB800';
      default:
        return '#8E8E93';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'rising':
        return '#FFE5E5';
      case 'improving':
        return '#E5F7E5';
      case 'emerging':
        return '#FFF4E0';
      default:
        return '#F5F5F7';
    }
  };

  const getChartImage = (chart?: string) => {
    if (chart === 'allergy') {
      return 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=200&fit=crop';
    }
    if (chart === 'sleep') {
      return 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=200&fit=crop';
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Trends</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Shield size={20} color="#06D6FF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Anonymized Regional Data</Text>
            <Text style={styles.infoText}>
              Aggregated signals for community awareness. This is not a diagnostic tool.
            </Text>
          </View>
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Greater London</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Past 24h</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>All Signals</Text>
          </View>
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>London</Text>
          <View style={styles.mapOverlay}>
            <View style={[styles.mapLegendItem, { backgroundColor: '#06D6FF' }]}>
              <Text style={styles.mapLegendText}>Rising Signal</Text>
            </View>
            <View style={[styles.mapLegendItem, { backgroundColor: '#E5E5EA' }]}>
              <Text style={styles.mapLegendText}>Stable</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Early Signal Warnings</Text>
          <Text style={styles.alertCount}>3 Active Alerts</Text>
        </View>

        {communityTrends.map((trend: CommunityTrend) => {
          const chartImage = getChartImage(trend.chart);
          const statusColor = getStatusColor(trend.status);
          const statusBg = getStatusBg(trend.status);

          return (
            <TouchableOpacity key={trend.id} style={styles.trendCard} activeOpacity={0.7}>
              <View style={styles.trendContent}>
                <View style={[styles.trendBadge, { backgroundColor: statusBg }]}>
                  {getStatusIcon(trend.status)}
                  <Text style={[styles.trendBadgeText, { color: statusColor }]}>
                    {trend.status.toUpperCase().replace('-', ' ')}
                  </Text>
                </View>
                <Text style={styles.trendTitle}>{trend.title}</Text>
                <Text style={styles.trendDescription}>{trend.description}</Text>
                <View style={styles.trendAction}>
                  <Text style={styles.trendActionText}>
                    {trend.status === 'rising' ? 'View Deep Dive' : trend.status === 'improving' ? 'Details' : 'Compare Lifestyle'}
                  </Text>
                </View>
              </View>
              {chartImage && (
                <Image source={{ uri: chartImage }} style={styles.trendChart} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>SIGNALS ANALYZED</Text>
            <Text style={styles.statValue}>12.4M +</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DATA INTEGRITY</Text>
            <Text style={styles.statValue}>Anonymized</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  infoCard: {
    backgroundColor: '#E8F8FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#636366',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#D6F5FF',
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#06D6FF',
    opacity: 0.3,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 8,
  },
  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapLegendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  alertCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06D6FF',
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
    flexDirection: 'row',
    gap: 16,
  },
  trendContent: {
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    marginBottom: 12,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  trendDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636366',
    marginBottom: 12,
  },
  trendAction: {
    alignSelf: 'flex-start',
  },
  trendActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06D6FF',
  },
  trendChart: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  bottomSpacing: {
    height: 20,
  },
});
