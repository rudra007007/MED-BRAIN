// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="personalize" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="symptom-input" options={{ headerShown: false }} />
      <Stack.Screen name="pattern-insights" options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="sleep-intelligence" options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="activity-detail" options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="recovery-signal" options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="profile" options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
      <Stack.Screen name="menu" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
