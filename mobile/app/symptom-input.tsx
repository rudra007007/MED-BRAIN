<<<<<<< Updated upstream
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
=======
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
<<<<<<< Updated upstream
import { Colors } from '@/constants/theme';
=======
import { useSymptomStore } from '../store/symptom.store';
import { useAnalyticsStore } from '../store/analytics.store';
>>>>>>> Stashed changes

export default function SymptomInputScreen() {
  const router = useRouter();
  const { 
    currentInput, 
    symptoms, 
    isLoading, 
    error,
    setCurrentInput, 
    extractSymptoms,
    clearSymptoms
  } = useSymptomStore();
  
  const { backendStatus, checkBackend } = useAnalyticsStore();
  const [symptomText, setSymptomText] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    checkBackend();
  }, []);

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
            Explain how you&apos;re feeling in your own words, or use a voice note for faster input.
          </Text>
        </View>

        <View style={[styles.inputCard, { backgroundColor: '#1A2942' }]}>
          <TextInput
            style={[styles.input, { color: '#FFFFFF' }]}
            placeholder="I&apos;ve been feeling a bit dizzy since this morning..."
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
<<<<<<< Updated upstream
              <View style={[styles.aiDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.aiText, { color: colors.textSecondary }]}>AI ANALYSIS READY</Text>
=======
              <View style={[styles.aiDot, backendStatus && styles.aiDotActive]} />
              <Text style={styles.aiText}>
                {backendStatus ? 'AI ANALYSIS READY' : 'BACKEND OFFLINE'}
              </Text>
>>>>>>> Stashed changes
            </View>
            <TouchableOpacity style={[styles.micButton, { backgroundColor: '#1A2942' }]}>
              <Mic size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {symptoms.length > 0 && (
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
        )}

        <View style={styles.quickSelectSection}>
          <Text style={[styles.quickSelectLabel, { color: colors.textSecondary }]}>QUICK SELECT</Text>
          <View style={styles.quickSymptomGrid}>
            {quickSymptoms.map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.symptomChip, { borderColor: colorScheme === 'dark' ? '#2C2C2E' : '#3A3A3C' }]}
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
<<<<<<< Updated upstream
          <Text style={[styles.continueButtonText, { color: colors.text }]}>Continue to Analysis</Text>
          <ArrowRight size={20} color={colors.text} />
=======
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
>>>>>>> Stashed changes
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginTop: 12,
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  input: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    minHeight: 160,
    marginBottom: 16,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
<<<<<<< Updated upstream
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
=======
  aiDotActive: {
    backgroundColor: '#34C759',
>>>>>>> Stashed changes
  },
  aiText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#1A2942',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  extractedSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  extractedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06D6FF',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  extractedList: {
    gap: 8,
  },
  extractedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
    padding: 12,
  },
  extractedText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  confidenceText: {
    color: '#34C759',
    fontSize: 13,
    fontWeight: '600',
  },
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 40,
  },
});
