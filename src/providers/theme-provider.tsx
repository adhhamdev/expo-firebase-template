import { darkColors, lightColors, type AppColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type ThemeContextValue = {
  colors: AppColors;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
    }),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
