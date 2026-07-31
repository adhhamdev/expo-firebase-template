import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { FontFamily, Spacing } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";
import { mapAuthError } from "@/lib/errors";
import { loginSchema } from "@/lib/validation/form-schemas";
import { useAuth } from "@/providers/auth-provider";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "email" | "password";
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signIn(parsed.data.email, parsed.data.password);
      router.replace("/(tabs)/home");
    } catch (e) {
      toast.error(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Sign in to continue
      </Text>
      <View style={styles.form}>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <Button title="Sign in" onPress={onSubmit} loading={loading} />
      </View>
      <Link href="/(auth)/register" style={{ marginTop: Spacing.md }}>
        <Text style={{ color: colors.primary, fontFamily: FontFamily.medium }}>
          Create an account
        </Text>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: "center" },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
  },
  sub: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  form: { gap: Spacing.md },
});
