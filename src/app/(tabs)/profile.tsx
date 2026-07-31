import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { FontFamily, Spacing } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const { user, signOut } = useAuth();

  async function onSignOut() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        {user?.email}
      </Text>
      <Button
        title="Sign out"
        variant="secondary"
        onPress={onSignOut}
        style={{ marginTop: Spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
  },
  sub: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    marginTop: Spacing.sm,
  },
});
