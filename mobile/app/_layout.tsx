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
      <Stack.Screen name="onboarding/auth" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/personalize" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/health-setup" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/trust-privacy" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="health/symptom-input" options={{ headerShown: false }} />
      <Stack.Screen name="health/pattern-insights" options={{ headerShown: false}} />
      <Stack.Screen name="details/sleep-intelligence" options={{ headerShown: false}} />
      <Stack.Screen name="details/activity-detail" options={{ headerShown: false}} />
      <Stack.Screen name="details/recovery-signal" options={{ headerShown: false}} />
      <Stack.Screen name="profile" options={{ headerShown: false}} />
      <Stack.Screen name="menu" options={{headerShown: false, headerLeft: undefined, }}/>
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
