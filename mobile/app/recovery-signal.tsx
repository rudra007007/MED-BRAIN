import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import ChartScrubber from '../components/ui/ChartScrubber';

export default function RecoverySignalScreen() {
  const router = useRouter();
  const hrvData = [60, 55, 70, 50, 75, 55, 62];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recovery Signal</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={24} color="#2DD4BF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hrvSection}>
          <View style={styles.hrvIcon}>
            <Text style={styles.hrvIconText}>💓</Text>
          </View>
          <Text style={styles.hrvValue}>55</Text>
          <Text style={styles.hrvUnit}>ms</Text>
          <Text style={styles.hrvLabel}>Heart Rate Variability (HRV)</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>SLIGHTLY SUPPRESSED</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Trend Analysis</Text>
              <Text style={styles.cardSubtitle}>Vs. 60-day baseline (62ms)</Text>
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
            <Text style={styles.dayLabel}>MON</Text>
            <Text style={styles.dayLabel}>TUE</Text>
            <Text style={styles.dayLabel}>WED</Text>
            <Text style={styles.dayLabel}>THU</Text>
            <Text style={styles.dayLabel}>FRI</Text>
            <Text style={styles.dayLabel}>SAT</Text>
            <Text style={[styles.dayLabel, styles.dayLabelActive]}>SUN</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>AI CORRELATION INSIGHT</Text>
          <Text style={styles.insightText}>
            Recovery signal is slightly suppressed today, likely linked to the{' '}
            <Text style={styles.insightHighlight}>late meal detected last night</Text>.
          </Text>

          <View style={styles.correlationList}>
            <View style={styles.correlationItem}>
              <Text style={styles.correlationIcon}>🍽️</Text>
              <View style={styles.correlationContent}>
                <Text style={styles.correlationTitle}>Metabolic activity spike</Text>
                <Text style={styles.correlationDesc}>Digestion at 11:45 PM elevated resting heart rate.</Text>
              </View>
            </View>

            <View style={styles.correlationItem}>
              <Text style={styles.correlationIcon}>🛏️</Text>
              <View style={styles.correlationContent}>
                <Text style={styles.correlationTitle}>Reduced REM stability</Text>
                <Text style={styles.correlationDesc}>
                  Body focused on processing nutrients during peak rest cycles.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          <TouchableOpacity style={styles.recommendationItem}>
            <Text style={styles.recommendationIcon}>💧</Text>
            <Text style={styles.recommendationText}>Increase hydration today</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendationItem}>
            <Text style={styles.recommendationIcon}>⏰</Text>
            <Text style={styles.recommendationText}>Set meal reminder for 7 PM</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.navLabel}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={[styles.navLabel, styles.navLabelActive]}>INSIGHTS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/insight')}>
          <Text style={styles.navLabel}>TRENDS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    color: '#FFFFFF',
    letterSpacing: -1
  },
  hrvUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 4
  },
  hrvLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
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
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93'
  },
  dayLabelActive: {
    color: '#FFFFFF'
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
    marginBottom: 12
  },
  insightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 16
  },
  insightHighlight: {
    color: '#2DD4BF',
    fontWeight: '700'
  },
  correlationList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
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
    color: '#F0F0F0',
    marginBottom: 2
  },
  correlationDesc: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16
  },
  recommendationsSection: {
    marginBottom: 24
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12
  },
  recommendationItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
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
    color: '#F0F0F0'
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
