import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useSymptomStore } from '../store/symptom.store';
import { useAnalyticsStore } from '../store/analytics.store';

export default function SymptomInputScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    symptoms,
    isLoading,
    error,
    setCurrentInput,
    extractSymptoms
  } = useSymptomStore();

  const { backendStatus, checkBackend } = useAnalyticsStore();
  const [symptomText, setSymptomText] = useState('');

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const handleAnalyze = async () => {
    if (!symptomText.trim()) return;

    try {
      await extractSymptoms(symptomText);
      if (symptoms.length > 0) {
        router.push('/pattern-insights');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to analyze symptoms. Please try again.');
    }
  };

  const quickSymptoms = ['Sharp back pain', 'Fatigue', 'Headache', 'Dizziness'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Symptom Input</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Describe your symptoms</Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}> 
            Explain how you're feeling in your own words, or use a voice note for faster input.
          </Text>
        </View>

        <View style={[styles.inputCard, { backgroundColor: '#1A2942' }]}>
          <TextInput
            style={[styles.input, { color: '#FFFFFF' }]}
            placeholder="I've been feeling a bit dizzy since this morning..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={8}
            value={symptomText}
            onChangeText={(text) => {
              setSymptomText(text);
              setCurrentInput(text);
            }}
            textAlignVertical="top"
            editable={!isLoading}
          />
          <View style={styles.inputFooter}>
            <View style={styles.aiIndicator}>
              <View style={[styles.aiDot, !backendStatus && styles.aiDotOffline]} />
              <Text style={[styles.aiText, { color: colors.textSecondary }]}>
                {backendStatus ? 'AI ANALYSIS READY' : 'BACKEND OFFLINE'}
              </Text>
            </View>
            <TouchableOpacity style={[styles.micButton, { backgroundColor: '#1A2942' }]}>
              <Mic size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <AlertCircle size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {symptoms.length > 0 ? (
          <View style={styles.extractedSection}>
            <Text style={styles.extractedLabel}>EXTRACTED SYMPTOMS</Text>
            <View style={styles.extractedList}>
              {symptoms.map((symptom, index) => (
                <View key={index} style={styles.extractedChip}>
                  <CheckCircle size={16} color="#34C759" />
                  <Text style={styles.extractedText}>{symptom.normalized}</Text>
                  <Text style={styles.confidenceText}>{Math.round(symptom.confidence * 100)}%</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.quickSelectSection}>
          <Text style={[styles.quickSelectLabel, { color: colors.textSecondary }]}>QUICK SELECT</Text>
          <View style={styles.quickSymptomGrid}>
            {quickSymptoms.map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.symptomChip,
                  { borderColor: colorScheme === 'dark' ? '#2C2C2E' : '#3A3A3C' }
                ]}
                onPress={() => setSymptomText(symptomText + (symptomText ? ', ' : '') + symptom)}
                activeOpacity={0.7}
              >
                <Text style={[styles.symptomChipText, { color: '#FFFFFF' }]}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, (!symptomText || isLoading) && styles.continueButtonDisabled]}
          activeOpacity={0.8}
          disabled={!symptomText || isLoading}
          onPress={handleAnalyze}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.continueButtonText}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.continueButtonText}>
                {symptoms.length > 0 ? 'View Analysis' : 'Analyze Symptoms'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={[styles.disclaimerBox, { backgroundColor: '#1A2942' }]}>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}> 
            NON-DIAGNOSTIC TOOL. NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE. ALWAYS CONSULT A
            PHYSICIAN FOR HEALTH CONCERNS.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600'
  },
  placeholder: {
    width: 40
  },
  scrollContent: {
    paddingHorizontal: 20
  },
  titleSection: {
    marginTop: 12,
    marginBottom: 32
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22
  },
  inputCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 140
  },
  inputFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06D6FF',
  },
  aiDotOffline: {
    opacity: 0.4,
  },
  aiText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E5EA'
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickSelectSection: {
    marginBottom: 32,
  },
  quickSelectLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickSymptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomChip: {
    backgroundColor: '#1A2942',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  symptomChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#06D6FF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#1A2942',
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimerBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFECEC',
    marginBottom: 16
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '500'
  },
  extractedSection: {
    marginBottom: 24
  },
  extractedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 12
  },
  extractedList: {
    gap: 10
  },
  extractedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A2942',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12
  },
  extractedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1
  },
  confidenceText: {
    color: '#8E8E93',
    fontSize: 12
  },
  bottomSpacing: {
    height: 30
  }
});
