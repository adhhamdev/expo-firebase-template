import { isFirebaseConfigured } from "@/lib/firebase/config";
import { warmUpFirestore } from "@/lib/firebase/init";
import { AuthProvider } from "@/providers/auth-provider";
import { ConfirmProvider } from "@/providers/confirm-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import { PushNotificationRegistrar } from "@/providers/push-notification-registrar";
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
import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

const BOOT_BG = "#000000";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 400, fade: true });

function BootPlaceholder() {
  return (
    <View style={styles.boot} accessibilityLabel="Loading">
      <ActivityIndicator color="#FFFFFF" size="large" />
    </View>
  );
}

/** Keeps unexpected rendering failures understandable. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errorScreen}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>Please try again.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Try again"
        onPress={() => void retry()}
        style={({ pressed }) => [
          styles.retryButton,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.retryLabel}>Try again</Text>
      </Pressable>
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
              <ConfirmProvider>
                <QueryProvider>
                  <AuthProvider>
                    <PushNotificationRegistrar />
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="index" />
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="(tabs)" />
                    </Stack>
                  </AuthProvider>
                </QueryProvider>
              </ConfirmProvider>
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
  errorScreen: {
    flex: 1,
    backgroundColor: BOOT_BG,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  errorTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  errorMessage: { color: "#D1D1D1", fontSize: 16 },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryLabel: { color: "#171717", fontSize: 16, fontWeight: "600" },
});
