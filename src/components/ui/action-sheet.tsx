import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { IconName } from "@/components/ui/icon";
import { Spacing, Typography } from "@/constants/design-tokens";
import { useAppTheme } from "@/hooks/use-app-theme";

export type ActionSheetItem = {
  key?: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: IconName;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  items?: ActionSheetItem[];
  /** Alias used by ConfirmProvider */
  actions?: ActionSheetItem[];
  cancelLabel?: string;
};

export function ActionSheet({
  visible,
  onClose,
  title,
  message,
  items,
  actions,
  cancelLabel = "Cancel",
}: Props) {
  const { colors } = useAppTheme();
  const list = items ?? actions ?? [];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {title ? (
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          ) : null}
          {message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
          ) : null}
          {list.map((item, index) => (
            <Pressable
              key={item.key ?? `${item.label}-${index}`}
              onPress={() => {
                onClose();
                item.onPress();
              }}
              style={styles.row}
            >
              <Text
                style={[
                  styles.label,
                  { color: item.destructive ? colors.error : colors.text },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose} style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  title: {
    ...Typography.body,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  message: {
    ...Typography.caption,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  row: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    ...Typography.body,
    textAlign: "center",
  },
});
