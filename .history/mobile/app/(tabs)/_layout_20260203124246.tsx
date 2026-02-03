import { Tabs, useRouter, usePathname } from "expo-router";
import { Home, TrendingUp, Users, BarChart3, Bell, Bot } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View, TouchableOpacity } from "react-native";
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
    router.push(`/(tabs)/${routeName}`);
  };

  return (
    <View style={styles.floatingTabBar}>
      {tabs.map((tab, index) => {
        const isActive = pathname.includes(tab.name) || 
          (tab.name === 'index' && pathname === '/(tabs)') ||
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
        screenOptions={{
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopWidth: 1,
            borderTopColor: tabBarBorder,
            paddingTop: 10,
            paddingBottom: 10,
            height: 70,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 1,
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pattern-insights"
          options={{
            title: "Analysis",
            tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ViewAnalysisScreen"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.chatbotIconContainer}>
                <View style={[styles.chatbotIconCircle, { backgroundColor: accentColor }]}>
                  <Bot size={28} color="#fff" />
                </View>
              </View>
            ),
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 4,
              letterSpacing: 0.3,
              color: tintColor,
            },
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Updates",
            tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="sleep-intelligence"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="activity-detail"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="recovery-signal"
          options={{
            href: null,
            headerShown: false,
          }}
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

const styles = StyleSheet.create({
  chatbotIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  chatbotIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
