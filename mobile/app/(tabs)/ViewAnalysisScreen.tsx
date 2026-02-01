import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { riskDriftData, patternInsights as mockPatternInsights } from '../../mocks/healthdata';
import { useInsightsStore } from '../../store/insights.store';
import { useSymptomStore } from '../../store/symptom.store';
import { useBotStore } from '../../store/bot.store';

export default function ViewAnalysisScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { patternInsights, fetchPatternInsights } = useInsightsStore();
  const { symptoms } = useSymptomStore();
  const { botMessage, setBotMessage, sendBotMessage } = useBotStore();

  useEffect(() => {
    fetchPatternInsights();
  }, [fetchPatternInsights]);

  const insight = patternInsights?.[0] || mockPatternInsights[0];
  const signals = insight?.signals?.length ? insight.signals : symptoms.map((s) => s.normalized);
  const riskData = [0.4, 0.42, 0.5, 0.58, 0.72, 0.8, 0.88];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        >
          <View style={[styles.riskCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.riskCardHeader, { backgroundColor: colors.backgroundAccent }]}
            >
              <View style={styles.waveBackground}>
                <View style={[styles.wave, { backgroundColor: colors.backgroundAccentSecondary }]} />
                <View style={[styles.wave, styles.wave2, { backgroundColor: colors.backgroundAccentSecondary }]} />
              </View>
              <Text style={[styles.riskStatus, { color: colors.accent }]}>Stable</Text>
              <View style={styles.riskBadge}>
                <Text style={[styles.riskBadgeText, { color: colors.accent }]}>→ LOW RISK DRIFT</Text>
              </View>
            </View>

            <View style={styles.riskCardContent}>
              <Text style={[styles.aiLabel, { color: colors.textSecondary }]}>AI ANALYSIS</Text>
              <Text style={[styles.riskTitle, { color: colors.text }]}>Risk Drift Indicator</Text>
              <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>
                {riskDriftData.description}
              </Text>
            </View>
          </View>

          <View style={[styles.lifestyleCard, { backgroundColor: '#1A2942' }]}>
            <View style={styles.lifestyleHeader}>
              <Text style={[styles.lifestyleLabel, { color: colors.textSecondary }]}>LIFESTYLE RISK DRIFT</Text>
              <View style={styles.lifestyleBadge}>
                <Text style={[styles.lifestylePercent, { color: colors.accent }]}>+{Math.abs(insight?.riskChange ?? 0)}%</Text>
                <Text style={[styles.lifestyleSubtext, { color: colors.textSecondary }]}>ABOVE BASELINE</Text>
              </View>
            </View>
            <Text style={[styles.lifestyleTimeframe, { color: colors.text }]}>{insight?.timeframe ?? '7-Day Trend'}</Text>

            <View style={styles.riskChart}>
              {riskData.map((value, index) => (
                <View key={index} style={styles.riskBar}>
                  <View
                    style={[
                      styles.riskBarFill,
                      {
                        height: `${value * 100}%`,
                        backgroundColor: index >= 4 ? '#06D6FF' : '#B8EEFF',
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Extracted Signals</Text>
            <Text style={[styles.signalCount, { color: colors.textSecondary }]}>{signals.length} signals found</Text>
          </View>

          <View style={styles.signalsGrid}>
            {signals.map((signal, index) => (
              <View key={`${signal}-${index}`} style={styles.signalChip}>
                <Text style={[styles.signalChipText, { color: colors.text }]}>{signal}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        <View style={[styles.chatBar, { backgroundColor: colors.backgroundCard, borderTopColor: colors.border }]}>
          <View style={[styles.chatInputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.chatInput, { color: colors.text }]}
              placeholder="Ask the health assistant..."
              placeholderTextColor={colors.textSecondary}
              value={botMessage}
              onChangeText={setBotMessage}
              returnKeyType="send"
              onSubmitEditing={sendBotMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendBotMessage}
              disabled={!botMessage.trim()}
              activeOpacity={0.8}
            >
              <Send size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  riskCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  riskCardHeader: {
    padding: 24,
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
    left: -20,
    right: -20,
    height: 80,
    borderRadius: 40,
    opacity: 0.4,
  },
  wave2: {
    top: 24,
    opacity: 0.25,
  },
  riskStatus: {
    fontSize: 32,
    fontWeight: '800',
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
    letterSpacing: 0.5,
  },
  riskCardContent: {
    padding: 24,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  riskDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  lifestyleCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  lifestyleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lifestyleLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lifestyleBadge: {
    alignItems: 'flex-end',
  },
  lifestylePercent: {
    fontSize: 24,
    fontWeight: '800',
  },
  lifestyleSubtext: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  lifestyleTimeframe: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  riskChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
  },
  riskBar: {
    flex: 1,
    height: 100,
    justifyContent: 'flex-end',
  },
  riskBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  signalCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  signalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  signalChip: {
    backgroundColor: '#1A2942',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  signalChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chatBar: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    height: 48,
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
