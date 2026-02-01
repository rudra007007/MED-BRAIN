import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Shield, HelpCircle, ChevronRight } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const menuItems = [
    { id: '1', icon: Settings, label: 'Account Settings', hasChevron: true },
    { id: '2', icon: Bell, label: 'Notifications', hasChevron: true },
    { id: '3', icon: Shield, label: 'Privacy & Data', hasChevron: true },
    { id: '4', icon: HelpCircle, label: 'Help & Support', hasChevron: true },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>

        <View style={[styles.profileCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.profilePic}>
            <Text style={[styles.profileText, { color: colors.text }]}>A</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>Alex</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>alex@example.com</Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.accent }]}>87</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days Tracked</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.accent }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Insights Found</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.accent }]}>95%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Data Quality</Text>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.backgroundCard }]}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={item.id} style={[styles.menuItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
                <View style={[styles.menuIcon, { backgroundColor: colorScheme === 'dark' ? '#1A3A44' : '#F0FBFF' }]}>
                  <Icon size={22} color={colors.accent} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                {item.hasChevron && <ChevronRight size={20} color={colors.textSecondary} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.disclaimerCard}>
          <Text style={[styles.disclaimerTitle, { color: colors.text }]}>Health Intelligence Notice</Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            This app provides lifestyle pattern analysis and is not a medical diagnostic tool. Always
            consult a physician for health concerns.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileText: {
    fontSize: 32,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
  },
  menuSection: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  disclaimerCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 19,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});
