import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = () => {
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileEmail}>alex@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Email Address</Text>
              <Text style={styles.settingValue}>alex@example.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Phone Number</Text>
              <Text style={styles.settingValue}>+1 (555) 123-4567</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Date of Birth</Text>
              <Text style={styles.settingValue}>March 15, 1990</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Notification Frequency</Text>
              <Text style={styles.settingValue}>Daily</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Data Sharing</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Privacy Level</Text>
              <Text style={styles.settingValue}>Standard</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={18} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/insight')}>
          <Text style={styles.navLabel}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/community')}>
          <Text style={styles.navLabel}>Community</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F171A'
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
    justifyContent: 'center',
    alignItems: 'flex-start'
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
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
    color: '#FFFFFF',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  settingItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4
  },
  settingValue: {
    fontSize: 13,
    color: '#8E8E93'
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
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(15, 23, 26, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navItemActive: {
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5
  },
  navLabelActive: {
    color: '#2DD4BF'
  }
});
