import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, TrendingUp, Users, MessageCircle, Bell, Sparkles } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import AppHeader from "@/components/common/AppHeader";
import Menubar from "@/components/common/menubar";
import { useThemeColor } from "@/hooks/use-theme-color";

const MENU_WIDTH = Math.min(340, Math.round(Dimensions.get('window').width * 0.86));

// Custom Tab Bar Component
function FloatingTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const GREEN_PRIMARY = '#22C55E';

  const tabs = [
    { name: 'index', path: '/', icon: Home, label: 'Home' },
    { name: 'pattern-insights', path: '/pattern-insights', icon: TrendingUp, label: 'Insights' },
    { name: 'community', path: '/community', icon: Users, label: 'Community' },
    { name: 'ViewAnalysisScreen', path: '/ViewAnalysisScreen', icon: MessageCircle, label: 'Chat' },
    { name: 'notification', path: '/notification', icon: Bell, label: 'Updates' },
  ];

  const centerIndex = Math.floor(tabs.length / 2);
  const leftTabs = tabs.slice(0, centerIndex);
  const rightTabs = tabs.slice(centerIndex + 1);
  const centerTab = tabs[centerIndex];

  const handlePress = (path: string) => {
    router.replace(path as any);
  };

  const isPathActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/(tabs)';
    }
    return pathname.includes(path.replace('/', ''));
  };

  const renderTab = (tab: typeof tabs[0], isCenter: boolean = false) => {
    const isActive = isPathActive(tab.path);

    if (isCenter) {
      return (
        <View key={tab.name} style={styles.centerTabContainer}>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={() => handlePress(tab.path)}
            activeOpacity={0.7}
          >
            <View style={styles.centerButtonInner}>
              <tab.icon size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={tab.name}
        style={styles.tabItem}
        onPress={() => handlePress(tab.path)}
        activeOpacity={0.6}
      >
        <View style={styles.iconWrapper}>
          <tab.icon
            size={22}
            color={isActive ? GREEN_PRIMARY : '#D1D5DB'}
            strokeWidth={1.5}
          />
          {isActive && <View style={[styles.activeDot, { backgroundColor: GREEN_PRIMARY }]} />}
        </View>
        <Text style={[
          styles.tabLabel,
          { color: isActive ? GREEN_PRIMARY : '#9CA3AF' }
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.floatingTabBar}>
      {leftTabs.map((tab) => renderTab(tab))}
      {renderTab(centerTab, true)}
      {rightTabs.map((tab) => renderTab(tab))}
    </View>
  );
}

export default function TabLayout() {
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menuAnim]);

  const closeMenu = useCallback(() => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsMenuOpen(false));
  }, [menuAnim]);

  const overlayOpacity = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const translateX = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [MENU_WIDTH, 0],
  });

  return (
    <>
      <AppHeader userName="Alex" onMenuPress={openMenu} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={() => <FloatingTabBar />}
      >
        <Tabs.Screen name="index" options={{ href: '/' }} />
        <Tabs.Screen name="pattern-insights" options={{ href: '/pattern-insights' }} />
        <Tabs.Screen name="community" options={{ href: '/community' }} />
        <Tabs.Screen name="ViewAnalysisScreen" options={{ href: '/ViewAnalysisScreen' }} />
        <Tabs.Screen name="notification" options={{ href: '/notification' }} />

        <Tabs.Screen name="sleep-intelligence" options={{ href: null }} />
        <Tabs.Screen name="activity-detail" options={{ href: null }} />
        <Tabs.Screen name="recovery-signal" options={{ href: null }} />
      </Tabs>

      <View style={StyleSheet.absoluteFill} pointerEvents={isMenuOpen ? "auto" : "none"}>
        <Animated.View style={[styles.menuOverlay, { opacity: overlayOpacity }]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
        <Animated.View style={[styles.menuPanel, { width: MENU_WIDTH, transform: [{ translateX }] }]}>
          <Menubar onClose={closeMenu} />
        </Animated.View>
      </View>
    </>
  );
}

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = Math.min(width - 32, 380);
const TAB_BAR_HEIGHT = 72;
const CENTER_BUTTON_SIZE = 56;

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 24,
    left: (width - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 48,
  },
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    marginBottom: 8,
  },
  centerButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  centerButtonInner: {
