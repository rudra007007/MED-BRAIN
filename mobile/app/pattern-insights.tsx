import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
  LayoutChangeEvent
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
import ChartScrubber from '../components/ui/ChartScrubber';

type ChartSection = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  data: number[];
  gradientColor: string;
  icon: React.ReactNode;
  insight?: {
    title: string;
    description: string;
  };
};

export default function PatternInsightsScreen() {
  const router = useRouter();

  const chartSections: ChartSection[] = [
    {
      id: 'sleep',
      title: 'Sleep Consistency',
      subtitle: 'Circadian Signal',
      status: 'Drifting Later',
      statusColor: '#14f1d9',
      data: [80, 75, 85, 60, 45, 40, 35],
      gradientColor: '#14f1d9',
      icon: <Heart size={20} color="#14f1d9" />,
      insight: {
        title: 'Change Point Identified',
        description: 'Sleep onset has drifted 45 minutes later over the last 4 days.'
      }
    },
    {
      id: 'physical',
      title: 'Physical Load',
      subtitle: 'Volume Index',
      status: 'Stable',
      statusColor: '#ffffff',
      data: [60, 65, 62, 64, 58, 61, 65],
      gradientColor: '#2d9aff',
      icon: <Activity size={20} color="#2d9aff" />
    },
    {
      id: 'circadian',
      title: 'Circadian Consistency',
      subtitle: 'Routine Stability',
      status: 'High Variance',
      statusColor: '#2d9aff',
      data: [60, 20, 100, 30, 90, 40, 75],
      gradientColor: '#2d9aff',
      icon: <Zap size={20} color="#2d9aff" />,
      insight: {
        title: 'Routine Disruption',
        description: 'Variance in meal times and light exposure has increased by 18% compared to last month.'
      }
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Lifestyle Trends</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>30-Day Relative Trends</Text>
          <Text style={styles.sectionDescription}>
            Comparison of biological signals against baseline. Scrub the charts to see precise daily variance.
          </Text>
        </View>

        {chartSections.map((section) => (
          <View key={section.id} style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.chartTitle}>{section.title}</Text>
                <Text style={styles.chartSubtitle}>{section.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { borderColor: section.statusColor }
                ]}
              >
                <Text style={[styles.statusText, { color: section.statusColor }]}>
                  {section.status}
                </Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <ChartScrubber
                data={section.data}
                height={120}
                gradientFrom={section.gradientColor}
                gradientTo={section.gradientColor}
              />
            </View>

            {section.insight && (
              <View style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <View
                    style={[
                      styles.insightIcon,
                      { backgroundColor: section.statusColor + '20' }
                    ]}
                  >
                    {section.icon}
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{section.insight.title}</Text>
                    <Text style={styles.insightDescription}>{section.insight.description}</Text>
                  </View>
                </View>
              </View>
            )}

            {section.id === 'physical' && (
              <Text style={styles.chartNote}>
                Movement volume remains within 5% of your 90-day baseline.
              </Text>
            )}
          </View>
        ))}

        <View style={styles.communitySection}>
          <View style={styles.communityHeader}>
            <Users size={18} color="rgba(255,255,255,0.3)" />
            <Text style={styles.communityLabel}>Community Pulse</Text>
          </View>
          <Text style={styles.communityText}>
            You are currently experiencing a similar "late-shift" drift as{' '}
            <Text style={styles.communityHighlight}>14% of people</Text> in your city this week.
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
    backgroundColor: '#0a0e0f'
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
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center'
  },
  infoButton: {
    padding: 8
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100
  },
  sectionHeader: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8
  },
  sectionDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20
  },
  chartCard: {
    backgroundColor: '#161c1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    marginBottom: 16
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
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  chartContainer: {
    height: 120,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden'
  },
  insightCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 12
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
  insightContent: {
    flex: 1
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4
  },
  insightDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16
  },
  chartNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12
  },
  communitySection: {
    marginTop: 24,
    marginBottom: 24
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  communityText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20
  },
  communityHighlight: {
    color: '#14f1d9',
    fontWeight: '600'
  },
  bottomSpacing: {
    height: 20
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(10, 14, 15, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
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
    color: 'rgba(255,255,255,0.4)'
  },
  navLabelActive: {
    color: '#14f1d9'
  }
});
