import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Moon, Activity, Zap, Brain, Lock } from 'lucide-react-native';

type FocusOption = 'sleep' | 'activity' | 'recovery' | 'symptoms';

export default function PersonalizeScreen() {
  const router = useRouter();
  const [selectedFocus, setSelectedFocus] = useState<FocusOption>('sleep');
  const [loading, setLoading] = useState(false);

  const focusOptions = [
    {
      id: 'sleep' as FocusOption,
      title: 'Optimize Sleep',
      subtitle: 'Understand cycles and quality drift.',
      icon: <Moon size={32} color="#13c8ec" />
    },
    {
      id: 'activity' as FocusOption,
      title: 'Improve Activity Consistency',
      subtitle: 'Track movement and routine stability.',
      icon: <Activity size={32} color="#13c8ec" />
    },
    {
      id: 'recovery' as FocusOption,
      title: 'Monitor Recovery Trends',
      subtitle: 'Watch HRV and stress baseline shifts.',
      icon: <Zap size={32} color="#13c8ec" />
    },
    {
      id: 'symptoms' as FocusOption,
      title: 'Symptom Understanding',
      subtitle: 'Log and analyze physiological patterns.',
      icon: <Brain size={32} color="#13c8ec" />
    }
  ];

  const handleContinue = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/health-setup');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#13c8ec" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personalize</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>

        <View style={styles.headingSection}>
          <Text style={styles.heading}>Set your focus</Text>
          <Text style={styles.subheading}>We use this to prioritize the insights most relevant to you.</Text>
        </View>

        <View style={styles.optionsContainer}>
          {focusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedFocus === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedFocus(option.id)}
              disabled={loading}
            >
              <View style={styles.optionIconContainer}>
                {option.icon}
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>

              <View style={[
                styles.radioButton,
                selectedFocus === option.id && styles.radioButtonSelected
              ]}>
                {selectedFocus === option.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.privacyNote}>
          <Lock size={16} color="rgba(255,255,255,0.5)" />
          <Text style={styles.privacyText}>Your selections are private and encrypted.</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#101f22" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.stepIndicator}>Step 2 of 4</Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101f22'
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
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center'
  },
  headerSpace: {
    width: 40
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b4f54'
  },
  progressDotActive: {
    backgroundColor: '#13c8ec'
  },
  headingSection: {
    marginBottom: 32
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 36
  },
  subheading: {
    fontSize: 16,
    color: '#9db4b9',
    lineHeight: 22
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b4f54',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    backgroundColor: 'transparent'
  },
  optionCardSelected: {
    borderColor: '#13c8ec',
    backgroundColor: 'rgba(19, 200, 236, 0.05)'
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(19, 200, 236, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionContent: {
    flex: 1
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#9db4b9',
    lineHeight: 18
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3b4f54',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioButtonSelected: {
    borderColor: '#13c8ec'
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#13c8ec'
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 24
  },
  privacyText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#13c8ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  continueButtonDisabled: {
    opacity: 0.7
  },
  continueButtonText: {
    color: '#101f22',
    fontSize: 18,
    fontWeight: '700'
  },
  stepIndicator: {
    fontSize: 14,
    color: '#9db4b9',
    textAlign: 'center',
    marginBottom: 24
  },
  bottomSpacing: {
    height: 32
  }
});
