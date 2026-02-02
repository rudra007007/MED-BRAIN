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
