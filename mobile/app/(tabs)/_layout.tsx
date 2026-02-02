import { Tabs } from "expo-router";
import { Home, TrendingUp, Users, BarChart3 } from "lucide-react-native";
import React from "react";
import AppHeader from "@/components/common/AppHeader";

export default function TabLayout() {
  return (
    <>
      <AppHeader userName="Alex" />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#14f1d9',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0e0f',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
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
          marginTop: 4,
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
        name="ViewAnalysisScreen"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
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
        name="insight"
        options={{
          title: "Insights",
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}
