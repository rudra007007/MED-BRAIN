import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, TrendingUp, Users, BarChart3, Bell } from "lucide-react-native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import AppHeader from "@/components/common/AppHeader";
import Menubar from "@/components/common/menubar";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "../../store/auth.store";

const MENU_WIDTH = Math.min(340, Math.round(Dimensions.get('window').width * 0.86));

// Custom Tab Bar Component
function FloatingTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const accentColor = useThemeColor({}, 'accent');

  const tabs = [
    { name: 'index', path: '/', icon: Home, label: 'Home' },
    { name: 'pattern-insights', path: '/pattern-insights', icon: TrendingUp, label: 'Insights' },
    { name: 'community', path: '/community', icon: Users, label: 'Community' },
    { name: 'ViewAnalysisScreen', path: '/ViewAnalysisScreen', icon: BarChart3, label: 'Analysis' },
    { name: 'notification', path: '/notification', icon: Bell, label: 'Updates' },
  ];

  const handlePress = (path: string) => {
    router.replace(path as any);
  };

  return (
    <View style={styles.floatingTabBar}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path ||
          (tab.path === '/' && (pathname === '/(tabs)' || pathname === '/')) ||
          (pathname.includes(tab.name) && tab.name !== 'index');

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
                color={isActive ? accentColor : '#BDBDBD'}
                strokeWidth={1.5}
              />
              {isActive && <View style={[styles.activeDot, { backgroundColor: accentColor }]} />}
            </View>
            <Text style={[
              styles.tabLabel,
              { color: isActive ? accentColor : '#BDBDBD' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const menuAnim = useRef(new Animated.Value(0)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get user from auth store
  const { user } = useAuthStore();
  const userName = user?.username || 'Alex';

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
      <AppHeader userName={userName} onMenuPress={openMenu} />
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
const TAB_BAR_WIDTH = Math.min(width - 32, 360);
const TAB_BAR_HEIGHT = 68;

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 20,
    left: (width - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  menuPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: -4, height: 0 },
    elevation: 20,
  },
});
