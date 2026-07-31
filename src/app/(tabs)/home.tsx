import { Screen } from "@/components/ui/screen";
import { FontFamily, Spacing } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/providers/auth-provider";
import { StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Home</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Signed in as {user?.email ?? "guest"}
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Replace this screen and add features under src/features/.
      </Text>
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
  hint: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    marginTop: Spacing.lg,
  },
});
