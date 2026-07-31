import { useAppTheme } from "@/hooks/use-app-theme";
import { FontFamily, Radius, Spacing } from "@/constants/design-tokens";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: 16,
  },
  error: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
});
