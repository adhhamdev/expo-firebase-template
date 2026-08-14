import { type ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Spacing, Typography } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";

type CollapsibleProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const { colors } = useAppTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setIsOpen((v) => !v)} style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={{ color: colors.textSecondary }}>{isOpen ? "−" : "+"}</Text>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.content}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: Spacing.sm },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  title: { ...Typography.body, fontWeight: "600" },
  content: { paddingBottom: Spacing.sm },
});
