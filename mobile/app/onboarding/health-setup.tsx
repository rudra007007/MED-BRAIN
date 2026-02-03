import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Moon, Heart, Footprints, CheckCircle, RefreshCw, Activity } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HealthSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for data points
  const [selectedPoints, setSelectedPoints] = useState({
    sleep: true,
    heartRate: true,
    steps: true
  });

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const cardColor = useThemeColor({}, 'backgroundCard');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'tint');
  const itemBg = useThemeColor({}, 'backgroundAccent');

  const togglePoint = (key: keyof typeof selectedPoints) => {
    setSelectedPoints(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding/trust-privacy');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Intelligence Setup</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>

        <View style={styles.headingSection}>
          <Text style={[styles.heading, { color: textColor }]}>Connect your health data</Text>
          <Text style={[styles.subheading, { color: subTextColor }]}>Sync your existing devices to enable non-diagnostic trend analysis.</Text>
        </View>

        {/* Info Card */}
        <View style={[styles.cardContainer, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.cardContent}>
            <View style={styles.iconWrapper}>
              <RefreshCw size={24} color="#13c8ec" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={[styles.cardTitle, { color: textColor }]}>Building your baseline</Text>
              <Text style={[styles.cardDescription, { color: subTextColor }]}>
                To build your personal baseline, we sync your existing sleep and activity signals. This helps AI identify lifestyle risk drift.
              </Text>
            </View>
          </View>
        </View>

        {/* Replaced 'Connect Apple Health' with generic 'Connect Health Data' or relevant action */}
        {/* User requested "Remove the option 'Connect Apple Health' with some relevant option" */}
        <TouchableOpacity style={styles.connectButton}>
          <Activity size={24} color="#000" />
          <Text style={styles.connectButtonText}>Connect Health Sources</Text>
        </TouchableOpacity>

        {/* Data Points Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>DATA POINTS TO BE SYNCED</Text>

          <View style={styles.listContainer}>
            {/* Item 1: Sleep */}
            <TouchableOpacity
              style={[
                styles.listItem,
                { backgroundColor: itemBg, borderColor },
                selectedPoints.sleep && { borderColor: '#13c8ec', backgroundColor: 'rgba(19, 200, 236, 0.05)' }
              ]}
              onPress={() => togglePoint('sleep')}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <Moon size={24} color="#13c8ec" />
                <Text style={[styles.itemText, { color: textColor }]}>Sleep stages</Text>
              </View>
              <CheckCircle
                size={24}
                color={selectedPoints.sleep ? "#13c8ec" : subTextColor}
                fill={selectedPoints.sleep ? "#13c8ec" : "transparent"}
                stroke={selectedPoints.sleep ? "#1c2527" : subTextColor}
              />
            </TouchableOpacity>

            {/* Item 2: Heart Rate */}
            <TouchableOpacity
              style={[
                styles.listItem,
                { backgroundColor: itemBg, borderColor },
                selectedPoints.heartRate && { borderColor: '#13c8ec', backgroundColor: 'rgba(19, 200, 236, 0.05)' }
              ]}
              onPress={() => togglePoint('heartRate')}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <Heart size={24} color="#13c8ec" />
                <Text style={[styles.itemText, { color: textColor }]}>Heart Rate</Text>
              </View>
              <CheckCircle
                size={24}
                color={selectedPoints.heartRate ? "#13c8ec" : subTextColor}
                fill={selectedPoints.heartRate ? "#13c8ec" : "transparent"}
                stroke={selectedPoints.heartRate ? "#1c2527" : subTextColor}
              />
            </TouchableOpacity>

            {/* Item 3: Steps */}
            <TouchableOpacity
              style={[
                styles.listItem,
                { backgroundColor: itemBg, borderColor },
                selectedPoints.steps && { borderColor: '#13c8ec', backgroundColor: 'rgba(19, 200, 236, 0.05)' }
              ]}
              onPress={() => togglePoint('steps')}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <Footprints size={24} color="#13c8ec" />
                <Text style={[styles.itemText, { color: textColor }]}>Steps</Text>
              </View>
              <CheckCircle
                size={24}
                color={selectedPoints.steps ? "#13c8ec" : subTextColor}
                fill={selectedPoints.steps ? "#13c8ec" : "transparent"}
                stroke={selectedPoints.steps ? "#1c2527" : subTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* Bottom Actions */}
        <View style={styles.footer}>
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

          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Text style={[styles.skipText, { color: subTextColor }]}>Maybe later</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpace: {
    width: 48,
  },
  scrollContent: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 9999,
    backgroundColor: '#3b4f54',
  },
  progressDotActive: {
    backgroundColor: '#13c8ec',
  },
  headingSection: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 8,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  cardContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconWrapper: {
    backgroundColor: 'rgba(19, 200, 236, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  connectButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionContainer: {
    gap: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#5c757a',
    paddingHorizontal: 4,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 32,
    gap: 16,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#13c8ec',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13c8ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#101f22',
    fontSize: 18,
    fontWeight: '700',
  },
  skipText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 32,
  }
});
