import { Tabs } from "expo-router";
import { Home, TrendingUp, Users, BarChart3, Bell, Bot } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";
import AppHeader from "@/components/common/AppHeader";
import Menubar from "@/components/common/menubar";
import { useThemeColor } from "@/hooks/use-theme-color";

const MENU_WIDTH = Math.min(340, Math.round(Dimensions.get('window').width * 0.86));

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

  const tabBarBg = useThemeColor({}, 'background'); // or backgroundAccent
  const tabBarBorder = useThemeColor({}, 'border');
  const activeColor = useThemeColor({}, 'tint');
  const inactiveColor = useThemeColor({}, 'tabIconDefault');
  const accentColor = useThemeColor({}, 'accent');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <>
      <AppHeader userName="Alex" onMenuPress={openMenu} />
      <Tabs
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
