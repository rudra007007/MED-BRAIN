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
import { ArrowLeft, Moon, Heart, Footprints, CheckCircle, RefreshCw, Smartphone } from 'lucide-react-native';

export default function HealthSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/trust-privacy');
      // router.push('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#13c8ec" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Intelligence Setup</Text>
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
          <Text style={styles.heading}>Connect your health data</Text>
          <Text style={styles.subheading}>Sync your existing devices to enable non-diagnostic trend analysis.</Text>
        </View>

        {/* Info Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <View style={styles.iconWrapper}>
              <RefreshCw size={24} color="#13c8ec" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.cardTitle}>Building your baseline</Text>
              <Text style={styles.cardDescription}>
                To build your personal baseline, we sync your existing sleep and activity signals. This helps AI identify lifestyle risk drift.
              </Text>
            </View>
          </View>
        </View>

        {/* Connect Button */}
        <TouchableOpacity style={styles.connectButton}>
          <Heart size={24} color="#000" fill="#000" />
          <Text style={styles.connectButtonText}>Connect Apple Health</Text>
        </TouchableOpacity>

        {/* Data Points Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>DATA POINTS TO BE SYNCED</Text>

          <View style={styles.listContainer}>
            {/* Item 1 */}
            <View style={styles.listItem}>
              <View style={styles.itemLeft}>
                <Moon size={24} color="#13c8ec" />
                <Text style={styles.itemText}>Sleep stages</Text>
              </View>
              <CheckCircle size={24} color="#13c8ec" fill="#13c8ec" stroke="#1c2527" />
              {/* Note: The checkmark in design seems to be filled. Using fill prop if supported or just color. 
                  Standard lucide CheckCircle doesn't fill the circle background easily without fill prop. 
                  Let's assume standard stroke for now or try to match style. 
                  Design shows blue circle with check inside? Or check with circle?
                  The icon is 'check_circle' from material symbols. It's usually a filled circle with a check.
                  Lucide 'CheckCircle' is a circle with a check. detailed implementation depends on library version.
              */}
            </View>

            {/* Item 2 */}
            <View style={styles.listItem}>
              <View style={styles.itemLeft}>
                <Heart size={24} color="#13c8ec" />
                <Text style={styles.itemText}>Heart Rate</Text>
              </View>
              <CheckCircle size={24} color="#13c8ec" fill="#13c8ec" stroke="#1c2527" />
            </View>

            {/* Item 3 */}
            <View style={styles.listItem}>
              <View style={styles.itemLeft}>
                <Footprints size={24} color="#13c8ec" />
                <Text style={styles.itemText}>Steps</Text>
              </View>
              <CheckCircle size={24} color="#13c8ec" fill="#13c8ec" stroke="#1c2527" />
            </View>
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
            <Text style={styles.skipText}>Maybe later</Text>
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
    backgroundColor: '#101f22', // background-dark
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#101f22', // Match body bg or header specific if needed
    // sticky top 0 z-10 equivalent handled by ScrollView structure or just consistent bg
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
    color: '#FFFFFF',
    // right padding handled by headerSpace to center title
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
    backgroundColor: '#3b4f54', // Gray/Dark inactive
  },
  progressDotActive: {
    backgroundColor: '#13c8ec', // Primary
  },
  headingSection: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 8,
    lineHeight: 34,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9db4b9', // text-gray-600 dark mode equivalent roughly
    lineHeight: 24,
  },
  cardContainer: {
    backgroundColor: '#1c2527',
    borderColor: '#3b4f54',
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
    backgroundColor: 'rgba(19, 200, 236, 0.2)', // primary/20
    padding: 8,
    borderRadius: 8,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16, // usually h3 default logic or explicitly set
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#9db4b9',
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
    letterSpacing: 1.5, // tracking-widest
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
    backgroundColor: 'rgba(28, 37, 39, 0.5)', // #1c2527 / 50
    borderColor: 'rgba(59, 79, 84, 0.3)', // #3b4f54 / 30
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
    color: '#e2e8f0', // gray-200
  },
  spacer: {
    flex: 1, // push footer to bottom if container has height
    minHeight: 24,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 32,
    gap: 16,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#13c8ec', // Primary
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
    color: '#9db4b9',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 32,
  }
});
