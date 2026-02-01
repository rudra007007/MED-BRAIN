import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, ArrowRight } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';

export default function SymptomInputScreen() {
  const router = useRouter();
  const [symptomText, setSymptomText] = useState('');

  const quickSymptoms = ['Sharp back pain', 'Fatigue', 'Headache', 'Dizziness'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Symptom Input</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Describe your symptoms</Text>
          <Text style={styles.pageSubtitle}>
            Explain how you&apos;re feeling in your own words, or use a voice note for faster input.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="I&apos;ve been feeling a bit dizzy since this morning..."
            placeholderTextColor="#636366"
            multiline
            numberOfLines={8}
            value={symptomText}
            onChangeText={setSymptomText}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <View style={styles.aiIndicator}>
              <View style={styles.aiDot} />
              <Text style={styles.aiText}>AI ANALYSIS READY</Text>
            </View>
            <TouchableOpacity style={styles.micButton}>
              <Mic size={24} color="#06D6FF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickSelectSection}>
          <Text style={styles.quickSelectLabel}>QUICK SELECT</Text>
          <View style={styles.quickSymptomGrid}>
            {quickSymptoms.map((symptom, index) => (
              <TouchableOpacity
                key={index}
                style={styles.symptomChip}
                onPress={() => setSymptomText(symptomText + (symptomText ? ', ' : '') + symptom)}
                activeOpacity={0.7}
              >
                <Text style={styles.symptomChipText}>{symptom}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !symptomText && styles.continueButtonDisabled]}
          activeOpacity={0.8}
          disabled={!symptomText}
          onPress={() => router.push('/pattern-insights')}
        >
          <Text style={styles.continueButtonText}>Continue to Analysis</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
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
    backgroundColor: '#1C1C1E',
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
    color: '#8E8E93',
  },
  inputCard: {
    backgroundColor: '#2C2C2E',
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
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06D6FF',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
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
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 16,
  },
  quickSymptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomChip: {
    backgroundColor: '#2C2C2E',
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
    backgroundColor: '#2C2C2E',
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimerBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#8E8E93',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 40,
  },
});
