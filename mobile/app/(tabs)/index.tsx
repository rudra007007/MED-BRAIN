import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Activity as ActivityIcon, Heart, Lightbulb, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { currentHealthSignals, riskDriftData, recentIntelligence } from '../../mocks/healthdata';
import type { HealthSignal } from '../../types/health';

export default function HomeScreen() {
  const router = useRouter();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <Moon size={28} color="#06D6FF" />;
      case 'activity':
        return <ActivityIcon size={28} color="#06D6FF" />;
      case 'recovery':
        return <Heart size={28} color="#06D6FF" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profilePic}>
            <Text style={styles.profileText}>A</Text>
          </View>
          <Text style={styles.headerTitle}>Health Intelligence</Text>
          <View style={styles.logoContainer}>
            <Sparkles size={24} color="#06D6FF" />
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getTimeGreeting()}, Alex</Text>
          <Text style={styles.statusText}>{riskDriftData.message}</Text>
        </View>

        <TouchableOpacity 
          style={styles.riskCard}
          activeOpacity={0.9}
          onPress={() => router.push('/pattern-insights')}
        >
          <View style={styles.riskCardHeader}>
            <View style={styles.waveBackground}>
              <View style={styles.wave} />
              <View style={[styles.wave, styles.wave2]} />
            </View>
            <Text style={styles.riskStatus}>Stable</Text>
            <View style={styles.riskBadge}>
              <Text style={styles.riskBadgeText}>→ LOW RISK DRIFT</Text>
            </View>
          </View>

          <View style={styles.riskCardContent}>
            <Text style={styles.aiLabel}>AI ANALYSIS</Text>
            <Text style={styles.riskTitle}>Risk Drift Indicator</Text>
            <Text style={styles.riskDescription}>{riskDriftData.description}</Text>
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Analysis</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Health Signals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/insight')}>
            <Text style={styles.historyLink}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signalsGrid}>
          {currentHealthSignals.map((signal: HealthSignal) => (
            <View key={signal.id} style={styles.signalCard}>
              <View style={styles.signalIcon}>{getSignalIcon(signal.type)}</View>
              <Text style={styles.signalLabel}>{signal.label}</Text>
              <Text style={styles.signalValue}>{signal.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What changed recently</Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Lightbulb size={24} color="#06D6FF" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightText}>{recentIntelligence.message}</Text>
            <Text style={styles.insightSuggestion}>{recentIntelligence.suggestion}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 24,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'center',
  },
  logoContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  riskCardHeader: {
    backgroundColor: '#D6F5FF',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wave: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#B8EEFF',
    opacity: 0.4,
    borderRadius: 100,
    transform: [{ scaleX: 3 }],
    top: 20,
  },
  wave2: {
    top: 40,
    opacity: 0.3,
  },
  riskStatus: {
    fontSize: 48,
    fontWeight: '800',
    color: '#06D6FF',
    marginBottom: 8,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 214, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06D6FF',
    letterSpacing: 0.5,
  },
  riskCardContent: {
    padding: 24,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  riskDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#636366',
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: '#06D6FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 16,
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
  historyLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#06D6FF',
  },
  signalsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  signalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signalIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F0FBFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  signalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  signalValue: {
    fontSize: 13,
    color: '#8E8E93',
  },
  insightCard: {
    backgroundColor: '#E8F8FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  insightIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#D6F5FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    lineHeight: 22,
    marginBottom: 8,
  },
  insightSuggestion: {
    fontSize: 14,
    color: '#636366',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
