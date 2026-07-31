import { isFirebaseConfigured } from "@/lib/firebase/config";
import { warmUpFirestore } from "@/lib/firebase/init";
import { AuthProvider } from "@/providers/auth-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

const BOOT_BG = "#000000";

SplashScreen.preventAutoHideAsync();

function BootPlaceholder() {
  return (
    <View style={styles.boot}>
      <ActivityIndicator color="#FFFFFF" size="large" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [firebaseReady, setFirebaseReady] = useState(!isFirebaseConfigured);
  const fontsReady = fontsLoaded || fontError != null;

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    void warmUpFirestore()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setFirebaseReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (fontsReady && firebaseReady) {
      void SplashScreen.hideAsync();
    }
  }, [fontsReady, firebaseReady]);

  if (!fontsReady || !firebaseReady) {
    return <BootPlaceholder />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <ThemeProvider>
          <ToastProvider>
            <LoadingProvider>
              <QueryProvider>
                <AuthProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                </AuthProvider>
              </QueryProvider>
            </LoadingProvider>
          </ToastProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  boot: {
    flex: 1,
    backgroundColor: BOOT_BG,
    alignItems: "center",
    justifyContent: "center",
  },
});
