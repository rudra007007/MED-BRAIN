import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, LogOut, Sun, Moon, Smartphone } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({}, 'textSecondary');
  const sectionTitleColor = useThemeColor({}, 'textSecondary'); // or textTertiary
  const itemBg = useThemeColor({}, 'backgroundAccent'); // or backgroundCard
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'tint');

  const handleSignOut = () => {
    router.replace('/onboarding/auth');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileSection, { borderBottomColor: borderColor }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={[styles.profileName, { color: textColor }]}>Alex Johnson</Text>
          <Text style={[styles.profileEmail, { color: subTextColor }]}>alex@example.com</Text>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>App Preferences</Text>

          <View style={[styles.settingGroup, { backgroundColor: itemBg, borderColor, borderWidth: 1, borderRadius: 12, overflow: 'hidden' }]}>
            <TouchableOpacity
              style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: borderColor }]}
              onPress={() => setTheme('light')}
            >
              <View style={styles.settingRow}>
                <Sun size={20} color={theme === 'light' ? '#F59E0B' : subTextColor} />
                <Text style={[styles.settingLabel, { color: textColor }]}>Light Mode</Text>
              </View>
              {theme === 'light' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: borderColor }]}
              onPress={() => setTheme('dark')}
            >
              <View style={styles.settingRow}>
                <Moon size={20} color={theme === 'dark' ? '#13c8ec' : subTextColor} />
                <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
              </View>
              {theme === 'dark' && <View style={styles.activeDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setTheme('system')}
            >
              <View style={styles.settingRow}>
                <Smartphone size={20} color={theme === 'system' ? '#10B981' : subTextColor} />
                <Text style={[styles.settingLabel, { color: textColor }]}>System Default</Text>
              </View>
              {theme === 'system' && <View style={styles.activeDot} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Account Settings</Text>
          <TouchableOpacity style={[styles.cardItem, { backgroundColor: itemBg, borderColor }]}>
            <View>
              <Text style={[styles.cardLabel, { color: textColor }]}>Email Address</Text>
              <Text style={[styles.cardValue, { color: subTextColor }]}>alex@example.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.cardItem, { backgroundColor: itemBg, borderColor }]}>
            <View>
              <Text style={[styles.cardLabel, { color: textColor }]}>Phone Number</Text>
              <Text style={[styles.cardValue, { color: subTextColor }]}>+1 (555) 123-4567</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>Health Preferences</Text>
          <TouchableOpacity style={[styles.cardItem, { backgroundColor: itemBg, borderColor }]}>
            <View>
              <Text style={[styles.cardLabel, { color: textColor }]}>Notification Frequency</Text>
              <Text style={[styles.cardValue, { color: subTextColor }]}>Daily</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.cardItem, { backgroundColor: itemBg, borderColor }]}>
            <View>
              <Text style={[styles.cardLabel, { color: textColor }]}>Data Sharing</Text>
              <Text style={[styles.cardValue, { color: subTextColor }]}>Enabled</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={18} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center'
  },
  headerSpace: {
    width: 40
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E'
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  settingGroup: {
    // Styles handled inline for dynamic colors
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#13c8ec',
  },
  cardItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  cardValue: {
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30'
  },
  bottomSpacing: {
    height: 20
  }
});
