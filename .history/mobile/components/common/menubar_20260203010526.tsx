import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { 
  Home, 
  Bot, 
  Heart, 
  User, 
  Settings as SettingsIcon,
  ChevronLeft,
  Bell,
  Shield,
  Globe,
  Info,
  LogOut,
  Trash2,
  Download,
  Users,
  Eye,
  Scale,
  Moon,
  Sun,
  Accessibility
} from 'lucide-react-native';

// =============================================================================
// TYPES
// =============================================================================

type MainMenuItem = 'home' | 'bot' | 'data' | 'profile' | 'settings';
type SettingsCategory = 'notifications' | 'privacy' | 'preferences' | 'about' | 'account' | null;

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Menubar() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  // State 1: Control main menu selection
  const [activeMenu, setActiveMenu] = useState<MainMenuItem>('home');
  
  // State 2: Control settings sub-sections (null = main settings list)
  const [activeSettingsCategory, setActiveSettingsCategory] = useState<SettingsCategory>(null);

  // Danger color - using statusError from theme
  const errorColor = colors.statusError || '#FF3B30';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [dataSharing, setDataSharing] = useState(false);
  const [researchParticipation, setResearchParticipation] = useState(false);
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================

  // Reset settings when leaving settings
  const handleMenuSelect = (menu: MainMenuItem) => {
    if (menu === 'settings') {
      setActiveMenu('settings');
      setActiveSettingsCategory(null); // Reset to main settings list
    } else {
      setActiveMenu(menu);
      setActiveSettingsCategory(null);
      // Navigate to appropriate page for non-settings menus
      if (menu === 'home') router.push('/');
      if (menu === 'profile') router.push('/profile');
      if (menu === 'bot') router.push('/symptom-input');
      if (menu === 'data') router.push('/health-setup');
    }
  };

  // Handle back button in settings sub-sections
  const handleSettingsBack = () => {
    setActiveSettingsCategory(null);
  };

  // =============================================================================
  // RENDER FUNCTIONS
  // =============================================================================

  // ------------------- MAIN MENU ITEMS -------------------
  const renderMainMenuItems = () => (
    <View style={styles.menuContainer}>
      {[
        { id: 'home', icon: Home, label: 'Home / Dashboard' },
        { id: 'bot', icon: Bot, label: 'Health Bot' },
        { id: 'data', icon: Heart, label: 'Health Data' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'settings', icon: SettingsIcon, label: 'Settings' },
      ].map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, { backgroundColor: colors.backgroundCard }]}
          onPress={() => handleMenuSelect(item.id as MainMenuItem)}
          activeOpacity={0.7}
        >
          <item.icon size={22} color={activeMenu === item.id ? colors.accent : colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ------------------- SETTINGS MAIN LIST -------------------
  const renderSettingsMainList = () => (
    <View style={styles.settingsContainer}>
      {/* Settings Title Box */}
      <View style={[styles.settingsTitleBox, { backgroundColor: colors.backgroundCard }]}>
        <View style={styles.settingsTitleRow}>
          <SettingsIcon size={24} color={colors.accent} />
          <Text style={[styles.settingsTitleText, { color: colors.text }]}>Settings</Text>
        </View>
        <Text style={[styles.settingsSubtitle, { color: colors.textSecondary }]}>
          Manage your app preferences
        </Text>
      </View>
      
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
        <Text style={[styles.detailTitle, { color: colors.text }]}>About</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.appVersion, { color: colors.text }]}>MED-BRAIN v1.0.0</Text>
        <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
          Your Personal Health Intelligence Platform
        </Text>
      </View>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Terms & Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Open Source Licenses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoButton, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.infoButtonText, { color: colors.text }]}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );

  // ------------------- ACCOUNT ACTIONS SETTINGS -------------------
  const renderAccountSettings = () => (
    <View style={styles.settingsDetailContainer}>
      <View style={styles.detailHeader}>
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

  // ------------------- HOME / DASHBOARD CONTENT -------------------
  const renderHomeContent = () => (
    <View style={styles.contentContainer}>
      <View style={[styles.dashboardCard, { backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.dashboardGreeting, { color: colors.text }]}>Welcome back, Alex!</Text>
        <Text style={[styles.dashboardSubtext, { color: colors.textSecondary }]}>
          Your health metrics look good today.
        </Text>
      </View>
      <View style={styles.quickStats}>
        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>72</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg BPM</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>7.2h</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sleep</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>85</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Health Score</Text>
        </View>
      </View>
    </View>
  );

  // ------------------- HEALTH BOT CONTENT -------------------
  const renderBotContent = () => (
    <View style={styles.contentContainer}>
      <View style={[styles.botCard, { backgroundColor: colors.backgroundCard }]}>
        <Bot size={48} color={colors.accent} />
        <Text style={[styles.botTitle, { color: colors.text }]}>AI Health Assistant</Text>
        <Text style={[styles.botDescription, { color: colors.textSecondary }]}>
          Describe your symptoms and get personalized health insights.
        </Text>
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/symptom-input')}
        >
          <Text style={styles.startButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ------------------- HEALTH DATA CONTENT -------------------
  const renderDataContent = () => (
    <View style={styles.contentContainer}>
      <View style={[styles.dataCard, { backgroundColor: colors.backgroundCard }]}>
        <Heart size={48} color={colors.accent} />
        <Text style={[styles.dataTitle, { color: colors.text }]}>Your Health Metrics</Text>
        <Text style={[styles.dataDescription, { color: colors.textSecondary }]}>
          View and manage your health data including vitals, sleep patterns, and lifestyle trends.
        </Text>
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/health-setup')}
        >
          <Text style={styles.startButtonText}>View Health Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ------------------- PROFILE CONTENT -------------------
  const renderProfileContent = () => (
    <View style={styles.contentContainer}>
      <View style={[styles.profileCard, { backgroundColor: colors.backgroundCard }]}>
        <View style={styles.avatar}>
          <User size={40} color={colors.accent} />
        </View>
        <Text style={[styles.profileName, { color: colors.text }]}>Alex</Text>
        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>alex@example.com</Text>
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.startButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* If in settings sub-section, show that content */}
          {activeMenu === 'settings' && activeSettingsCategory === 'notifications' && renderNotificationsSettings()}
          {activeMenu === 'settings' && activeSettingsCategory === 'privacy' && renderPrivacySettings()}
          {activeMenu === 'settings' && activeSettingsCategory === 'preferences' && renderPreferencesSettings()}
          {activeMenu === 'settings' && activeSettingsCategory === 'about' && renderAboutSettings()}
          {activeMenu === 'settings' && activeSettingsCategory === 'account' && renderAccountSettings()}
          
          {/* If in settings main list, show settings list */}
          {activeMenu === 'settings' && !activeSettingsCategory && renderSettingsMainList()}

          {/* If in other main menus, show content */}
          {activeMenu === 'home' && renderHomeContent()}
          {activeMenu === 'bot' && renderBotContent()}
          {activeMenu === 'data' && renderDataContent()}
          {activeMenu === 'profile' && renderProfileContent()}

          {/* Always show main menu navigation */}
          {activeMenu !== 'settings' && renderMainMenuItems()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    backgroundColor: 'black',
  },
  
  // Menu Items
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Settings
  settingsContainer: {
    marginTop: 10,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 14,
  },
  settingsItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  settingsTitleBox: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  settingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  settingsTitleText: {
    fontSize: 24,
    fontWeight: '700',
  },
  settingsSubtitle: {
    fontSize: 14,
    marginLeft: 36,
  },
  settingsList: {
    marginTop: 4,
  },

  // Settings Detail Views
  settingsDetailContainer: {
    marginTop: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 18,
    fontWeight: '700',
  },
  appDescription: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  infoButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  accountButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },

  // Content Areas (Home, Bot, Data, Profile)
  contentContainer: {
    marginBottom: 20,
  },
  dashboardCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  dashboardGreeting: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  dashboardSubtext: {
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  botCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  botTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  botDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  dataCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  dataDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  profileCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(128,128,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
});
