import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type LoadingContextValue = {
  show: (message?: string) => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
