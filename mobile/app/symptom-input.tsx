import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mic, ArrowRight } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function SymptomInputScreen() {
  const router = useRouter();
  const [symptomText, setSymptomText] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
            onChangeText={setSymptomText}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <View style={styles.aiIndicator}>
              <View style={[styles.aiDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.aiText, { color: colors.textSecondary }]}>AI ANALYSIS READY</Text>
            </View>
            <TouchableOpacity style={[styles.micButton, { backgroundColor: '#1A2942' }]}>
              <Mic size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

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
          style={[styles.continueButton, !symptomText && styles.continueButtonDisabled]}
          activeOpacity={0.8}
          disabled={!symptomText}
          onPress={() => router.push('/pattern-insights')}
        >
          <Text style={[styles.continueButtonText, { color: colors.text }]}>Continue to Analysis</Text>
          <ArrowRight size={20} color={colors.text} />
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
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
