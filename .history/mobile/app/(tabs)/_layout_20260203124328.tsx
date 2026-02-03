import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, TrendingUp, Users, BarChart3, Bell, Bot } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import AppHeader from "@/components/common/AppHeader";
import Menubar from "@/components/common/menubar";
import { useThemeColor } from "@/hooks/use-theme-color";

const MENU_WIDTH = Math.min(340, Math.round(Dimensions.get('window').width * 0.86));

// Custom Tab Bar Component
function FloatingTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const accentColor = useThemeColor({}, 'accent');
  
  const tabs = [
    { name: 'index', icon: Home, label: 'Home' },
    { name: 'pattern-insights', icon: BarChart3, label: 'Analysis' },
    { name: 'ViewAnalysisScreen', icon: Bot, label: '', isCenter: true },
    { name: 'community', icon: Users, label: 'Community' },
    { name: 'notification', icon: Bell, label: 'Updates' },
  ];

  const handlePress = (routeName: string) => {
    if (routeName === 'index') {
      router.replace('/(tabs)/index');
    } else {
      router.replace({ pathname: `/(tabs)/${routeName}` });
    }
  };

  return (
    <View style={styles.floatingTabBar}>
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.name) || 
          (tab.name === 'index' && (pathname === '/(tabs)' || pathname === '/')) ||
          (tab.name === 'ViewAnalysisScreen' && pathname.includes('ViewAnalysisScreen'));
        
        if (tab.isCenter) {
          return (
            <View key={tab.name} style={styles.centerTabWrapper}>
              <TouchableOpacity
                style={[styles.centerButton, { backgroundColor: accentColor }]}
                onPress={() => handlePress(tab.name)}
                activeOpacity={0.8}
              >
                <Bot size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handlePress(tab.name)}
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
          tabBarSceneStyle: { backgroundColor: 'transparent' },
        }}
        tabBar={(props) => <FloatingTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{ href: '/(tabs)/index' }}
        />
        <Tabs.Screen
          name="pattern-insights"
          options={{ href: '/(tabs)/pattern-insights' }}
        />
        <Tabs.Screen
          name="ViewAnalysisScreen"
          options={{ href: '/(tabs)/ViewAnalysisScreen' }}
        />
        <Tabs.Screen
          name="community"
          options={{ href: '/(tabs)/community' }}
        />
        <Tabs.Screen
          name="notification"
          options={{ href: '/(tabs)/notification' }}
        />
        <Tabs.Screen
          name="sleep-intelligence"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="activity-detail"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="recovery-signal"
          options={{ href: null }}
        />
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
  centerTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
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

// Text component import at the end to avoid circular dependency
import { Text } from 'react-native';
