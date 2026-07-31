import { useAppTheme } from "@/hooks/use-app-theme";
import { FontFamily, Radius, Spacing } from "@/constants/design-tokens";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
}: Props) {
  const { colors } = useAppTheme();
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isGhost
            ? "transparent"
            : isPrimary
              ? colors.primary
              : colors.surface,
          borderColor: isGhost ? colors.border : "transparent",
          borderWidth: isGhost ? 1 : 0,
          opacity: pressed || disabled || loading ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryText : colors.text} />
      ) : (
        <Text
          style={{
            color: isPrimary ? colors.primaryText : colors.text,
            fontFamily: FontFamily.semibold,
            fontSize: 16,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
});
