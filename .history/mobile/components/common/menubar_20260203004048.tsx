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

  // Settings local state for toggles and selections
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
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
      
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

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.errorBackground }]}>
        <Trash2 size={20} color={colors.error} />
        <Text style={[styles.dangerButtonText, { color: colors.error }]}>Delete My Data</Text>
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
        <TouchableOpacity onPress={handleSettingsBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.accent} />
          <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.detailTitle, { color: colors.text }]}>Account Actions</Text>
      </View>

      <TouchableOpacity style={[styles.accountButton, { backgroundColor: colors.backgroundCard }]}>
        <LogOut size={22} color={colors.text} />
        <Text style={[styles.accountButtonText, { color: colors.text }]}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dangerButton, { backgroundColor: colors.errorBackground }]}>
        <Trash2 size={22} color={colors.error} />
        <Text style={[styles.dangerButtonText, { color: colors.error }]}>Delete Account</Text>
      </TouchableOpacity>

      <Text style={[styles.warningText, { color: colors.textSecondary }]}>
        These actions are irreversible. Please be sure before proceeding.
      </Text>
    </View>
  );

  // ------------------- HOME / DASHBOARD CONTENT -------------------
  const renderHomeContent = () => (
    <View style={styles.contentContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Dashboard</Text>
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
