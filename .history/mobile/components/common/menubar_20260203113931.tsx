import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import {
  Settings as SettingsIcon,
  ChevronLeft,
  Bell,
  Shield,
  Globe,
  Info,
  LogOut,
  Trash2,
  Download,
  User,
  Eye,
  Scale,
  Moon,
  Sun,
  Accessibility
} from 'lucide-react-native';

type SettingsCategory = 'notifications' | 'privacy' | 'preferences' | 'about' | 'account' | 'legal' | null;

type MenubarProps = {
  onClose?: () => void;
};

export default function Menubar({ onClose }: MenubarProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const [activeSettingsCategory, setActiveSettingsCategory] = useState<SettingsCategory>(null);

  const errorColor = colors.statusError || '#FF3B30';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [dataSharing, setDataSharing] = useState(false);
  const [researchParticipation, setResearchParticipation] = useState(false);
  const [language] = useState('English');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleSettingsBack = () => {
    setActiveSettingsCategory(null);
  };

  // ------------------- SETTINGS MAIN LIST -------------------
  const renderSettingsMainList = () => (
    <View style={styles.settingsContainer}>
      <Text style={[styles.settingsTitle, { color: colors.text }]}>Settings</Text>
      
      {[
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'privacy', icon: Shield, label: 'Privacy & Data' },
        { id: 'preferences', icon: Globe, label: 'App Preferences' },
        { id: 'about', icon: Info, label: 'About' },
        { id: 'account', icon: User, label: 'Account Actions' },
      ].map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[styles.settingsItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => setActiveSettingsCategory(category.id as SettingsCategory)}
          activeOpacity={0.7}
        >
          <category.icon size={22} color={colors.accent} />
          <Text style={[styles.settingsItemText, { color: colors.text }]}>
            {category.label}
          </Text>
          <ChevronLeft size={20} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      ))}
    </View>
  );

  // ------------------- NOTIFICATIONS SETTINGS -------------------
  const renderNotificationsSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Notifications</Text>
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Notifications</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            Receive app notifications
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Frequency</Text>
      {['hourly', 'daily', 'weekly'].map((freq) => (
        <TouchableOpacity
          key={freq}
          style={[styles.optionItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => setNotificationFrequency(freq as 'hourly' | 'daily' | 'weekly')}
        >
          <Text style={[styles.optionText, { color: notificationFrequency === freq ? colors.accent : colors.text }]}>
            {freq.charAt(0).toUpperCase() + freq.slice(1)}
          </Text>
          {notificationFrequency === freq && <Text style={{ color: colors.accent }}>✓</Text>}
        </TouchableOpacity>
      ))}

      <View style={styles.settingRow}>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Critical Alerts Only</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            Only urgent health alerts
          </Text>
        </View>
        <Switch
          value={criticalAlertsOnly}
          onValueChange={setCriticalAlertsOnly}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );

  // ------------------- PRIVACY & DATA SETTINGS -------------------
  const renderPrivacySettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Privacy & Data</Text>
      </View>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Privacy Level</Text>
      {['low', 'medium', 'high'].map((level) => (
        <TouchableOpacity
          key={level}
          style={[styles.optionItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => setPrivacyLevel(level as 'low' | 'medium' | 'high')}
        >
          <View style={styles.optionRow}>
            <Eye size={18} color={privacyLevel === level ? colors.accent : colors.text} />
            <Text style={[styles.optionText, { color: privacyLevel === level ? colors.accent : colors.text }]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </View>
          {privacyLevel === level && <Text style={{ color: colors.accent }}>✓</Text>}
        </TouchableOpacity>
      ))}

      <View style={styles.settingRow}>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Data Sharing</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            Share anonymous health data
          </Text>
        </View>
        <Switch
          value={dataSharing}
          onValueChange={setDataSharing}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Research Participation</Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            Join health research studies
          </Text>
        </View>
        <Switch
          value={researchParticipation}
          onValueChange={setResearchParticipation}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.backgroundCard }]}>
        <Download size={20} color={colors.accent} />
        <Text style={[styles.dangerButtonText, { color: colors.accent }]}>Download My Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.backgroundCard }]}>
        <Trash2 size={20} color={errorColor} />
        <Text style={[styles.dangerButtonText, { color: errorColor }]}>Delete My Data</Text>
      </TouchableOpacity>
    </View>
  );

  // ------------------- APP PREFERENCES SETTINGS -------------------
  const renderPreferencesSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>App Preferences</Text>
      </View>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Language</Text>
      <TouchableOpacity style={[styles.optionItem, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.optionText, { color: colors.text }]}>{language}</Text>
      </TouchableOpacity>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Units</Text>
      {['metric', 'imperial'].map((unit) => (
        <TouchableOpacity
          key={unit}
          style={[styles.optionItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => setUnits(unit as 'metric' | 'imperial')}
        >
          <View style={styles.optionRow}>
            <Scale size={18} color={units === unit ? colors.accent : colors.text} />
            <Text style={[styles.optionText, { color: units === unit ? colors.accent : colors.text }]}>
              {unit === 'metric' ? 'Metric (kg, bpm, mmol)' : 'Imperial (lb, bpm, mg/dL)'}
            </Text>
          </View>
          {units === unit && <Text style={{ color: colors.accent }}>✓</Text>}
        </TouchableOpacity>
      ))}

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Theme</Text>
      {['light', 'dark', 'system'].map((t) => (
        <TouchableOpacity
          key={t}
          style={[styles.optionItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => setTheme(t as 'light' | 'dark' | 'system')}
        >
          <View style={styles.optionRow}>
            {t === 'light' ? <Sun size={18} color={theme === t ? colors.accent : colors.text} /> : 
             t === 'dark' ? <Moon size={18} color={theme === t ? colors.accent : colors.text} /> :
             <Accessibility size={18} color={theme === t ? colors.accent : colors.text} />}
            <Text style={[styles.optionText, { color: theme === t ? colors.accent : colors.text }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </View>
          {theme === t && <Text style={{ color: colors.accent }}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );

  // ------------------- ABOUT SETTINGS -------------------
  const renderAboutSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>About</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.appVersion, { color: colors.text }]}>MED-BRAIN v1.0.0</Text>
        <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
          Your Personal Health Intelligence Platform
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}
        onPress={() => setActiveSettingsCategory('legal')}
      >
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Privacy & Terms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Open Source Licenses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );

  // ------------------- PRIVACY & TERMS PAGE -------------------
  const renderLegalSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Privacy & Terms</Text>
      </View>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Terms & Conditions</Text>
      <View style={[styles.contentCard, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          By using MED-BRAIN, you agree to these terms and conditions. MED-BRAIN is a health intelligence platform that provides personalized health insights based on your data.
        </Text>
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          We are not a medical device and do not provide medical advice. Always consult with healthcare professionals for medical decisions.
        </Text>
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          Your use of the app is subject to these terms, and we reserve the right to update them as needed.
        </Text>
      </View>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>Privacy Policy</Text>
      <View style={[styles.contentCard, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          We take your privacy seriously. MED-BRAIN collects health-related data to provide personalized insights and recommendations.
        </Text>
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          Your data is encrypted and stored securely. We do not sell your personal information to third parties.
        </Text>
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          You can request to delete your data at any time through the Account Actions section in Settings.
        </Text>
        <Text style={[styles.contentText, { color: colors.textSecondary }]}>
          We use your data only to improve our services and provide you with better health insights.
        </Text>
      </View>
    </View>
  );

  // ------------------- ACCOUNT ACTIONS SETTINGS -------------------
  const renderAccountSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Account Actions</Text>
      </View>

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.backgroundCard }]}>
        <LogOut size={22} color={colors.text} />
        <Text style={[styles.accountButtonText, { color: colors.text }]}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.backgroundCard }]}>
        <Trash2 size={22} color={errorColor} />
        <Text style={[styles.dangerButtonText, { color: errorColor }]}>Delete Account</Text>
      </TouchableOpacity>

      <Text style={[styles.warningText, { color: colors.textSecondary }]}>
        These actions are irreversible. Please be sure before proceeding.
      </Text>
    </View>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Settings sub-sections */}
          {activeSettingsCategory === 'notifications' && renderNotificationsSettings()}
          {activeSettingsCategory === 'privacy' && renderPrivacySettings()}
          {activeSettingsCategory === 'preferences' && renderPreferencesSettings()}
          {activeSettingsCategory === 'about' && renderAboutSettings()}
          {activeSettingsCategory === 'account' && renderAccountSettings()}
          {activeSettingsCategory === 'legal' && renderLegalSettings()}
          
          {/* Main settings list */}
          {activeSettingsCategory === null && renderSettingsMainList()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  settingsDetailContainer: {
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 10,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  accountButtonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  contentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});
