import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { FontFamily, Spacing } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";
import { mapAuthError } from "@/lib/errors";
import { registerSchema } from "@/lib/validation/form-schemas";
import { useAuth } from "@/providers/auth-provider";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit() {
    const parsed = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register(parsed.data.email, parsed.data.password);
      router.replace("/(tabs)/home");
    } catch (e) {
      toast.error(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
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
        <Input
          label="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
        />
        <Button title="Register" onPress={onSubmit} loading={loading} />
      </View>
      <Link href="/(auth)/login" style={{ marginTop: Spacing.md }}>
        <Text style={{ color: colors.primary, fontFamily: FontFamily.medium }}>
          Already have an account?
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
    marginBottom: Spacing.lg,
  },
  form: { gap: Spacing.md },
});
